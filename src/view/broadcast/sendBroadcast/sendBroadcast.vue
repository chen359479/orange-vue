<template>
  <div class="sendBroadcast">
    <el-form :inline="true" :model="msg" :rules="rules" ref="msg">
      <el-form-item label="标题" prop="title">
        <el-input v-model="msg.title" size="medium" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="等级" prop="grade">
        <el-select v-model="msg.grade" size="medium" placeholder="等级">
          <el-option label="高" :value="1"></el-option>
          <el-option label="中" :value="2"></el-option>
          <el-option label="低" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="过期时间" prop="expiration_time">
        <el-date-picker v-model="msg.expiration_time" size="medium" :picker-options="pickerOptions" type="datetime"
                        placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
      <el-button type="primary" size="medium" style="margin-top:2px" @click="submit">发布</el-button>
    </el-form>
    <vue-editor v-model="msg.content" style="min-height: 60vh"></vue-editor>
  </div>
</template>

<script>
import { writeBroadcast } from '@/api/broadcast'
import {VueEditor} from "vue2-editor";
import {mapGetters} from "vuex";

export default {
  name: "sendBroadcast",
  data() {
    return {
      msg: {
        title: "",
        content: "",
        grade: 1,
        expiration_time: null
      },
      rules:{
        title: [
          { required: true, message: '请输入标题名称', trigger: 'blur' },
          { min: 5, max: 40, message: '长度在 5 到 40 个字符', trigger: 'blur' }
        ],
        grade: [
          { required: true, message: '请选择广播等级', trigger: 'blur' },
        ],
        expiration_time: [
          { required: true, message: '请选择过期时间', trigger: 'blur' },
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      }
    }
  },
  methods: {
    submit(){
      if(this.userInfo.broadcast != 1){
        this.$message.warning('您已被禁用广播功能');
        return
      }
      if( !this.msg.content ){
        this.$message.warning('请填写广播内容');
        return
      }
      this.$refs.msg.validate((valid) => {
        if(valid){
          writeBroadcast(this.msg).then(res=>{
            this.$message.success(res.msg);
          })
        }
      });
    }
  },
  components: {
    VueEditor
  },
  computed: {
    ...mapGetters([ 'userInfo']), //用户状态
  },
}
</script>
<style>
.ql-container {
  min-height: 75vh;
}
</style>
