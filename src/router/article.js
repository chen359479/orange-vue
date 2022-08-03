export default [
    {
        path: 'articleInfo',
        name: 'articleInfo',
        component:  ()=>import('@/view/article/articleInfo/articleInfo.vue'),
    },
    {
        path: 'articleText',
        name: 'articleText',
        component:  ()=>import('@/view/article/articleText/articleText.vue'),
    }
]
