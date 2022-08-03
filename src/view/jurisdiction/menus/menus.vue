<template>
  <div class="menus">
    <el-row>
      <el-col :span="4">
        <el-scrollbar class="el-scrollbar-view">
          <el-card class="box-card" shadow="always" v-for="(item,index) in allMenuList" :key="index">
            <div slot="header" class="clearfix">
              <span v-if="index === 0">顶级菜单</span>
              <span v-else-if="index === 1">二级菜单</span>
              <span v-else-if="index === 2">三级菜单</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="addMenuForm(index)">添加菜单</el-button>
            </div>
            <div v-for="i in item" :key="i.id" class="link">
              <el-link :type="i.conclude?'':'primary'" :title="i.conclude?'已被纳入上级菜单中':'未被纳入上级菜单中'" @click="updateMenuForm(i)">{{ i.title }}</el-link>
              <el-link type="danger" :underline="false" v-if="i.name !== 'home'" @click="deleteMenu(i.id)">删除</el-link>
            </div>
          </el-card>
        </el-scrollbar>
      </el-col>
      <el-col :span="14">
        <el-card shadow="always" style="margin:20px 0 0 20px;">
          <el-form :model="menuForm" :rules="rules" label-width="100px">
            <h2 class="h2"> {{ menuForm.msg }} </h2>
            <el-form-item label="菜单路径" prop="viewPath">
              <el-input  v-model="menuForm.viewPath" placeholder="页面路径"></el-input>
            </el-form-item>
            <el-form-item label="组件名称" prop="name">
              <el-input  v-model="menuForm.name" placeholder="组件名称"></el-input>
            </el-form-item>
            <el-form-item label="菜单名称" prop="title">
              <el-input  v-model="menuForm.title" placeholder="菜单名称"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sequence">
              <el-input-number style="width: 100%" :controls="false" :min="0" v-model="menuForm.sequence" placeholder="请输入数字，数字越小排序越靠前"></el-input-number>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-switch v-model="menuForm.type" @change="changeType" active-text="页面" inactive-text="菜单"></el-switch>
            </el-form-item>
            <el-form-item label="子集" v-if="!menuForm.type">
              <el-select v-model="menuForm.children" no-data-text="没有可以添加的子集" style="width: 100%" multiple collapse-tags placeholder="请选择">
                <el-option
                    v-for="item in canSubset"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="菜单图标" prop="icon">
              <el-input  @focus="dialogVisible = true;" v-model="menuForm.icon" placeholder="请选择icon">
                <template slot="prepend"><i :class="menuForm.icon"></i></template>
              </el-input>
            </el-form-item>
            <el-form-item label="查看权限">
              <el-checkbox-group v-model="menuForm.astrict">
                <el-checkbox v-for="item in userJit" :label="item.value">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="menuForm.id?updateMenus():addMenus()">提交</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always" style="margin:20px 0 0 20px;">
          <div style="height: 60vh">
            <el-steps direction="vertical" :active="3">
              <el-step title="添加菜单">
                <div slot="description">
                  <p>菜单路径、组件名称、菜单名称请勿与现有菜单重复。</p>
                  <p>菜单路径为地址栏显示路径。</p>
                  <p style="color: red">组件名称必须与router.js的name保持一致!!!。</p>
                </div>
              </el-step>
              <el-step title="归纳菜单" description="将新添加的菜单归纳到其上级菜单的子集中。（顶级菜单不用）"></el-step>
              <el-step title="重新获取" description="退出，重新登录。"></el-step>
            </el-steps>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="请选择Icon图标" :visible.sync="dialogVisible" width="70%" top="5vh">
      <el-row>
        <el-col :span="2" v-for="item in icon" :key="item.class" class="icon-list">
          <div @click="setIcon(item.class)" :class="item.class" class="icon"></div>
        </el-col>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
import { getMenuList , getCanAddSubset , deleteMenu , updateMenus , writeMenus  } from '@/api/menus';

