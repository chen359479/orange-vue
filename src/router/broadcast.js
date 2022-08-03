export default [
    {
        path: 'broadcastMessage',
        name: 'broadcastMessage',
        component:  ()=>import('@/view/broadcast/broadcastMessage/broadcastMessage.vue'),
    },
    {
        path: 'sendBroadcast',
        name: 'sendBroadcast',
        component:  ()=>import('@/view/broadcast/sendBroadcast/sendBroadcast.vue'),
    }
]
