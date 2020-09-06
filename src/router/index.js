import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

import Login from "../views/login/Login";
import Home from "../views/home/Home";
import Arrange from "../views/arrange/Arrange";
import Choose from "../views/choose/Choose";
import ClassRoom from "../views/classroom/ClassRoom";
import Course from "../views/course/Course";
import Grade from "../views/grade/Grade";
import MyChoose from "../views/mychoose/MyChoose";
import MyCourse from "../views/mycourse/MyCourse";
import Student from "../views/student/Student";
import Teacher from "../views/teacher/Teacher";
import Term from "../views/term/Term";
import User from "../views/user/User";
//引用404页面
import NotFound from "../views/notfound/NotFound";
//引用下面的东西可以解决两次点击同一个路由报错的问题
// router文件夹-->index.js文件
//cv以下代码解决路由地址重复的报错问题(一劳永逸)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

//就是说，当不同的角色登入login时，进入到的页面不一样，能看见的东西也是不一样的
//不需要权限控制的路由,也就是公共的
const constantsRoutes=[
    {
        path: '/',
        name: 'Login',
        component: Login
    }

]
  //需要权限控制的路由
  const asyncRoutes = [
  {
      path: '/home',
      name: 'Home',
      component: Home,
      //也就是说，在里面嵌套了一个数组，实现了/home/arrange能跳转到相应的页面，前提是要点击与arrange相关的按钮或者触发条件
      children:[
          {path: 'arrange', name: 'arrange', component: Arrange},
          {path: 'choose', name: 'choose', component: Choose},
          {path: 'classroom', name: 'classroom', component: ClassRoom},
          {path: 'course', name: 'course', component: Course},
          {path: 'grade', name: 'grade', component: Grade},
          {path: 'mychoose', name: 'mychoose', component: MyChoose},
          {path: 'mycourse', name: 'mycourse', component: MyCourse},
          {path: 'student', name: 'student', component: Student},
          {path: 'teacher', name: 'teacher', component: Teacher},
          {path: 'term', name: 'term', component: Term},
          {path: 'user', name: 'user', component: User},
      ]
    }
]


//初始化路由对象
const router = new VueRouter({
  //  初始化的时候，先给不需要权限控制的
  routes:constantsRoutes
})


//定义一个生成动态路由的方法,使得不同的角色登录进去会有不同的页面进行展示
//item是permission中的数组,这里是把constantsRoutes初始化后的结果放到了routes里面
function generateRoutes(menus,routes) {
    let  ary=[]

    menus.forEach((item)=>{
    //这里判断permission里面的数组有没有children，这样就可以判断管理员和另外两个角色的区别
        if (item.children && item.children.length!=0){
            item.children.forEach((sub)=>{
                let rt = routes.find(r =>r.name==sub.name)
                ary.push(rt)
            })
        }else {
             let rt = routes.find(r =>r.name==item.name)
            ary.push(rt)
        }
    })
    return ary
}
    //全局导航守卫,意思就是管控所有的路由
    router.beforeEach((to, from, next) => {
        if (store.state.permission.length==0){//没有获取过权限


            // 请求权限菜单
            store.dispatch('getPermission',store.state.currentUser).then((menus)=>{
                const rt = generateRoutes(menus,asyncRoutes[0].children)
                //创建一个过滤好的路由
                const  newRoutes=[
                    {
                        path: '/home',
                        name: 'Home',
                        component: Home,
                        children:rt
                    },
                    //404页面写法，加个路由跳转到404页面
                    {path: '*', name: 'notfound', component: NotFound}
                ]
                //动态添加路由
                router.addRoutes(newRoutes)
                next('home')
            })
        }



        if (to.path=='/'){
        //执行下一个钩子函数
        next()
    }else {
        if(store.state.currentUser!=null){//说明已经登录,这里控制了登录
            next()
        }else {
            next('/')
        }

    }

})


export default router
