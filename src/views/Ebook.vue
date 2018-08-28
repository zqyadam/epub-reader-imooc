<template>
  <div class="ebook">
    <title-bar :show="showTitleAndMenu"></title-bar>
    <div class="read-wrapper">
      <!-- epub阅读器 -->
      <div id="read"></div>
      <!-- 点击蒙层 -->
      <div class="mask">
        <div class="left" @click="prevPage"></div>
        <div class="center" @click="toggleShowTitleAndMenu"></div>
        <div class="right" @click="nextPage"></div>
      </div>
    </div>
    <menu-bar :show="showTitleAndMenu"
              :fontSizeList="fontSizeList"
              :currentFontSize="currentFontSize"
              @setFontSize="setFontSize"
              :themeList="themeList"
              :currentTheme="currentTheme"
              @setTheme="setTheme"
              :bookAvailable="bookAvailable"
              @onProgressChange="onProgressChange"
              :progress = "progress"
              @jumpTo = "jumpTo"
              :navigation = "navigation"
              @hideMenuAndTitle="showTitleAndMenu = false"
              >
    </menu-bar>
  </div>
</template>
<script>
/* eslint-disable no-console */
import TitleBar from "@/components/TitleBar";
import MenuBar from "@/components/MenuBar";
import Epub from "epubjs";
const DOWNLOAD_URL = "2018_Book_AgileProcessesInSoftwareEngine.epub";

export default {
  data() {
    return {
      // 是否显示标题栏和菜单栏
      showTitleAndMenu: false,
      // 字体大小列表
      fontSizeList: [
        { fontSize: 12 },
        { fontSize: 14 },
        { fontSize: 16 },
        { fontSize: 18 },
        { fontSize: 20 },
        { fontSize: 22 },
        { fontSize: 24 }
      ],
      // 当前字体大小
      currentFontSize: 16,
      rendition: null,
      themes: null,
      navigation: null,
      // 主题列表
      themeList: [
        {
          name: "default",
          styles: {
            body: {
              color: "#000",
              background: "#fff"
            }
          }
        },
        {
          name: "eye",
          styles: {
            body: {
              color: "#000",
              background: "#ceeaba"
            }
          }
        },
        {
          name: "night",
          styles: {
            body: {
              color: "#fff",
              background: "#000"
            }
          }
        },
        {
          name: "gold",
          styles: {
            body: {
              color: "#000",
              background: "rgb(241,236,226)"
            }
          }
        }
      ],
      // 当前主题索引号
      currentTheme: 0,
      // 书籍是否可用
      bookAvailable: false,
      // 阅读进度
      progress: 0
    };
  },
  methods: {
    // 跳转到
    jumpTo(href){
      this.rendition.display(href).then((section) => {
        this.progress = this.book.locations.percentageFromCfi(section.cfiFromRange()) * 100;
      });
      this.showTitleAndMenu = false;
    },
    // 阅读进度变化的响应方法
    onProgressChange(progress) {
      console.log(progress)
      const percentage = progress / 100;
      const location =
        percentage > 0 ? this.book.locations.cfiFromPercentage(percentage) : 0;
      this.rendition.display(location).then(() => {
        this.progress = progress;
      });
    },
    // 设置主题
    setTheme(index) {
      this.themes.select(this.themeList[index].name);
      this.currentTheme = index;
    },
    // 注册主题
    registerTheme() {
      this.themeList.forEach(theme => {
        this.themes.register(theme.name, theme.styles);
      });
    },
    // 设置字体大小
    setFontSize(fontSize) {
      if (this.themes) {
        this.themes.fontSize(fontSize + "px");
        this.currentFontSize = fontSize;
      }
    },
    // 切换标题栏和菜单栏显示状态
    toggleShowTitleAndMenu() {
      this.showTitleAndMenu = !this.showTitleAndMenu;
    },
    // 根据当前位置设置进度
    setCurrentProgress(){
      let location = this.rendition.location.start.cfi;
      this.progress = this.book.locations.percentageFromCfi(location) * 100;
    },
    // 上一页
    prevPage() {
      // Rendition.prev
      if (this.rendition) {
        this.rendition.prev().then(() => {
          // 翻页完成后根据当前位置设置显示进度
          this.setCurrentProgress();
        });
      }
    },
    // 下一页
    nextPage() {
      // Rendition.next
      if (this.rendition) {
        this.rendition.next().then(() => {
          // 翻页完成后根据当前位置设置显示进度
          this.setCurrentProgress()
        });
      }
    },
    // 显示电子书
    showEpub() {
      this.book = new Epub(DOWNLOAD_URL);
      // eslint-disable-next-line
      this.rendition = this.book.renderTo("read", {
        width: window.innerWidth,
        height: window.innerHeight
      });
      // 显示电子书
      this.rendition.display();
      // 获取Themes对象
      this.themes = this.rendition.themes;
      // 设置默认字体大小
      this.setFontSize(this.currentFontSize);
      // 注册主题列表
      this.registerTheme();
      // 设置默认主题
      this.setTheme(this.currentTheme);

      this.book.ready
        .then(() => {
          this.navigation = this.book.navigation;
          return this.book.locations.generate();
        })
        .then(() => {
          console.log(this.book.locations);
          this.bookAvailable = true;
        });
    }
  },

  mounted() {
    this.showEpub();
  },

  components: {
    TitleBar,
    MenuBar
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.ebook {
  position: relative;

  .read-wrapper {
    .mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 100; // background-color: red;
      display: flex;
      .left {
        flex: 0 0 px2rem(100);
      }
      .center {
        flex: 1;
      }
      .right {
        flex: 0 0 px2rem(100);
      }
    }
  }
}
</style>