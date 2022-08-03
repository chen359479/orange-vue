
export default [
   {
        path: 'userManagement',
        name: 'userManagement',
        component:  ()=>import('@/view/jurisdiction/userManagement/userManagement.vue')
   }, {
        path: 'personalCenter',
        name: 'personalCenter',
        component: ()=>import('@/view/jurisdiction/personalCenter/personalCenter.vue'),
    },{
        path: 'menus',
        name: 'menus',
        component: ()=>import('@/view/jurisdiction/menus/menus.vue'),
    },{
        path: 'wxUser',
        name: 'wxUser',
        component: ()=>import('@/view/jurisdiction/wxUser/wxUser.vue'),
    },
]
