import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //数据保存本地有两种办法,登录里面的user又被传到了这里
    currentUser:sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')): null,
    permission:[],

  },
  mutations: {
    setCurrentUser(state,payload){
      state.currentUser=payload
      //清空permission
      state.permission=[]
      //保存到本地的存储
      sessionStorage.setItem('user',JSON.stringify(payload))
    },
    setPermission(state,payload){
      state.permission=payload
    },
    //退出登录要的代码
    emptyState(state){
      state.currentUser=null
      //退出时直接把数据清空
      state.permission=[]
    }

  },
  actions: {
    //请求数据,这里就是老师和学生页面不同的地方
    getPermission(context,payload){
      //这个promise有两个效果，就是执行异步操作的时候，如果成功就返回resolve参数，如果失败就返回reject参数
      return new Promise((resolve, reject) => {
        axios.get('/api/permission.json').then((res)=>{
          var dt=res.data.data
           var ary= dt[payload.role]
          context.commit('setPermission',ary)
          resolve(ary)
        }).catch((error)=>{})
      })
    }
  },
  modules: {
  }
})
