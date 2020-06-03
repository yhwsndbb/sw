    
const request = (params) => {
  const baseURL = "https://hk.joyfulboo.com/Campus";
  return new Promise((resolve, reject) => {
    uni.request({
      ...params,
      url: baseURL + params.url,
      header: {
          'Authorization': uni.getStorageSync('token'),
          'content-type': 'application/json' // 默认值
      },
      success: res => {
        // const {
        //   message
        // } = res.data;
        // 请求成功，执行 Promise 的 resolve 回调函数
        resolve(res);
      },
      fail: err => {
        reject(err);
      },
      complete: res => {
        // 3.0 隐藏加载框
        uni.hideLoading();
      }
    })
  });
}

function showLoading(message) {
 if (wx.showLoading) {
  // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
  wx.showLoading({
   title: message,
   mask: true
  });
 } else {
  // 低版本采用Toast兼容处理并将时间设为20秒以免自动消失
  wx.showToast({
   title: message,
   icon: 'loading',
   mask: true,
   duration: 20000
  });
 }
}
  
function hideLoading() {
 if (wx.hideLoading) {
  // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
  wx.hideLoading();
 } else {
  wx.hideToast();
 }
}
// 把封装的方法导出
module.exports = {
  request,
  　showLoading:showLoading,
  　hideLoading:hideLoading
}