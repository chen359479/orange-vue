<template>
  <div class="articleInfo">
    <header v-show="!update.type">
      <el-select v-model="searchForm.tableName" placeholder="请选择"  @change="topClassChange">
        <el-option v-for="item in topClass" :key="item.name" :label="item.title" :value="item.name"></el-option>
      </el-select>
      <el-select v-model="searchForm.title" placeholder="请选择" @change="secondaryClassChange">
        <el-option v-for="item in secondaryClass" :key="item.title" :label="item.title" :value="item.title"></el-option>
      </el-select>
      <el-button type="danger" size="medium" icon="el-icon-delete" @click="deleteArticleList">批量删除</el-button>
    </header>
    <main v-show="!update.type">
      <el-table :data="activeData" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="title" label="标题" align="center" width="800" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="time" label="创建时间" align="center" ></el-table-column>
        <el-table-column prop="lang" label="语言" align="center" ></el-table-column>
        <el-table-column prop="size" label="大小" align="center" ></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-link type="primary" style="margin: 0 10px" @click="updateArticleInfo( true ,scope.row.id)">编辑</el-link>
            <el-link type="danger" style="margin: 0 10px" @click="deleteArticle(scope.row.id)">删除</el-link>
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
    <update-article v-if="update.type" :id="update.id" :tableName="update.tableName" @closeUp="updateArticleInfo(false)"></update-article>
  </div>
</template>

<script>
import { getArticleTopClass , getArticleSecondaryClass  } from '@/api/class';
import { getArticleList , deleteArticle } from '@/api/article';
import updateArticle from "@/view/article/articleInfo/updateArticle";

export default {
  name: "articleInfo",
  data() {
    return {
      searchForm:{
        tableName:"",
        title:'全部',
        page:1,
        pageSize:10
      },
      // 顶级分类
      topClass:[],
      // 次级分类
      secondaryClass:[],
      activeData: [],
      activeArticleList:[],
      // 修改的表单
      update:{
        type:false,
        id:0,
        tableName:""
      }
    }
  },
  created() {
    this.getArticleTopClass()
  },
  mounted() {
  },
  methods: {
    handleSelectionChange(val) {
      this.activeArticleList = val;
    },
    handleSizeChange(val) {
      this.searchForm.page = 1;
      this.searchForm.pageSize = val;
      this.getArticleList();
    },
    handleCurrentChange(val) {
      this.searchForm.page = val;
      this.getArticleList();
    },
    // 获取顶级分类
    getArticleTopClass(){
      getArticleTopClass().then(res=>{
        this.topClass = res.data;
        this.searchForm.tableName = res.data[0].name;
        this.getArticleSecondaryClass(res.data[0].name)
      })
    },
    // 获取顶级分类下的次级分类
    getArticleSecondaryClass(name){
      let { id } = this.topClass.filter(item=>item.name === name)[0];
      getArticleSecondaryClass({id}).then(res=>{
        this.secondaryClass = [{ title:"全部"}].concat(res.data);
        this.searchForm.title = '全部';
        this.searchForm.page = 1;
        this.getArticleList();
      })
    },
    // 顶级分类的切换
    topClassChange(val){
      this.searchForm.tableName = val;
      this.getArticleSecondaryClass(val);
    },
    // 次级分类的切换
    secondaryClassChange(val){
      this.searchForm.title = val;
      this.getArticleList();
    },
    // 获取数据
    getArticleList(){
      let s = { ...this.searchForm }
      if(s.title == "全部")s.title = "";

      getArticleList(s).then(res=>{
        this.activeData = res.data;
        this.searchForm.total = res.total
      })
    },
    // 删除
    deleteArticle(id){
      this.$confirm('确定删除该资源?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteArticle({id,tableName:this.searchForm.tableName}).then(res=>{
          this.getArticleList();
          this.$message.success('删除成功!');
        })
      })
    },
    // 批量删除
    deleteArticleList(){
      if (!this.activeArticleList.length) {
        this.$message.warning('未选中待删除的资源！');
      } else {
        let id = this.activeArticleList.map(item =>item.id);
        this.$confirm('确定删除这些资源吗?', '提示', {
          type: 'warning'
        }).then(() => {
          deleteArticle({id,tableName:this.searchForm.tableName}).then(res=>{
            this.getArticleList();
            this.$message.success('删除成功!');
          })
        })
      }
    },
    // 修改
    updateArticleInfo(type,id){
      this.update = {
        type,
        id,
        tableName:this.searchForm.tableName
      }
    }
  },
  components:{
    updateArticle
  }
}
</script>

<style lang="scss" scoped>
.articleInfo {
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
