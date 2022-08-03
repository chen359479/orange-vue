<template>
  <header>
    <div class="logo _fontColor" ><img src="../../assets/img/orange.png"/></div>
    <!--  颜色模式切换  -->
    <div class="pattern" @click="patternChange">
      <i class="iconfont icon-baitian" title="亮色模式" v-show="pattern"></i>
      <i class="iconfont icon-heiyemoshi" title="深色模式" v-show="!pattern"></i>
    </div>
    <!--  通知  -->
    <div class="_fontColor" title="广播消息">
      <i class="el-icon-bell" ></i>
    </div>
    <!--  个人中心  -->
    <el-dropdown @command="personalSetting">
      <span class="user _fontColor">
        <el-avatar size="small" :src="squareUrl"></el-avatar>&nbsp;
        {{ userInfo.username }}
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-setting" command="setting">个人中心</el-dropdown-item>
        <el-dropdown-item icon="el-icon-position" command="out">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </header>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "headers",
  data() {
    return {
      squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
      notifications: 1,
      pattern: true,
      drawer: false,
    }
  },
  created() {
    let p = localStorage.getItem('pattern');
    if( p && p==='false' ){
      this.patternChange();
    }
  },
  methods: {
    // 浅色、深色模式切换
    patternChange() {

      this.pattern = !this.pattern;
      this.$eventHub.$emit('patternChange', this.pattern); // 广播pattern的改变
      let body = window.document.getElementsByTagName('body')[0];
      if (this.pattern) {
        body.style.setProperty('--themeColor', '#fafafa'); // 默认主题色 默认为fafafa
        body.style.setProperty('--bgColor', '#fff'); // 默认背景色
        body.style.setProperty('--fontColor', '#111'); // 默认字体和icon颜色
      } else {
        body.style.setProperty('--themeColor', '#222');
        body.style.setProperty('--bgColor', '#444'); // 默认背景色
        body.style.setProperty('--fontColor', '#fafafa');
      }
      localStorage.setItem('pattern',this.pattern);
    },
    // 点击个人中心
    personalSetting(com){
      switch (com) {
        case 'setting' :
          this.$router.push("/main/personalCenter");
          break;
        case "out" :
          this.$store.commit("setUserInfo",{});
          this.$router.replace('/login')
          break;
      }
    }
  },
  computed: {
    ...mapGetters([ 'userInfo'])
  },
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/global";

header {
  height: 46px;
  line-height: 46px;
  background-color: $themeColor;
  border-bottom: 1px solid #eee;
  text-align: right;
  overflow: hidden;
  > div {
    display: inline-block;
    margin: 0 15px;
    text-align: center;

    > i {
      color: $fontColor;
      cursor: pointer;
    }
  }
  .logo{
    float: left;
    clear: both;
  }

  .pattern {
    width: 15px;
    cursor: pointer;
  }

  .user {
    cursor: default;
    font-size: 14px;
    > span {
      vertical-align: middle;
    }
  }
}

.notifications {
  border: 1px solid #dedede;
  color: #333;
  min-width: 360px;

  > h5 {
    border-bottom: 1px solid #dedede;
    height: 30px;
    line-height: 30px;
    width: 100%;
    text-align: center;
    letter-spacing: 5px;
  }

  .info-list {
    display: flex;
    flex: 1 1;
    align-items: flex-start;
    max-width: 100%;
    padding: 5px 10px;
    border-bottom: 1px solid #dedede;

    .info-list-user {
      width: 25%;
      text-align: center;
      top: 5px;
    }
    .info{
      width: 75%;
      >h6{
        height: 24px;
        line-height: 24px;
        font-size: 14px;
      }
      .content{
        font-size: 14px;
        line-height: 20px;
        color: rgba(0,0,0,0.45);
      }
    }
  }
}
</style>
<style lang="scss">
header {
  .el-badge__content.is-fixed {
    top: 10px;
  }
}
</style>
