<template>
  <div class="broadcastMessage">
    <main v-show="!read">
      <header>
        <el-select v-model="searchForm.grade" placeholder="请选择" size="medium" class="_w_100">
          <el-option v-for="item in gradeTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-input v-model.trim="searchForm.title" placeholder="待搜索的消息名称" size="medium" class="_w_200"></el-input>
        <el-input v-model.trim="searchForm.username"  placeholder="待搜索的发布者名称" size="medium" class="_w_200"></el-input>
        <el-button type="primary" size="medium" icon="el-icon-search" @click="getBroadcastList">搜索</el-button>
        <el-button type="warning" @click="empty">清空</el-button>
      </header>
      <el-table
          :data="gradeList"
          border
          style="width: 100%">
        <el-table-column
            label="标题"
            align="center">
          <template slot-scope="scope">
            <el-link :underline="false" :type="!scope.row.pastDue && !scope.row.read ?'':'info'" @click="readGrade(scope.row)">{{ scope.row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
            prop="time"
            label="发布时间"
            align="center"
            width="220">
        </el-table-column>
        <el-table-column
            label="等级"
            align="center"
            width="220">
          <template slot-scope="scope">
            <el-link :type="gradeFn(scope.row.grade)" >{{ gradeTypeList.filter(item=>item.value == scope.row.grade)[0].label}}</el-link>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            align="center"
            width="220">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="readGrade(scope.row)">查阅</el-link>
            <el-link type="warning" :underline="false" style="margin: 0 5px" @click="deleteGrade(scope.row.id)">删除</el-link>
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
    <div class="msg-content" v-show="read">
      <el-page-header @back="back"></el-page-header>
      <h5>{{ msgData.title }}</h5>
      <p>
        <el-link :underline="false">广播有效期: {{ msgData.expiration_time }}</el-link>
        <el-link :type="gradeFn(msgData.grade)" :underline="false">{{ gradeTypeList.filter(item=>item.value == msgData.grade)[0].label}}</el-link>
      </p>
      <div v-html="msgData.content"></div>
      <p>
        <el-link type="info" :underline="false">{{ msgData.created_time }}</el-link>
        <el-link type="info" :underline="false">{{ msgData.username }}</el-link>
      </p>
    </div>
  </div>
</template>

<script>
import { getBroadcastList , deleteBroadcast , getBroadcastInfo  } from '@/api/broadcast'
export default {
  name: "broadcastMessage",
  data() {
    return {
      read:false,
      searchForm:{ // 搜索文档的
        title:"",
        username:"",
        grade:0,
        page:1,
        pageSize:10,
        total:10,
      },
      gradeTypeList:[ // 广播消息等级
        {
          value: 0,
          label: '全部'
        },{
          value: 1,
          label: '高'
        },{
          value: 2,
          label: '中'
        },{
          value: 3,
          label: '低'
        }
      ],
      gradeList:[],
      msgData:{
        title:"",
        user:"",
        expiration_time:"",
        grade:1,
        content:"",
        created_time:"",
      },
      rg:[],
    }
  },
  created() {
    let rg = localStorage.getItem("readGrade");
    if(!rg){
      this.rg = [];
      localStorage.setItem("readGrade",'[]')
    }else this.rg = JSON.parse(rg);
  },
  mounted() {
    this.getBroadcastList();
  },
  methods:{
    handleSizeChange(val) {
      this.searchForm.page = 1;
      this.searchForm.pageSize = val;
      this.getBroadcastList();
    },
    handleCurrentChange(val) {
      this.searchForm.page = val;
      this.getBroadcastList();
    },
    // 获取广播列表
    getBroadcastList(){
      getBroadcastList(this.searchForm).then(res=>{
        this.gradeList = res.data.map(item=>{
            item.read = this.rg.includes(item.id);
            return item;
        });
        this.searchForm.total = res.total;
      })

    },
    // 清空方法
    empty(){
      this.$data.searchForm = Object.assign(this.$data.searchForm, this.$options.data().searchForm);
    },
    // 标识等级type
    gradeFn(grade){
      if( grade == 1 ) return "warning";
      else if(grade == 2) return "primary";
      else return "info"
    },
    // 获取文档内容
    readGrade(row){
      if(!this.rg.includes(row.id)){
        this.rg.push(row.id);
      }

      getBroadcastInfo(row.id).then(res=>{
        this.read = true ;
        this.msgData = {
          ...row,
          content:res.data
        };
      })
    },
    // 删除广播的方法
    deleteGrade(id){
      deleteBroadcast(id).then(res=>{ })
    },
    back(){
      this.read = false ;
    }
  },
  destroyed() {
    localStorage.setItem('readGrade',JSON.stringify(this.rg))
  }
}
</script>

<style lang="scss" scoped>
.broadcastMessage {
  margin: 0;
  >main{
    padding-bottom: 60px;
    > header {
      margin-bottom: 10px;
      > * {
        margin: 0 10px;
      }

      :first-child {
        margin-left: 0;
      }
    }
  }
  .msg-content{
    margin: 10px 20px;
    padding:2vh 10vw;
    box-sizing: border-box;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    >h5{
      font-size: 26px;
      text-align: center;
    }
    >p{
      display: flex;
      justify-content: space-between;
      line-height: 50px;
    }
  }

}
</style>
