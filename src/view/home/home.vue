<template>
  <div class="home">
    <el-card>
      <div class="info">
        <span>主机名称: {{ data.hostname }} </span>
        <span>CPU数量: {{ data.cpuCount }}核 </span>
        <span>处理器架构: {{ data.arch }} </span>
        <span>操作系统: {{ data.type }} </span>
      </div>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">内存使用情况：</div>
      <div class="info">
        <span>总内存: {{ Math.ceil(data.totalmem/1024) }}G </span>
        <span>空闲内存: {{ (data.freemem/1024).toFixed(2) }}G </span>
        <span>可用内存百分比: {{ ((data.freemem/data.totalmem)*100).toFixed(2) + '%' }} </span>
      </div>
    </el-card>
    <el-card >
      <div slot="header" class="clearfix">磁盘使用情况：</div>
      <div class="info" v-for="item in data.aDrives" :key="item.mounted">
        <span>磁盘名称: {{ item.mounted }}盘 </span>
        <span>磁盘总容量: {{ item.blocks }} </span>
        <span>可用容量: {{ item.available }} </span>
        <span>已用容量百分比: {{ item.capacity }} </span>
      </div>
    </el-card>
    <el-card>
      <div class="info">
        <div class="charts">
          <h3>内存用量</h3>
          <ve-gauge :data="internalData" width="400px"></ve-gauge>
        </div>
        <div class="charts" v-for="(item,index) in diskData" :key="index">
          <h3>{{ item.name }}盘用量</h3>
          <ve-gauge :data="item" width="400px"></ve-gauge>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { systemInfo } from '@/api/system';

export default {
  name: "home",
  data() {
    return {
      data:{},
      internalData:{},
      diskData:[],
      timer:null
    }
  },
  created() {
    this.getSystemInfo()
  },
  mounted() {
    this.timer = setInterval(()=>{
      this.getSystemInfo()
    },5000)
  },
  methods: {
    getSystemInfo(){
      systemInfo().then(res=>{
        this.data = { ...res.data };
        // 内存用量
        this.internalData = {
          columns: ['type', 'value'],
          rows: [
            { type: '用量', value: (((this.data.totalmem-this.data.freemem)/this.data.totalmem)*100).toFixed(2)  }
          ]
        }
        // 磁盘用量
        this.diskData = res.data.aDrives.map(item=>{
          return {
            columns: ['type', 'value'],
            rows: [
              { type: '用量', value: parseInt(item.capacity) }
            ],
            name:item.mounted
          }
        })
      })
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>

<style lang="scss" scoped>
.home{
  >*{
    margin-top: 20px;
  }
}
.info{
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  .charts{
    >h3{
      text-align: center;
    }
  }
}
</style>
