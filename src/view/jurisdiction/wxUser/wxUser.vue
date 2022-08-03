<template>
  <div class="wxUser">
    <header>
      <el-input v-model.trim="searchForm.username" placeholder="输入用户名" size="medium" class="_w_200"></el-input>
      <el-input v-model.trim="searchForm.phone" type="number" placeholder="输入手机号" size="medium" class="_w_200"></el-input>
      <el-button type="primary" size="medium" icon="el-icon-search" @click="getWxuserList">搜索</el-button>
      <el-button type="danger" size="medium" icon="el-icon-delete" @click="deleteWxusers">批量删除</el-button>
    </header>
    <main>
      <el-table :data="wxuserList" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="username" label="用户名" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">
            <span> {{ scope.row.sex?'男':'女' }} </span>
          </template>
        </el-table-column>
        <el-table-column label="头像" align="center" prop="city"></el-table-column>
        <el-table-column prop="created_time" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-link type="danger" style="margin: 0 10px" @click="deleteWxuser(scope.row.id)">删除</el-link>
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
  </div>
</template>

<script>
import { getWxuserList , deleteWxuser } from '@/api/wxuser'

export default {
  name: "wxUser",
  data() {
    return {
      searchForm:{
        username: "",
        phone: "",
        page:1,
        pageSize:10,
        total:10
      },
      wxuserList:[],
      activeUserList:[], // 选中用户的列表
    }
  },
  created() {
    this.getWxuserList()
  },
  mounted() {
  },
  methods: {
    handleSelectionChange(val) {
      this.activeUserList = val;
    },
    handleSizeChange(val) {
      this.searchForm.page = 1;
      this.searchForm.pageSize = val;
      this.getWxuserList();
    },
    handleCurrentChange(val) {
      this.searchForm.page = val;
      this.getWxuserList();
    },
    // 获取微信用户
    getWxuserList(){
      getWxuserList(this.searchForm).then(res=>{
        this.wxuserList = res.data;
        this.searchForm.total = res.total;
      })
    },
    // 删除微信用户
    deleteWxuser(id){
      this.$confirm('确定删除该用户?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteWxuser({id}).then(res=>{
          this.getWxuserList();
          this.$message.success('删除成功!');
        })
      })
    },
    // 批量删除微信用户
    deleteWxusers(){
      if (!this.activeUserList.length) {
        this.$message.warning('未选中待删除的用户！');
      } else {
        this.$confirm('确定删除这些用户?', '提示', {
          type: 'warning'
        }).then(() => {
          let id = this.activeUserList.map(item =>item.id)
          deleteWxuser({id}).then(res=>{
            this.getWxuserList();
            this.$message.success('删除成功!');
          })
        })
      }
    }
  },
  component: {},
  computed: {},
  watch: {}
}
</script>

<style lang="scss" scoped>
.wxUser {
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
