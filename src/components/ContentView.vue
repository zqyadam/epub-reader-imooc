<template>
  <transition name="slide-right">
    <div class="content" v-show="showContent">
      <div class="content-wrapper" v-if="bookAvailable">
        <div class="content-item" v-for="(item, index) in navigation.toc" :key="index" @click="jumpTo(item.href)">
          <span class="text" >{{ item.label }}</span>
        </div>
      </div>
      <div class="empty" v-else>加载中...</div>
    </div>
  </transition>
</template>
<script>
/* eslint-disable no-console */
export default {
  props:{
    showContent: {
      type: Boolean,
      default: false
    },
    bookAvailable: Boolean,
    navigation: Object
  },
  watch:{
    navigation(){
      console.log(this.navigation)
    }
  },
  methods:{
    jumpTo(href){
      this.$emit('jumpTo', href);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.content{
  position: absolute;
  top:0;
  left:0;
  z-index: 103;
  height:100%;
  width:70%;
  background-color: #fff;
  // display: flex;
  .content-item{
    @include left;
    box-sizing: border-box;
    padding: px2rem(5) px2rem(10);
    height:px2rem(40);
    width:100%;
    font-size: px2rem(14);
    border-bottom: px2rem(1) solid #ccc;
  }
  .empty{
    @include center;
    font-size: px2rem(16);
    height:100%;
    width:100%;
  }
}
</style>