<template>
    <div class="course">
        <el-form :inline="true"     :model="formInline"     size="small" class="demo-form-inline">
            <el-form-item label="学科编号">
                <el-input v-model="formInline.courseNo" placeholder="学科编号"></el-input>
            </el-form-item>
            <el-form-item label="学科名称">
                <el-select v-model="formInline.courseName" placeholder="学科名称">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
<!--               icon="el-icon-search" 这个是elementui的图标，不需要加iconfont也能实现，并且只需要改变里面的值就能实现变换 -->
                <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleClick('','add')">新增</el-button>

            </el-form-item>
        </el-form>
<!--        //这个slice是计算分页的公式
            //这里直接把tableData赋给表单，用以传递新增的数据，直接就可以在表单显示-->
        <el-table
                :data="tableData.slice((currengPage-1)*pageSize,currengPage*pageSize)"
                size="small"
                border
                style="width: 100%">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    fixed
                    prop="id"
                    label="ID"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="courseNo"
                    label="学科编号"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="courseName"
                    label="学科名称"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="score"
                    label="学分"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="courseHour"
                    label="学时"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="term"
                    label="学期"
                    width="120">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                   >
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row,'look')" type="text" size="small">查看</el-button>
                    <el-button @click="handleClick(scope.row,'edit')"  type="text" size="small">编辑</el-button>
                    <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>

        </el-table>
        <el-pagination
                class="page"
                background
                layout="prev, pager, next"
                :total="tableData.length"
                :page-size="pageSize"
                small
                @current-change="handlePage"
        >
<!--            上面的current-change是elementui固定的分页方法-->
<!--           page-size -->
        </el-pagination>
