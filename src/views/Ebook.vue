<template>
  <div class="ebook">
    <title-bar :show="showTitleAndMenu"></title-bar>
    <div class="read-wrapper">
      <div id="read"></div>
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
      showTitleAndMenu: false,
      fontSizeList: [
        { fontSize: 12 },
        { fontSize: 14 },
        { fontSize: 16 },
        { fontSize: 18 },
        { fontSize: 20 },
        { fontSize: 22 },
        { fontSize: 24 }
      ],
      currentFontSize: 16,
      rendition: null,
      themes: null,
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
      currentTheme: 0,
      bookAvailable: false,
      progress: 0,
      navigation: null
    };
  },
  methods: {
    jumpTo(href){
      this.rendition.display(href).then((section) => {
        console.log(section)
        console.log(section.cfiFromRange())
        this.progress = this.book.locations.percentageFromCfi(section.cfiFromRange()) * 100;
      });
      this.showTitleAndMenu = false;
    },
    onProgressChange(progress) {
      console.log(progress)
      const percentage = progress / 100;
      const location =
        percentage > 0 ? this.book.locations.cfiFromPercentage(percentage) : 0;
      this.rendition.display(location).then(() => {
        this.progress = progress;
      });
    },
    setTheme(index) {
      this.themes.select(this.themeList[index].name);
      this.currentTheme = index;
    },
    registerTheme() {
      this.themeList.forEach(theme => {
        this.themes.register(theme.name, theme.styles);
      });
    },
    setFontSize(fontSize) {
      if (this.themes) {
        this.themes.fontSize(fontSize + "px");
        this.currentFontSize = fontSize;
      }
    },
    toggleShowTitleAndMenu() {
      this.showTitleAndMenu = !this.showTitleAndMenu;
    },
    setCurrentProgress(){
      let location = this.rendition.location.start.cfi;
      this.progress = this.book.locations.percentageFromCfi(location) * 100;
    },
    prevPage() {
      // Rendition.prev
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.setCurrentProgress();
        });
      }
    },
    nextPage() {
      // Rendition.next
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.setCurrentProgress()
        });
      }
    },
    showEpub() {
      this.book = new Epub(DOWNLOAD_URL);
      // eslint-disable-next-line
      this.rendition = this.book.renderTo("read", {
        width: window.innerWidth,
        height: window.innerHeight
      });
      this.rendition.display();
      // 获取Themes对象
      this.themes = this.rendition.themes;
      this.setFontSize(this.currentFontSize);
      this.registerTheme();
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