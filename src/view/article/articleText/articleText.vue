<template>
  <div class="articleText">
    <header v-show="!update.type">
      <el-select v-model="searchForm.tableName" placeholder="请选择" @change="topClassChange">
        <el-option v-for="item in articleTextClass" :key="item.name" :label="item.title" :value="item.name"></el-option>
      </el-select>
      <el-button type="danger" size="medium" icon="el-icon-delete" @click="deleteArticleList">批量删除</el-button>
    </header>
    <main v-show="!update.type">
      <el-table :data="activeTextData" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="title" label="标题" align="center" width="800" show-overflow-tooltip ></el-table-column>
        <el-table-column prop="time" label="创建时间" align="center" ></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-link type="primary" style="margin: 0 10px" @click="updateArticle(true,scope.row.id)">编辑</el-link>
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
    <update-article-text v-if="update.type" :id="update.id" :tableName="update.tableName" @closeUp="updateArticle(false)"></update-article-text>
  </div>
</template>

<script>
import { getArticleTextClass } from '@/api/class'
import { getArticleTextList , deleteArticle } from '@/api/article';
import updateArticleText from "@/view/article/articleText/updateArticleText";

export default {
  name: "articleText",
  data() {
    return {
      searchForm:{
        tableName:"",
        page:1,
        pageSize:10
      },
      // 分类
      articleTextClass:[],
      activeTextData: [],
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
    this.getArticleTextClass()
  },
  methods: {
    handleSelectionChange(val) {
      this.activeArticleList = val;
    },
    handleSizeChange(val) {
      this.searchForm.page = 1;
      this.searchForm.pageSize = val;
      this.getArticleTextList();
    },
    handleCurrentChange(val) {
      this.searchForm.page = val;
      this.getArticleTextList();
    },
    // 获取分类
    getArticleTextClass(){
      getArticleTextClass().then(res=>{
        this.articleTextClass = res.data;
        this.searchForm.tableName = res.data[0].name;
        this.getArticleTextList();
      })
    },
    // 分类的切换
    topClassChange(val){
      this.searchForm.tableName = val;
      this.getArticleTextList();
    },
    // 获取数据
    getArticleTextList(){
      getArticleTextList(this.searchForm).then(res=>{
        this.activeTextData = res.data;
        this.searchForm.total = res.total
      })
    },
    // 删除
    deleteArticle(id){
      this.$confirm('确定删除该资源?', '提示', {
        type: 'warning'
      }).then(() => {
        deleteArticle({id,tableName:this.searchForm.tableName}).then(res=>{
          this.getArticleTextList();
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
            this.getArticleTextList();
            this.$message.success('删除成功!');
          })
        })
      }
    },
    // 修改
    updateArticle(type,id){
      this.update = {
        type,
        id,
        tableName:this.searchForm.tableName
      }
    }
  },
  components:{
    updateArticleText
  }
}
</script>

<style lang="scss" scoped>
.articleText {
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
