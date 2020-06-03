<template>
  <div class='sideTabContainer'>
    <div class="sideTab">
      <ul>
        <li v-for="(item, index) in datas" :key="index" :class='selected === index ? "active" : ""' @click="clickTab(index)">
          <span>{{item.CurriculumName || item.Name}}</span>
        </li>
      </ul>
    </div>
    <div class="tabContent">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    datas: {
      type: Array
    }
  },
  data () {
    return {
      selected: 0
    }
  },
  methods: {
    clickTab (type) {
      this.selected = type
      this.$emit('tabClick', type)
    }
  }
}
</script>

<style lang="less" scoped>
.sideTabContainer {
	text-align: center;
  display: flex;
  min-height: 100vh;
}
.sideTab {
  flex: 3;
  font-size: 30upx;
  background: #F8F8F8;
  color: #40474E;
  li {
    display: inline-block;
    width: 100%;
    padding: 0.2rem 0;
	line-height: 80upx;
    box-sizing: border-box;
    span {
      display: inline-block;
      width: 100%;
	  padding: 0 18upx;
      box-sizing: border-box;
    }
    &.active {
      background: #fff;
      span {
        color: #40474E;
		font-weight: 550;
        border-left: 5px solid #03C173;
      }
    }
  }
}
.tabContent {
  flex: 3;
}
</style>
