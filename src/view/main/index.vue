<template>
  <div class="main">
    <headers></headers>
    <div class="main-scrollbar">
      <menu-navs :tabMenu="tabMenu" :menuList="menuList" @sidebarExpand="isCollapse=!isCollapse"></menu-navs>
      <div class="tabs-content" :style="isCollapse?'padding-left:64px':'padding-left:201px'">
        <el-tabs v-model="editableTabsValue" type="card" @tab-remove="removeTab" @tab-click="tabClick">
          <el-tab-pane
              v-for="item in editableTabs"
              :name="item.name"
              :key="item.name"
              :closable="item.closable"
              :label="item.label">
          </el-tab-pane>
        </el-tabs>
        <el-scrollbar class="el-scrollbar-view">
          <keep-alive>
            <router-view />
          </keep-alive>
        </el-scrollbar>
        <a class="record" href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank"> 鄂ICP备2022010441号 </a>
      </div>
    </div>
  </div>
</template>

<script>
import menuNav from "./menu.vue";
import headers from "./header.vue";
import { mapGetters } from "vuex";
import { getMenus , getMenuList } from '@/api/menus'

export default {
  name: "index",
  data() {
    return {
      isCollapse: false, // 左侧菜单是否缩起
      editableTabsValue: '1',
      editableTabs: [ // 标签页选项卡
        {
          label: '首页',
          name: '1',
          content: '/main/home',
          closable: false
        },
      ],
      menuList: [],
      tabIndex: 1,
      tabMenu: "/main/home",
      allMenu:[]
    }
  },
  created() {
    this.getMenus();
    this.getAllMenuList();
  },
  methods: {
    // 添加tab标签
    addTab(name, indexPath) {
      let tabs = this.editableTabs;
      let checkoutView = tabs.filter(item => item.label === name)[0];
      if (checkoutView || indexPath === '/main/home') {
        this.editableTabsValue = checkoutView.name;
      } else {
        let newTabName = ++this.tabIndex + '';
        this.editableTabs.push({
          label: name,
          name: newTabName,
          content: indexPath,
          closable: true
        });
        this.editableTabsValue = newTabName;
      }
    },
    // 删除tab方法
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
              this.tabMenu = nextTab.content;
              this.$router.replace(nextTab.content);
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
    },
    // 点击tab方法
    tabClick(tab) {
      if( tab.name !== this.tabIndex ){
        this.editableTabs.forEach(item => {
          if (item.name === tab.name) {
            this.editableTabsValue = tab.name;
            this.tabMenu = item.content;
            this.$router.push(item.content);
          }
        });
      }
    },
    // 获取菜单接口
    getMenus(){
      getMenus().then(res=>{
        this.menuList = res.data;
      })
    },
    // 获取所有菜单，未分类
    getAllMenuList(){
      getMenuList().then(res=>{
        this.$store.commit("setAllMenuList",res.data);
      })
    }
  },
  components: {
    "menu-navs": menuNav,
    headers
  },
  computed: {
    ...mapGetters(['allMenuList']),
  },
  watch: {
    $route(to,form){
      if(to.path !== form.path){
        this.allMenu.forEach(item=>{
          if( item.name === to.name ){
            this.tabMenu = to.path;
            this.addTab(item.title , to.path);
          }
        })
      }
    },
    allMenuList(){
      this.allMenuList.forEach(item=>this.allMenu = this.allMenu.concat(item) )
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden !important;
  .main-scrollbar {
    width: 100vw;
    height: calc(100vh - 46px);
    .tabs-content {
      width: 100vw;
      height: calc(100vh - 86px);
      margin: 0;
      padding: 0;
      transition: width 0.3s, left 0.3s, right 0.3s, padding 0.3s;
      position: relative;
    }
  }
}
.el-scrollbar-view{
  padding: 10px 10px 0;
  height:calc(100vh - 88px);
  ::-webkit-scrollbar {
    width: 0 !important
  }
}
.record{
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: rgba(99,99,99,.6);
  font-family: "KAITI";
}
</style>
<style lang="scss">
@import "../../assets/css/global";
.main{
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border-top: none !important;
    border-left: none !important;
  }
  .el-tabs__header{
    margin: 0;
  }
  .el-scrollbar-view .el-scrollbar__wrap{
    margin-right: 0 !important;
  }
}

</style>
