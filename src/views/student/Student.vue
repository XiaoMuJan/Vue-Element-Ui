<template>
    <div class="student">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="查询人">
                <el-input v-model="formInline.name" placeholder="查询人"></el-input>
            </el-form-item>
            <el-form-item label="区域">
                <el-select v-model="formInline.studentNo" placeholder="区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleClick('','add')">增加</el-button>
            </el-form-item>
        </el-form>
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" :width="35+'%'">
            <el-form :model="editForm" label-width="80px" :disabled="isDisable">
                <el-form-item label="学生编号">
                    <el-input v-model="editForm.studentNo" placeholder="学生编号"></el-input>
                </el-form-item>
                <el-form-item label="学生姓名">
                    <el-input v-model="editForm.name" placeholder="学生姓名">
                    </el-input>
                </el-form-item>
                <el-form-item label="学生性别">
                    <el-input v-model="editForm.sex" placeholder="学生性别">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSave">确 定</el-button>
            </div>
        </el-dialog>
        <el-table
                :data="studentX.slice((currengPage-1)*pageSize,currengPage*pageSize)"
                size="small"
                height="520"
                border
                style="width: 90%">
            <el-table-column
                    prop="id"
                    label="ID"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="studentNo"
                    label="学号"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名">
            </el-table-column>
            <el-table-column
                    prop="sex"
                    label="性别">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="180"
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
                :total="studentX.length"
                :page-size="pageSize"
                @current-change="handlePage"
        >
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: "Student",
        data(){
            return {
                pageSize:12,
                currengPage:1,
                operate:'',//标识是新增还是查看还是编辑
                //这里定义一下是否想要禁止某个的修改权限,在数据定义一个状态后,以便后方的更改，
                isDisable:false,
                //提前定义点击取消的时候是否关闭新增页面
                dialogFormVisible:false,
                dialogTitle:'',
                studentX: [],
                //第一部分需要的
                formInline: {
                    studentNo: '',
                    name: ''
                },
                //无语了这里，居然要为新增，编辑，查看，去新增一个对象，这里studentX只是数据源，不能拿来
                // 循环本页的数据foreach什么的
                editForm:{
                    id:'',
                    studentNo: '',
                    name: '',
                    sex:'',
                },
            }
        },
        methods: {
            ////第一部分需要的
            onSubmit() {
                console.log('submit!');
            },
            handleClick(row,ope) {
                //把判断结果返回给已经声明过的operate,然后这个东西就具备了
                this.operate=ope
                //在单击的时候用dialogTitle匹配字符串判断一下
                switch (ope) {
                    case 'add':
                        this.dialogTitle='新增'
                        this.isDisable=false
                        this.emptyEditFrom()
                        break
                    case 'look':
                        this.dialogTitle='查看'
                        this.isDisable=true
                        this.editForm=Object.assign({},row)
                        break
                    case 'edit':
                        this.dialogTitle='编辑'
                        this.isDisable=false
                        this.editForm=Object.assign({},row)
                        break
                }
                //这里当单击新增，查看，编辑的时候，是不是可以单击取消后关闭页面
                // 这里把可以关闭的权限打开
                this.dialogFormVisible=true
            },
            handleSave(){
                //这里再次判断新增，查看，编辑
                //这里无非是为了给switch一个执行的借口，this.operate当然一直是true
                switch (this.operate) {
                    case "add":
                        var val=0
                        if (this.studentX.length){
                            //apply方法可以将一个数组默认的转换为一个参数列表([param1,param2,param3]
                            // 转换为 param1,param2,param3) studentX就是一个数组包含对象
                            //这里也就是说，把studentX变回了对象然后赋给val
                            var val = Math.max.apply(Math,this.studentX.map(item=>{return item.id}))
                        }
                        this.editForm.id=val+1

                        var obj= Object.assign({},this.editForm)
                        this.studentX.push(obj)
                        this.emptyEditFrom()
                        break
                    case "edit":
                        this.studentX.forEach((item)=>{
                            if (item.id==this.editForm.id){
                                item.studentNo=this.editForm.studentNo
                                item.name=this.editForm.name
                                item.sex=this.editForm.sex
                            }
                        })
                        break
                    case "look":
                        break
                }
                //点击取消可以获取关闭新增学科页面的权限吗，这里不给
                this.dialogFormVisible = false
            },
            //清空
            emptyEditFrom(){
                for (let key in this.editForm){
                    this.editForm[key]=''
                }
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
                    var idx =this.studentX.findIndex((item,i)=>{
                        return item.id==row.id
                    })
                    //splice() 方法向/从数组中添加/删除项目,然后返回被删除的项目。 注释:该方法会改变原始数组。
                    this.studentX.splice(idx,1)
                    //message
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {})
            },
            //分页方法
            handlePage(val){
                this.currengPage=val
            }
        },
        mounted() {
            this.$axios.get('/api/student.json').then((studentJson)=>{
                this.studentX=studentJson.data.data
            })
        },
    }
</script>

<style scoped>
    .page {
        margin-top: 20px;
    }
</style>