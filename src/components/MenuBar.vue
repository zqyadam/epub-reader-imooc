<template>
  <div class="menu-bar">
    <transition name="slide-up">
      <div class="menu-wrapper" :class="{'hide-box-shadow': showSettingBar || !show}" v-show="show">
        <div class="icon-wrapper">
          <span class="iconfont icon-menu" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper" @click="showSetting(2)">
          <span class="iconfont icon-Progressread"></span>
        </div>
        <div class="icon-wrapper" @click="showSetting(1)">
          <span class="iconfont icon-brightness"></span>
        </div>
        <div class="icon-wrapper" @click="showSetting(0)">
          <span class="iconfont icon-a">A</span>
        </div>
      </div>
    </transition>
    <transition name="slide-up">
      <div class="setting-wrapper" v-show="showSettingBar">
        <div class="setting-font-size" v-if="showTag === 0">
          <div class="preview-small" :style="{fontSize: fontSizeList[0].fontSize+'px'}">A</div>
          <div class="select">
            <div class="select-wrapper" v-for="(item, index) in fontSizeList" :key="index" @click="setFontSize(item.fontSize)">
              <div class="line"></div>
              <div class="point-wrapper">
                <div class="point" v-show="item.fontSize === currentFontSize">
                  <div class="small-point"></div>
                </div>
              </div>
              <div class="line"></div>
            </div>
          </div>
          <div class="preview-big" :style="{fontSize: fontSizeList[fontSizeList.length - 1].fontSize+ 'px'}">A</div>
        </div>
        <div class="setting-theme" v-else-if="showTag === 1">
          <div class="setting-theme-item" v-for="(item,index) in themeList" :key="index" @click="setTheme(index)">
            <div class="preview" :style="{
              background: item.styles.body.background
            }"></div>
            <div class="text" :class="{selected: currentTheme === index}">{{item.name}}</div>
          </div>
        </div>
        <div class="setting-progress" v-else-if="showTag === 2">
          <div class="progress-wrapper">
            <input type="range"
                  class="progress"
                  min="0"
                  max="100"
                  @change="onProgressChange($event.target.value)"
                  @input="onProgressInput($event.target.value)"
                  :value="newProgress"
                  :step="0.001"
                  :disabled="!bookAvailable"
                  :style="{backgroundSize: `${newProgress}% 100%` }"
            >
          </div>
          <div class="text-wrapper">
            <span>{{ bookAvailable ? newProgress.toFixed(3) + '%' : '加载中...' }}</span>
          </div>
        </div>
      </div>
    </transition>
    <content-view v-show="showContent" :showContent="showContent" :navigation="navigation" :bookAvailable="bookAvailable" @jumpTo="jumpTo"></content-view>
    <transition name="fade">
      <div class="content-mask" v-show="showContent" @click="hideMenuAndTitle"></div>
    </transition>
  </div>
</template>
<script>
/* eslint-disable no-console */
import ContentView from './ContentView'
export default {
  data() {
    return {
      showSettingBar: false,
      showContent: false,
      showTag: 0,
      newProgress: 0
    };
  },
  methods: {
    jumpTo(href){
      this.hideMenuAndTitle();
      this.$emit('jumpTo', href);
    },
    showSetting(tag) {
      this.showTag = tag;
      if (tag == 3) {
        this.showContent = true;
        this.showSettingBar = false;
      }else{
        this.showSettingBar = true;
      }
    },
    hideMenuAndTitle(){
      this.$emit('hideMenuAndTitle')
    },
    hideSetting() {
      this.showSettingBar = false;
    },
    hideContent() {
      this.showContent = false;
    },
    setFontSize(fontSize) {
      this.$emit("setFontSize", fontSize);
    },
    setTheme(index) {
      this.$emit("setTheme", index);
    },
    onProgressChange(value) {
      value = parseFloat(value);
      this.$emit("onProgressChange", value);
    },
    onProgressInput(value) {
      this.newProgress = parseFloat(value);
    }
  },
  watch: {
    show(new_val) {
      if (!new_val) {
        this.hideSetting();
        this.hideContent();
      }
    },
    progress() {
      this.newProgress = this.progress;
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    fontSizeList: Array,
    currentFontSize: Number,
    themeList: Array,
    currentTheme: Number,
    bookAvailable: Boolean,
    progress: Number,
    navigation: Object
  },
  components:{
    ContentView
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.menu-bar {
  .menu-wrapper {
    position: absolute;
    height: px2rem(40);
    z-index: 102;
    width: 100%;
    left: 0;
    bottom: 0;
    display: flex;
    background: #fff;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
    .icon-wrapper {
      flex: 1;
      @include center;
      .iconfont {
        font-size: px2rem(22);
      }
      .icon-brightness {
        font-size: px2rem(20);
      }
    }

    &.hide-box-shadow {
      box-shadow: none;
    }
  }

  .setting-wrapper {
    position: absolute;
    width: 100%;
    bottom: px2rem(40);
    left: 0;
    z-index: 101;
    height: px2rem(60);
    background-color: #fff;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
    .setting-font-size {
      display: flex;
      height: 100%;
      .preview-small {
        flex: 0 0 px2rem(40);
        @include right;
      }
      .preview-big {
        flex: 0 0 px2rem(40);
        @include left;
      }

      .select {
        flex: 1;
        display: flex;
        .select-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          &:first-child {
            .line:first-child {
              border: none;
            }
          }
          &:last-child {
            .line:last-child {
              border: none;
            }
          }
          .line {
            flex: 1;
            height: 0;
            border-top: px2rem(1) solid #ccc;
          }

          .point-wrapper {
            position: relative;
            flex: 0 0 0;
            width: 0;
            height: px2rem(7);
            border-left: px2rem(1) solid #ccc;
            .point {
              position: absolute;
              width: px2rem(20);
              height: px2rem(20);
              top: px2rem(-6);
              left: px2rem(-11);
              border-radius: 50%;
              background: white;
              border: px2rem(1) solid #ccc;
              box-shadow: 0 px2rem(2) px2rem(2) rgba(0, 0, 0, 0.15);
              @include center;
              .small-point {
                border-radius: 50%;
                width: px2rem(8);
                height: px2rem(8);
                background-color: #777;
              }
            }
          }
        }
      }
    }
    .setting-theme {
      height: 100%;
      display: flex;
      .setting-theme-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        .preview {
          flex: 1;
          border: px2rem(1) solid #ccc;
          margin: px2rem(5);
        }
        .text {
          flex: 0 0 px2rem(24);
          font-size: px2rem(16);
          color: #ccc;
          @include center;
          &.selected {
            color: #000;
          }
        }
      }
    }
    .setting-progress {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .progress-wrapper {
        flex: 1;
        width: 100%;
        height: 100%;
        @include center;
        padding: 0 px2rem(30);
        box-sizing: border-box;
        .progress {
          width: 100%;
          -webkit-appearance: none;
          height: px2rem(2);
          background: -webkit-linear-gradient(#999, #999) no-repeat, #ddd;
          background-size: 0 100%;
        }
        .progress:focus {
          outline: none;
        }
        .progress::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: px2rem(20);
          height: px2rem(20);
          border-radius: 50%;
          background: white;
          box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.15);
          border: px2rem(1) solid #ddd;
        }
      }
      .text-wrapper {
        @include center;
        flex: 0 0 px2rem(24);
        span {
          font-size: px2rem(14);
        }
      }
    }
  }

  .content-mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 102;
    display: flex;
    width: 100%;
    height: 100%;
    background: rgba(51, 51, 51, 0.8);
  }
}
</style>
