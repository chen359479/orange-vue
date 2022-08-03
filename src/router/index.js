import Vue from 'vue';
import VueRouter  from 'vue-router';
import { Message } from 'element-ui';

import {myStore} from '@/store'
const store = myStore();

import login from '@/view/login/login.vue';
import main from '@/view/main/index.vue';
import home from '@/view/home/home.vue';

import jurisdiction from './jurisdiction'; // 权限设置
import broadcast  from "@/router/broadcast"; // 广播
import article  from "@/router/article"; // 资源内容

Vue.use(VueRouter);
const router=new VueRouter({
    // mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/login',
            component: login,
        },
        {
            path: '/login',
            name: 'login',
            component: login,
        },
        {
            path: '/main',
            name: 'main',
            component: main,
            children:[
                {
                    path: 'home',
                    name: 'home',
                    component: home,
                },
                ...jurisdiction,
                ...broadcast,
                ...article,
                {
                    path: '',
                    redirect: '/main/home'
                }
            ]
        }
    ]
});

let allMenuList = [];
router.beforeEach((to, from, next) => {
    // 获取所有后端返回的路由
    if( !allMenuList.length ){
        store.state.menu.allMenuList.forEach(item=> allMenuList = allMenuList.concat(item) )
        allMenuList = allMenuList.map(item => item.name)
    }
    // 在这里做的权限验证，验证跳转的路由是否在后台允许的范围内。
    // 如果想要屏蔽掉、不进行权限验证，添加格式如同login
    // 注意 路由的name必须与添加菜单时的组件名称一致！！！
    if(from.name === 'login' || to.name === 'login' || to.name === 'home'){
        next()
    }else {
        if(allMenuList.includes(to.name)){
            next()
        }else {
            // from.name为空则代表用户刷了页面
            if(!from.name) next();
            else Message.error('没有权限访问该地址!')
        }
    }
})
export default router;
