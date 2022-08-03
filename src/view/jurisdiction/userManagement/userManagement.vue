<template>
  <div class="userManagement">
    <header>
      <el-select v-model="searchForm.state" placeholder="请选择" size="medium" class="_w_100">
        <el-option v-for="item in userStateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>

      <el-input v-model.trim="searchForm.username" placeholder="输入用户名" size="medium" class="_w_200"></el-input>
      <el-input v-model.trim="searchForm.phone" type="number" placeholder="输入手机号" size="medium" class="_w_200"></el-input>
      <el-button type="primary" size="medium" icon="el-icon-search" @click="getUserLists">搜索</el-button>
      <el-button type="success" size="medium" icon="el-icon-plus" @click.stop="openUserForm()">添加</el-button>
      <el-button type="danger" size="medium" icon="el-icon-delete" @click="deleteUsers">批量删除</el-button>
    </header>
    <main>
      <el-table :data="userList" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="username" label="用户名" align="center"></el-table-column>
        <el-table-column label="角色" align="center">
          <template slot-scope="scope">
            <span> {{ userJit.filter(item=>item.value == scope.row.type)[0].label}} </span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">
            <span> {{ scope.row.sex?'男':'女' }} </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-link type="success" v-if="scope.row.state == 1" :underline="false">{{
                userState.filter(item=>item.value == scope.row.state)[0].label
              }}
            </el-link>
            <el-link type="warning" v-else-if="scope.row.state == 2" :underline="false">{{
                userState.filter(item=>item.value == scope.row.state)[0].label
              }}
            </el-link>
            <el-link type="danger" v-else-if="scope.row.state == 3" :underline="false">{{
                userState.filter(item=>item.value == scope.row.state)[0].label
              }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="update_time" label="最近操作时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-link type="success"  @click="openUserForm(scope.row)">编辑</el-link>
            <el-link type="danger" style="margin: 0 10px" @click="deleteUser(scope.row.id)">删除</el-link>
            <el-link type="info" @click="updatePassword(scope.row.id)">修改密码</el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          class="_pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.page"
          :page-sizes="[10,20,30]"
          :page-size="searchForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="searchForm.total">
      </el-pagination>
    </main>
    <el-dialog
        :title="userFormTitle"
        :visible.sync="userFormShow"
        width="30%">
      <el-form :model="userForm" :rules="rules" ref="ruleForm" label-width="100px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" v-if=" userFormTitle == '添加用户' " prop="password">
          <el-input show-password v-model.trim="userForm.password"></el-input>
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
        <el-form-item label="广播" prop="sex">
          <el-radio-group v-model="userForm.broadcast">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">只读</el-radio>
            <el-radio :label="3">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="userForm.state">
            <el-radio v-for="item in userState" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色" prop="state">
          <el-radio-group v-model="userForm.type">
            <el-radio v-if="userInfo.type == 'superAdmin'" :label="userJit[1].value">{{ userJit[1].label }}</el-radio>
            <el-radio v-if="userInfo.type != 'user'" :label="userJit[2].value">{{ userJit[2].label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userFormShow = false" size="medium">取 消</el-button>
        <el-button type="primary" v-if="userFormTitle === '添加用户'" size="medium" @click.stop="createUser">确 定</el-button>
        <el-button type="primary" v-else size="medium"  @click.stop="updateUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
        title="修改密码"
        :visible.sync="updatePasswordForm.show"
        width="30%" >
      <el-form :model="updatePasswordForm" :rules="pwRules" ref="pwRuleForm" label-width="100px" >

        <el-form-item label="管理员密码"  prop="adminPassword">
          <el-input show-password v-model.trim="updatePasswordForm.adminPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码"  prop="newPassword">
          <el-input show-password v-model.trim="updatePasswordForm.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码"  prop="rePassword">
          <el-input show-password v-model.trim="updatePasswordForm.rePassword"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updatePasswordForm.show = false" size="medium">取 消</el-button>
        <el-button type="primary" @click="updateUserPassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { register , getUserList , updateUserPassword , deleteUser , updateUser , } from '@/api/user'
import md5 from 'js-md5';

export default {
  name: "userManagement",
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
      searchForm: {  // 搜索用户表单
        username: "",
        phone: "",
        state: "0",
        page:1,
        pageSize:10,
        total:10
      },
      userStateList: [{  // 用户状态表单
        value: '0',
        label: '全部'
      }],
      userList:[],
      activeUserList: [],  // 选中的列表
      currentPage: 1,
      userFormShow: false, // 控制表单的显隐
      userFormTitle: "", // 表单的标题
      userForm:{
        username:"",
        phone:"",
        state:1,
        sex:1,
        type:"user",
        broadcast:1
      },
      rules: {
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z]*$/g, message: '用户名为数字，小写字母，大写字母' }
        ],
        phone:[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern:/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, message: "请输入合法手机号/电话号", trigger: "blur" }
        ],
        sex:[
          { required: true, message: '请选择性别', trigger: 'blur' },
        ],
        state:[
          { required: true, message: '请设置用户状态', trigger: 'blur' },
        ],
        type:[
          { required: true, message: '请设置用户角色', trigger: 'blur' },
        ],
        password:[
          { required: true, min: 6, message: '请设置最少6位用户密码', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z]*$/g, message: '密码由最少6位为数字或小写字母或大写字母组成' }
        ],
        broadcast:[{ required: true, trigger: 'blur' },]
      },
      updatePasswordForm:{
        adminPassword:"",
        newPassword:"",
        rePassword:"",
        show:false,
        id:1
      },
      pwRules:{
        adminPassword:[
          { required: true, min: 6, message: '请输入最少6位密码', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z]*$/g, message: '密码由最少6位为数字或小写字母或大写字母组成' }
        ],
        newPassword: [
          { required: true, min: 6 , message: '请输入密码', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z]*$/g, message: '密码为6位由数字或小写字母或大写字母组成' }
        ],
        rePassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.userStateList = this.userStateList.concat(this.userState);
  },
  mounted() {
    this.getUserLists()
  },
  methods: {
    handleSelectionChange(val) {
      this.activeUserList = val;
    },
    handleSizeChange(val) {
      this.searchForm.page = 1;
      this.searchForm.pageSize = val;
      this.getUserLists();
    },
    handleCurrentChange(val) {
      this.searchForm.page = val;
      this.getUserLists();
    },
    // 获取用户列表
    getUserLists(){
      getUserList(this.searchForm).then(res=>{
        this.userList = res.data;
        this.searchForm.total = res.total;
      })
    },
    // 删除用户
    deleteUser(id) {
      this.$confirm('确定删除该用户?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteUser({id}).then(res=>{
          this.getUserLists();
          this.$message.success('删除成功!');
        })
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    // 批量删除用户
    deleteUsers() {
      if (!this.activeUserList.length) {
        this.$message.warning('未选中待删除的用户！');
      } else {
        this.$confirm('确定删除这些用户?', '提示', {
          type: 'warning'
        }).then(() => {
          let id = this.activeUserList.map(item =>item.id)
          deleteUser({id}).then(res=>{
            this.getUserLists();
            this.$message.success('删除成功!');
          })
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      }
    },
    // 打开编辑用户的弹框
    openUserForm(data){
      this.userFormShow = true;
      if(data){
        this.userFormTitle ="编辑用户";
        this.userForm = {...data}
      }else {
        this.userFormTitle ="添加用户";
        this.$data.userForm = Object.assign(this.$data.userForm, this.$options.data().userForm);
      }

    },
    // 创建用户
    createUser() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.userForm.password = md5(this.userForm.password)
          register(this.userForm).then(res=>{
            this.getUserLists()
            this.userFormShow = false;
            this.$message.success(res.msg);

          })
        }
      });
    },
    // 更新用户信息
    updateUser() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          updateUser(this.userForm).then(res=>{
            this.getUserLists();
            this.userFormShow = false;
            this.$message.success('更新用户信息成功');
          })
        }
      });
    },
    // 更新用户密码
    updatePassword(id){
      this.updatePasswordForm.show = true ;
      this.updatePasswordForm.id = id ;
    },
    // 更新用户密码接口
    updateUserPassword(){
      this.$refs.pwRuleForm.validate((valid) => {
        if (valid) {
          let f = {};
          f.adminPassword = md5(this.updatePasswordForm.adminPassword);
          f.newPassword = md5(this.updatePasswordForm.newPassword);
          f.id = this.updatePasswordForm.id;
          updateUserPassword(f).then(res=>{
            this.updatePasswordForm.show = false ;
            this.$message.success(res.msg);
          })
        }
      });
    }
  },
  component: {},
  computed: {
    ...mapGetters(['userState', 'userJit', 'userInfo']), //用户状态
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
.userManagement {
  > header {
    > * {
      margin: 0 10px;
    }

    :first-child {
      margin-left: 0;
    }
  }

  > main {
    margin-top: 20px;
    padding-bottom: 60px;
  }
}
</style>
