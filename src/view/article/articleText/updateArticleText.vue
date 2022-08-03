<template>
  <el-container class="updateArticle">
    <el-header>
      <el-page-header @back="goBack" content="编辑文本内容"></el-page-header>
    </el-header>
    <el-main>
      <el-form ref="form" :model="articleInfo" label-width="140px" >
        <el-form-item label="标题">
          <el-input v-model="articleInfo.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="内容信息">
          <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 30}" placeholder="请输入内容" v-model="articleInfo.content"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">修改</el-button>
          <el-button type="warning" @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import {getArticleInfo, updateArticleTetxInfo} from "@/api/article";

export default {
  name: "updateArticle",
  props:['id','tableName'],
  data() {
    return {
      articleInfo:{},
    }
  },
  created() {
    this.getArticleInfo()
  },
  mounted() {
  },
  methods: {
    getArticleInfo(){
      let d = {
        id : this.id,
        lang :this.tableName
      }
      getArticleInfo(d).then(res=>{
        this.articleInfo = res.data;
      })
    },
    goBack(){
      this.$emit('closeUp')
    },
    submit(){
      this.articleInfo.tableName = this.tableName;
      updateArticleTetxInfo(this.articleInfo).then(res=>{
        this.$message.success(res.msg);
        this.getArticleInfo()
      })
    }
  },
}
</script>
<style>
.ql-container {
  min-height: 60vh;
}
</style>
