var signalR = (function() {
  let recordCode = 0x1e;
  let recordString = String.fromCharCode(recordCode);
  let isConnectioned = false;
  let invocationId = 0;
  return {
    getTimestamp: function() {
      let timestamp = Date.parse(new Date());
      return timestamp = timestamp / 1000;
    },
    connection: function(url, queryString, secondString) {
      let reUrl = url;
      let negotiateUrl = url + "/" + 'signalr' + "/negotiate?clientProtocol=2.1&connectionDate=" + encodeURIComponent('[("name":"url: SignalRHub")]') + "&_=" + this.getTimestamp();
      wx.request({
        url: negotiateUrl,
        async: false, //同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。
        method: "GET",
        success: res => {
          this.startSocket(url, res.data, queryString, secondString);
        },
        fail: res => {
          console.log("请求SignalR密钥失败");
          return;
        }
      });
    },
    startSocket: function(url, resdata, queryString, secondString) {
      let that = this;
      let _url = url + "/" + 'signalr' + "/connect?transport=webSockets&clienntProtocol=2.1&connectionToken=" + encodeURIComponent(resdata.ConnectionToken) + "&connectionData=" + encodeURIComponent('[{"name":"SignalRHub"}]');
      if (queryString) {
        _url += _url.indexOf("?") < 0 ? "?" : "&" + ('userId' + '=' + encodeURIComponent(queryString)) + "&" + ('secondString' + '=' + encodeURIComponent(secondString));
      }

      //_url = _url.replace(/^http/, "ws");
      _url = _url.replace(/^https/, "wss");

      const socketTask = wx.connectSocket({
        url: _url,
        success: res => {
          console.log('WebSocket连接创建成功')
        },
        fail: err => {
          console.log('WebSocket连接创建失败' + err)
        },
      });

      wx.onSocketOpen(function() {
        let handshakeRequest = {
          protocol: 'json',
          version: 1
        };
        let senddata = `${JSON.stringify(handshakeRequest)}${recordString}`;
        that.isConnectioned = true;
        console.log('协议发送成功', senddata);
        wx.sendSocketMessage({
          data: senddata,
        });

        that.timeheartStart();
      });

      wx.onSocketClose(function() {
        that.isConnectioned = false;
        console.log('连接已关闭', that.isConnectioned);

      });

      wx.onSocketMessage(function(res) {
        try {
          let jsonstr = String(res.data).replace(recordString, '');
          if (jsonstr.indexOf('{}') > -1)
            jsonstr = jsonstr.replace('{}', '');
          if (jsonstr.length != 0) {
            let obj = JSON.parse(jsonstr);
            console.log('server return :', obj);
            // obj.M[0].M, obj.M[0].A[0]
            if('M' in obj){
              if(obj.M.length >0){
                that.callMethods(obj);
              }
            }
          }
        } catch (ex) {
          console.log('异常：' + ex);
          console.log('收到服务器内容：' + res.data);
        }
      });

      wx.onSocketError(function() {
        that.isConnectioned = false;
        console.log('websocket连接失败！');
      });
    },
    timeheartStart: function() {
      let that = this;
      if (that.isConnectioned) {
        setTimeout(() => {
          that.call('Ping', null);
          //循环心跳
          that.timeheartStart();
        }, 5000);
      }
    },
    callMethods(obj) {
      // obj.M[0].M, obj.M[0].A[0]
      switch (obj.M[0].M) {
        case 'pong':
          console.log('Pong防止nginx中断连接');
          break;
        case 'xcxMessage':
          console.log(obj.M[0].A[0]);
          break;
        case 'displayMessage':
          console.log(obj.M[0].A[0]);
          break;
        default:
          console.log(obj);
      }
    },

    abortConnection: function() {
      console.log(String(this.abortConnection.name));
      wx.closeSocket();
    },
    call: function(method, data, success, fail) {
      let that = this;
      if (!that.isConnectioned) {
        console.log('未连接');
        return;
      }
      let body = {
        H: 'signalrhub',
        M: method,
        A: data,
        I: invocationId.toString()
      };
      invocationId++;

      let senddata = `${JSON.stringify(body)}${recordString}`;
      console.log('发送的数据：', senddata);
      wx.sendSocketMessage({
        data: senddata,
        success: success,
        fail: fail
      });
    }
  }
});

module.exports.signalR = signalR