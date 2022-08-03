<template>
  <div class="personalCenter">
    <div class="left-btn">
      <el-link @click="menu = 1" :type="menu?'primary':'info'" :underline="false">个人信息</el-link><br>
      <el-link @click="menu = 0" :type="!menu?'primary':'info'" :underline="false">修改密码</el-link>
    </div>
    <div class="user-info" v-show="menu">
      <el-form :model="userForm" label-position="left" :rules="rules" ref="ruleForm" label-width="100px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model.trim="userForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="userForm.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色" prop="type">
          <span> {{ userJit.filter(item=>item.value == userForm.type)[0].label}} </span>
        </el-form-item>
        <el-form-item label="创建时间" prop="created_time">
          <div>{{ userForm.created_time }}</div>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="updateUser">提 交</el-button>
    </div>
    <div class="user-password" v-show="!menu">
      <el-form :model="updatePasswordForm" :rules="pwRules" ref="pwRuleForm" label-width="100px" >
        <el-form-item label="新密码"  prop="newPassword">
          <el-input show-password v-model.trim="updatePasswordForm.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码"  prop="rePassword">
          <el-input show-password v-model.trim="updatePasswordForm.rePassword"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="updateMePassword">提 交</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {updateUser, updateMePassword} from '@/api/user'
import md5 from 'js-md5';

export default {
  name: "personalCenter",
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.updatePasswordForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      userForm:{},
      menu:1,
      rules: {
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' },
        ],
        phone:[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern:/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, message: "请输入合法手机号/电话号", trigger: "blur" }
        ],
        sex:[
          { required: true, message: '请选择性别', trigger: 'blur' },
        ],
      },
      updatePasswordForm:{
        newPassword:"",
        rePassword:"",
        id:1
      },
      pwRules:{
        newPassword: [
          { required: true, min: 6,  message: '请输入最少6位密码', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z]*$/g, message: '密码由最少6位为数字或小写字母或大写字母组成', trigger: 'change' }
        ],
        rePassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    let u = this.userInfo;
    this.userForm = {
      username:u.username,
      phone:u.phone,
      type:u.type,
      created_time:u.created_time,
      sex:u.sex,
      id:u.id,
      state:u.state
    };
    this.updatePasswordForm.id = u.id;
  },
  mounted() {

  },
  methods: {
    // 修改个人信息
    updateUser(){
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          updateUser(this.userForm).then(res=>{
            this.$message.success('更新用户信息成功');
            this.$store.commit("setUserInfo",{ ...this.userForm });
          })
        }
      });
    },
    // 修改密码
    updateMePassword(){
      this.$refs.pwRuleForm.validate((valid) => {
        if (valid) {
          let u = {...this.updatePasswordForm};
          u.newPassword = md5(u.newPassword);
          updateMePassword(u).then(res=>{
            this.$message.success('修改密码成功');
          })
        }
      });
    }
  },
  component: {},
  computed: {
    ...mapGetters(['userInfo','userJit'])
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
.personalCenter{
  padding-top: 40px;
  .left-btn{
    text-align: right;
    width: 20%;
    display: inline-block;
    vertical-align: top;
    >a{
      height: 20px;
      line-height: 20px;
      font-size: 16px;
      padding-right: 30px;
      border-right: 2px solid #fff;
      margin-bottom: 20px;
      cursor: pointer;
    }
    .el-link--primary{
      border-right: 2px solid #409EFF;
    }

  }
  .user-info,.user-password{
    display: inline-block;
    margin-left: 80px;
    width: 600px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 15px 80px;
    >span{
      width: 100px;
      display: inline-block;
      text-align: center;
    }
  }
}
</style>