import icon from '@/assets/js/icon'
import { mapGetters } from "vuex";
export default {
  name: "menus",
  data() {
    return {
      menuForm:{
        viewPath:"",
        name:"",
        title:"",
        sequence:99,
        children:[],
        icon:"",
        astrict:['user'],
        type:true,
        msg:''
      },
      canSubset:[],
      dialogVisible:false,
      icon:[],
      rules:{
        viewPath:[
          { required: true, message: '请输入菜单路径', trigger: 'blur' },
          { min: 2, max: 42, message: '长度在 2 到 42 个字符', trigger: 'blur' },
          { pattern: /^\/[0-9a-zA-Z\/]*$/g, message: '菜单路径以/开头后接数字、小写字母、大写字母' }
        ],
        name:[
          { required: true, message: '请输入组件名称', trigger: 'blur' },
          { min: 2, max: 42, message: '长度在 2 到 42 个字符', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z]*$/g, message: '组件名称为数字，小写字母，大写字母' }
        ],
        title:[
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 2, max: 42, message: '长度在 2 到 42 个字符', trigger: 'blur' },
        ],
        sequence:[
          { required: true, message: '请输入排列序号', trigger: 'blur' },
        ],
        icon:[
          { required: true, message: '请选择Icon图标', trigger: 'change' },
        ],
        type:[
          { required: true, message: '请选择菜单类型', trigger: 'blur' },
        ]
      }
    }
  },
  created() {
    this.icon = icon;
  },
  mounted() {
    this.addMenuForm(0);
  },
  methods: {
    // 获取菜单
    getMenuList(){
      getMenuList().then(res=>{
        this.$store.commit("setAllMenuList",res.data);
        this.addMenuForm(0);
      })
    },
    // 添加菜单
    addMenuForm(index){
      this.menuForm = this.$options.data().menuForm;
      this.$nextTick(_=>{
        let mf = this.menuForm;
        mf.hierarchy = index + 1;
        switch (mf.hierarchy){
          case 1:
            mf.msg = '添加顶级菜单';
            break
          case 2:
            mf.msg = '添加二级菜单';
            break
          case 3:
            mf.msg = '添加三级菜单';
        }
        let d = {
          hierarchy : mf.hierarchy,
          children : JSON.stringify(mf.children)
        };
        this.getCanAddSubset(d)

      })
    },
    // 添加菜单
    addMenus(){
      writeMenus(this.menuForm).then(res=>{
        this.$message.success(res.msg);
        this.getMenuList();
      })
    },
    // 获取能够添加的子集
    getCanAddSubset(d){
      // 三级菜单设计，减少一个接口请求
      if(d.hierarchy === 3){
        this.canSubset = []
      }else {
        getCanAddSubset(d).then(res=>{
          this.canSubset = res.data;
        });
      }
    },
    // 更新menuForm
    updateMenuForm(data){
      this.menuForm = { ...data,children:JSON.parse(data.children),astrict:JSON.parse(data.astrict),msg:'修改菜单：'+ data.title };
      let d = {
        hierarchy : data.hierarchy,
        children : JSON.stringify(data.children)
      };
      this.getCanAddSubset(d)
    },
    // 更新menus数据
    updateMenus(){
      updateMenus(this.menuForm).then(res=>{
        this.$message.success(res.msg);
        this.getMenuList()
      })
    },
    // 设置icon图标
    setIcon(icon){
      this.menuForm.icon = icon ;
      this.dialogVisible = false;
    },
    // 删除菜单
    deleteMenu(id){
      this.$confirm('确定删除此菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu({id}).then(res=>{
          this.$message.success(res.msg);
          this.getMenuList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 菜单类型切换事件
    changeType(e){
      if( this.menuForm.hierarchy === 3 ){
        this.menuForm.type = true ;
        this.$message.warning('三级菜单禁止设置为菜单模式！')
      }
    },
  },
  computed: {
    ...mapGetters(['userJit','userInfo','allMenuList']),
  },

}
</script>

<style lang="scss" scoped>
.box-card{
  margin-top: 20px;
}
.link{
  line-height: 30px;
  display: flex;
  justify-content: space-between;
}
.el-scrollbar-view{
  overflow-x: hidden;
}
.h2{
  width: 100%;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
}
.icon-list{
  text-align: center;
  border: 1px solid #999;
  cursor: pointer;
  height: 80px;
  line-height: 80px;
  .icon{
    font-size: 26px;
    width: 100%;
    height: 100%;
  }
}

</style>
