<template>
    <div class="home">
        <div class="side">
            <p class="title">选课系统</p>
            <el-menu
                    default-active="2"
                    class="el-menu"
                    @open="handleOpen"
                    @close="handleClose"
                    background-color="#222222"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                <template v-for="(item,i) in menus">
<!--                    i变成字符串有什么用？-->
                    <el-submenu v-if="item.children && item.children.length!=0" :index="i.toString()">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>{{ item.title }}</span>
                        </template>
<!--                    i+'-'+idx    -->
                        <el-menu-item
                                v-for="(m,idx) in item.children"
                                :index="i+'-'+idx"
                                @click="handleGo(m)"
                        >{{ m.title }}
                        </el-menu-item>
                    </el-submenu>
                    <el-menu-item
                            v-else
                            :index="i.toString()"
                            @click="handleGo(item)"
                    >
                        <i class="el-icon-menu"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </el-menu>
        </div>
        <div class="main">
            <div class="header">
                <div class="h-right">
                    <el-dropdown @command="handleCommand">
                  <span class="el-dropdown-link">
                    {{currentUser.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="update">修改密码</el-dropdown-item>
                            <el-dropdown-item command="exit">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <div class="container">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>
    //
    import {mapState} from 'vuex'
    export default {
        name: "Home",
        data(){
            return{
                active:''
            }
        },
        methods: {
            handleCommand(command) {
                this.$message('click on item ' + command);
                //清空vuex，同步清空
                this.$store.commit('emptyState')
                //清空session
                sessionStorage.clear()
                //跳转到登录
                this.$router.push('/')
            },
            //拷贝部分需要的代码，不需要明白
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            handleGo(item) {
                //通过path
                // this.$router.push('/home/'+item.name)
                this.$router.push({name: item.name})
            }
        }
        ,
        //计算属性
        computed: {
            //对象展开运算符
            ...mapState({
                currentUser:'currentUser',
                menus:'permission'
            })
        },
        mounted() {
            //route和router有什么区别
            this.active=this.$route.name
        }
    }
</script>

<style scoped>
    .home {
        display: flex;
    }
    .side {
        position: absolute;
        left: 0;
        top: 0;
        width: 220px;
        bottom: 0;
        background: #222222;
        /*overflow: auto;*/
    }
    .side .title {
        line-height: 50px;
        text-align: center;
        color: rgba(255,255,255,0.8);
    }
    .el-menu {
        width: 100%;
    }
    .main {
        flex: 1;
        position: absolute;
        left: 220px;
        top: 0;
        right: 0;
        bottom: 0;
    }
    .main .header {
        position: fixed;
        left: 220px;
        top: 0;
        right: 0;
        height: 50px;
        background: white;
        /*border-bottom: 1px solid #eeeeee;*/
        box-sizing: border-box;
        padding: 0 10px;
        display: flex;
        align-items: center;
    }
    .header .h-right{
        flex: 1;
        text-align: right;
    }
    .main .container {
        position: absolute;
        left: 0;
        top: 50px;
        right: 0;
        bottom: 0;
        padding: 15px;
        box-sizing: border-box;
        background: #f2f2f2;
        overflow: auto;
    }

</style>
