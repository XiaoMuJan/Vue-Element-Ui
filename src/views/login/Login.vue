<template>
    <div class="login">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small" label-width="90px" class="ruleForm">
            <el-form-item label="用户名" prop="userName">
                <el-input v-model="ruleForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pwd">
                <el-input type="password" v-model="ruleForm.pwd" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {


                ruleForm: {
                    userName: '',
                    pwd: ''
                },



                rules: {
                    userName: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    pwd: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                //    表单验证方法$refs
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // 发送请求，进行登录
                        this.$axios.get("/api/user.json").then((res) => {
                            var dt = res.data
                            var user = dt.data.find((u) => {
                                //表单，通过axios拿到的数据源和登录的对比，然后返回结果给user
                                return u.userName==this.ruleForm.userName && u.pwd==this.ruleForm.pwd
                            })
                            //如果表单结果是true，也就是匹配
                            if (user) {
                                this.$message({
                                    message: '登录成功。',
                                    type: 'success'
                                })
                                // 保存用户信息到vuex中,这个是同步操作$store.commit，把结果给setCurrentUser
                                this.$store.commit('setCurrentUser',user)
                                // 跳转路由，因为这里是登录成功后的，所有登录成功就给他跳转页面
                                this.$router.push('/home')
                            }else {
                                this.$message({
                                    message: '用户名或密码错误！',
                                    type: 'warning'
                                })
                            }
                        }).catch((error) => {
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .ruleForm {
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -160px;
        margin-top: -160px;
        border: 1px solid #eeeeee;
        width: 320px;
        height: 320px;
        box-sizing: border-box;
        padding-right: 40px;
        padding-top: 80px;
    }
    .login {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }

</style>