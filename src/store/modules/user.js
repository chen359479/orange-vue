const state = {
    userInfo: {}, // 用户信息
    userJit: [  // 用户权限
        {
            label: "超级管理员",
            value: "superAdmin"
        },{
            label: "管理员",
            value: "admin"
        },{
            label: "用户",
            value: "user"
        },
    ],
    userState: [  // 用户状态
        {
            label: "启用",
            value: 1
        }, {
            label: "锁定",
            value: 2
        }, {
            label: "销户",
            value: 3
        },
    ]
};

const mutations = {
    setUserInfo: (state, data) => {
        state.userInfo = data;
    },
    setUserJit: (state, data) => {
        state.userJit = data;
    },
    setUserState: (state, data) => {
        state.userState = data;
    },
}
const actions = {};

export default {
    state,
    mutations,
    actions
};
