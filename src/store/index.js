import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user' //用户相关
import menu from './modules/menu' //菜单相关

import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        user,
        menu
    },
    getters
})

// 添加此方法是为了能够在router.js里能够获取到添加的状态
export function myStore() {
    return store;
}

export default store
