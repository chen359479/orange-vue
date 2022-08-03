<template>
  <div class="login">
    <particles-bg type="square" :bg="true"/>
    <div class="login-wrap">
      <h3>账号密码登录</h3>
      <el-form :model="formInline" :rules="rules">
        <el-form-item prop="username" v-if="formInline.model">
          <el-input prefix-icon="el-icon-user" @change=" model = false" v-model.trim="formInline.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="phone" v-else>
          <el-input prefix-icon="el-icon-phone" @change=" model = false"  v-model.trim="formInline.phone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" @change=" model = false" @keyup.enter.native="onSubmit" v-model.trim="formInline.password" show-password placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item >
          <el-checkbox :indeterminate="false" v-model="formInline.checked">记住密码</el-checkbox>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click="onSubmit" style="width: 100%">登 录</el-button>
        </el-form-item>
        <el-form-item >
          <p style="text-align: right">
            <el-link type="primary" @click="changeModel">{{ formInline.model?'手机号登录':'密码登录' }}</el-link>&nbsp;&nbsp;
            <el-link type="warning">忘记密码</el-link>
          </p>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user';
import md5 from 'js-md5';
// 使用方法：https://npmmirror.com/package/ns-particles-bg
import { ParticlesBg } from "particles-bg-vue";

export default {
  name: "login-view",
  components:{
    ParticlesBg
  },
  data(){
    return  {
      formInline:{
        username:"",
        password:"",
        phone:"",
        model:true,
        checked:false
      },
      rules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z]*$/g, message: '密码为数字，小写字母，大写字母' }
        ],
        password:[
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z]*$/g, message: '密码为数字，小写字母，大写字母' }
        ],
        phone:[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern:/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, message: "请输入合法手机号/电话号", trigger: "blur" }
        ],
      },
      model:false
    }
  },
  methods:{
    onSubmit(){
      let f = this.formInline;
      !this.model?f.password = md5(f.password):'';
      login(f).then(res=>{
        if(f.checked){
          f.time = new Date();
          localStorage.setItem('userForm',JSON.stringify(f))
        }else  localStorage.removeItem('userForm');
        this.$store.commit("setUserInfo",res.data);
        this.$router.push('/main/home')
      })
    },
    getDays(startDay, endDay) {
      let sd = new Date(startDay).getTime();
      let end = new Date(endDay).getTime();
      return (end-sd)/(1000*60*60*24)
    },
    changeModel(){
      this.formInline.model = !this.formInline.model;

    }
  },
  mounted() {
    let u = localStorage.getItem('userForm');
    if( u ){
      u = JSON.parse(u);
      if( 4 >= this.getDays(u.time , new Date() )){
        this.formInline = {...u};
        this.model = true;
      }else{
        localStorage.removeItem('userForm');
        this.model = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login{
  width: 100vw;
  height: 100vh;
  background: url("../../assets/img/login.png") no-repeat 100% 100%;
  position: relative;
  z-index: 0;
  .login-wrap{
    position: absolute;
    width: 500px;
    height: 400px;
    padding:10px 30px;
    box-sizing: border-box;
    background-color: rgba(99,99,99,0.3);
    top: 20vh;
    left: calc(50% - 250px);
    z-index: 9;
    >h3{
      text-align: center;
      color: orange;
      height: 50px;
      line-height: 50px;
      font-size: 22px;
      margin-bottom: 20px;
    }
  }
}
</style>
<style lang="scss">
.login{
  .el-checkbox__label{
    color: #fff;
  }
}
</style>