<!--        //好奇怪啊，这里dialogTitle变成字符串，下面直接赋值，然后就能在网页上显示了？？？你这不是还在<>里面吗？
        //说是element-ui里面的定义，不用管-->
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :width="35+'%'">
<!--            disabled的意思是要不要禁止对from进行修改,把选择权分给isDisable-->
            <el-form :model="editForm" label-width="80px" :disabled="isDisable">
                <el-form-item label="学科编号">
                    <el-input v-model="editForm.courseNo" placeholder="学科编号"></el-input>
                </el-form-item>
                <el-form-item label="学科名称">
                    <el-input v-model="editForm.courseName" placeholder="学科名称">
                    </el-input>
                </el-form-item>
                <el-form-item label="学分">
                    <el-input v-model="editForm.score" placeholder="学分">
                    </el-input>
                </el-form-item>
                <el-form-item label="学时">
                    <el-input v-model="editForm.courseHour" placeholder="学时">
                    </el-input>
                </el-form-item>
                <el-form-item label="学期">
                    <el-input v-model="editForm.term" placeholder="学期">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSave">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Course",
        data() {
            return {
                //公共的json直接使用，这么粗放的吗
                formInline: {
                    courseNo: '',
                    courseName: ''
                },
                //这里是新作一个数据对象，以便匹配数据源
                editForm:{
                    id:'',
                    courseNo: '',
                    courseName: '',
                    //0为初始值
                    score:'',
                    courseHour:'',
                    term:''
                },
                //提前定义点击取消的时候是否关闭新增页面
                dialogFormVisible:false,
                //这里定义一下是否想要禁止某个的修改权限,在数据定义一个状态后,以便后方的更改，
                isDisable:false,
                //这里直接输出字符串的需要提前定一个字符串的变量
                dialogTitle:'',
                operate:'',//标识是新增还是查看还是编辑
                //新定义一个数组，以便接收从数据源拿到的数据
                tableData: [],
                //分页需要定义的两个数
                pageSize:5,
                currengPage:1
            }
        },
        //模拟与后台交换数据，整个页面的数据只有这里调用了
        //then是promise所必须提供的,用以访问当前值，终值以及原因
        //mounted在页面初始化完成后，再进行调用dom【Vue的生命周期】
        mounted() {
            this.$axios.get('/api/course.json').then((res) => {
                //这里只有tableData调用了合理的json数据，为什么formInline这个也能使用？
                this.tableData = res.data.data
            })
        },
        methods: {
            onSubmit() {
                console.log('submit!');
            },
            handleClick(row,ope) {
                //把判断结果返回给已经声明过的operate,然后这个东西就具备了
                this.operate=ope
                //在单击的时候用dialogTitle匹配字符串判断一下
                switch (ope) {
                    case 'add':
                        //此处调用后台接口的操作省略
                        this.dialogTitle='新增'
                        this.isDisable=false
                        //如果是新增的话，清除一下前面输入过的东西
                        this.emptyEditFrom()
                        break
                    case 'look':
                        this.dialogTitle='查看'
                        //这里把禁止修改的权限变成true
                        this.isDisable=true
                        //这里是把row变成一个对象，又赋值给editForm
                        //Object.assign()方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
                        //这里通过把一个空的row，什么都没有的，把它赋给editform，那么handleClick就能拿到editForm
                        //里面的所有数据了,也就是能拿到所有用户输入的，被editform定义的数据，
                        //毕竟前面editform定义的都是空字符串,这里是当用户单击的时候，判断是查看还是编辑还是增加完毕了之后，
                        // 用户需要或者是可以自己输入数据了
                        this.editForm=Object.assign({},row)
                        break
                    case 'edit':
                        //此处调用后台接口的操作省略
                        this.dialogTitle='编辑'
                        this.isDisable=false
                        this.editForm=Object.assign({},row)
                        break
                }
                //这里当单击新增，查看，编辑的时候，是不是可以单击取消后关闭页面
                // 这里把可以关闭的权限打开
                this.dialogFormVisible=true
            },
            //单击确定后再次处理
            handleSave(){
                //这里再次判断新增，查看，编辑
                switch (this.operate) {
                    case "add":
                        //此处调用后台接口的操作省略
                        //增加学科的时候，添加数据到tableData
                        //当删除完了之后，解决新增后没有id的问题
                        var val=0
                        if (this.tableData.length){
                            //这里item当前点击的,拿到了最大的id
                            var val = Math.max.apply(Math,this.tableData.map(item=>{return item.id}))
                        }
                        //拿到id的最大值后，复制给editForm，因为在这个页面，它原来没有值
                        //当前点击的索引值再加1就是当前的id值，因为索引是从0开始，开始我们的数据源id是从1开始的
                        //然后，这里就拿到了当前的值
                        this.editForm.id=val+1
                        //把数据添加到tableData
                        //复制一份数据,这里前面的写法因为还关联tableData
                        //所以如果清空的话把需要的数据也清空了，这里是优化过的
                        var obj= Object.assign({},this.editForm)
                        //直接在表达输出
                        this.tableData.push(obj)
                        //清空editform
                        this.emptyEditFrom()
                        break
                    case "edit":
                        //此处调用后台接口的操作省略
                        this.tableData.forEach((item)=>{
                            if (item.id==this.editForm.id){
                                item.score=this.editForm.score
                                item.courseName=this.editForm.courseName
                                item.courseNo=this.editForm.courseNo
                                item.courseHour=this.editForm.courseHour
                                item.term=this.editForm.term
                            }
                        })
                        break
                    case "look":
                        break
                }
                //点击取消可以获取关闭新增学科页面的权限吗，这里不给
                this.dialogFormVisible = false
            },
            handleDelete(row){
                //$confirm
                this.$confirm('确定要删除该课程？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //此处调用后台接口的操作省略

                    //查找要删除的行索引，也就是用索引删掉整行
                     var idx =this.tableData.findIndex((item,i)=>{
                        return item.id==row.id
                    })
                    //splice() 方法向/从数组中添加/删除项目,然后返回被删除的项目。 注释:该方法会改变原始数组。
                    this.tableData.splice(idx,1)
                    //message
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {})
            },
            //清空
            emptyEditFrom(){
                for (let key in this.editForm){
                    this.editForm[key]=''
                }
            },
            //控制分页的方法
            handlePage(val){
                this.currengPage=val
            }
        },
    }
</script>

<style scoped>

    .page {
        margin-top: 20px;
    }

</style>
