<template>
  <el-scrollbar class="menu-navs" :style="isCollapse?'width:64px':''">
    <el-menu
        :collapse="isCollapse"
        :background-color="colors.theme"
        :text-color="colors.font"
        :default-active="tabMenu"
        style="width: 100%;"
        router>
      <template v-for="item in menuList">
        <el-menu-item v-if="item.type" :index="item.viewPath">
          <i :class="item.icon"></i>
          <span slot="title">{{ item.title }}</span>
        </el-menu-item>
        <el-submenu v-else :index="item.title">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </template>
          <template v-for="twoChilItem in item.children">
            <el-menu-item v-if="twoChilItem.type" :index="twoChilItem.viewPath" >{{ twoChilItem.title }}
            </el-menu-item>
            <el-submenu v-else :index="twoChilItem.title">
              <span slot="title"> {{ twoChilItem.title }} </span>
              <el-menu-item v-for=" threeChilItem in twoChilItem.children" :index="threeChilItem.viewPath">
                {{ threeChilItem.title }}
              </el-menu-item>
            </el-submenu>
          </template>
        </el-submenu>
      </template>
    </el-menu>
    <div class="Sidebar-Expand" @click="sidebarExpand">
      <i class="el-icon-d-arrow-right" v-show="isCollapse" title="展开侧边栏"></i>
      <i class="el-icon-d-arrow-left" v-show="!isCollapse" title="收起侧边栏"></i>
      <span v-show="!isCollapse"> 收起侧边栏 </span>
    </div>
  </el-scrollbar>
</template>

<script>
import theme from '@/assets/js/theme'
export default {
  name: "menus",
  props: ["tabMenu","menuList"],
  data() {
    return {
      isCollapse: false, // 侧边栏缩起
      colors:theme.lightColor,
    }
  },
  created() {
    let p = localStorage.getItem('pattern');
    if( p && p==='false' ){
      this.colors = theme.darkColor;
    }
  },
  mounted() {
    this.$eventHub.$on('patternChange', (data)=>{
      this.colors = data?theme.lightColor:theme.darkColor;
    })
  },
  methods: {
    sidebarExpand(){
      this.isCollapse = !this.isCollapse;
      this.$emit('sidebarExpand')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../assets/css/global";
.menu-navs {
  transition: width 0.3s, left 0.3s, right 0.3s;
  position: absolute;
  z-index: 600;
  top: 0;
  left: 0;
  box-shadow: inset -1px 0 0 #dbdbdb;
  transform: translate3d(0, 0, 0);
  height: calc(100vh - 46px);
  padding-bottom:38px;
  background-color: $themeColor;
  width: 201px;
  .Sidebar-Expand{
    position: fixed;
    left: 0;
    bottom: 0;
    height: 38px;
    line-height: 38px;
    font-size: 18px;
    text-align: center;
    border-top: 1px solid #dbdbdb;
    cursor: pointer;
    width: 100%;
    color: $fontColor;
    >span{
      font-size: 15px;
      position: relative;
      top: -1px;
    }
  }

}

</style>
<style lang="scss">
.menu-navs .el-scrollbar__wrap{
  overflow-x: hidden;
}
</style>

