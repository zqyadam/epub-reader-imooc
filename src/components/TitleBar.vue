<template>
  <div>
    <transition name="slide-down">
      <div class="title-wrapper" v-show="show">
        <div class="left">
          <div class="icon-wrapper">
            <span class="icon-fanhui iconfont"></span>
          </div>
        </div>
        <div class="right">
          <div class="icon-wrapper">
            <span class="iconfont icon-cart"></span>
          </div>
          <div class="icon-wrapper">
            <span class="iconfont icon-ionc--"></span>
          </div>
          <div class="icon-wrapper">
            <span class="iconfont icon-more"></span>
          </div>
        </div>
      </div>
    </transition>
  </div>

</template>
<script>
export default {
  props:{
    show:{
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.title-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: px2rem(40);
  z-index: 101;
  display: flex;
  background-color: #fff;
  box-shadow: 0 px2rem(8) px2rem(8) rgba(0, 0, 0, $alpha: 0.15);

  .left {
    flex: 0 0 px2rem(48);
    @include center;
    .icon-wrapper {
      @include center;
      flex: 0 0 px2rem(40);
    }
    .icon-fanhui {
      font-size: px2rem(22);
    }
  }
  .right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    .icon-wrapper {
      @include center;
      flex: 0 0 px2rem(40);
      .icon-cart,
      .icon-ionc-- {
        font-size: px2rem(22);
      }
    }
  }


}
</style>


