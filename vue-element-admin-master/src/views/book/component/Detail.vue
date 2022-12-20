<template>
  <div>
    <el-form ref="postForm" :model="postForm" :rules="rules">
      <sticky :class-name="'sub-navbar'">
        <el-button @click="showGuide">显示帮助</el-button>
        <el-button v-loading="loading"
        @click="submitForm"
        type="success"
        style="margin-left:10px">{{
          isEdit ? "编辑电子书" : "新增电子书"
        }}</el-button>
      </sticky>
      <div class="detail-container">
        <el-row>
          <Warning/>
          <el-col :span="24">
            <!-- 表单控件的具体样式 -->
            <EbookUpload
            :file-list="fileList"
            :disabled="isEdit"
            @onSuccess = "onUploadSuccess"
            @onRemove = "onUploadRemove"
            />
          </el-col>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop=" title">
      <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
        书名
      </MDinput>
    </el-form-item>
    <div>
      <el-row>
        <el-col :span="12" class="form-item-author">
          <el-form-item :label-width="labelWidth" prop="author" label="作者：">
            <el-input
              v-model="postForm.author"
              placeholder="作者"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label-width="labelWidth"  prop="publisher" label="出版社：">
            <el-input
              v-model="postForm.publisher"
              placeholder="出版社"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label-width="labelWidth" prop="language" label="语言：">
            <el-input
              v-model="postForm.language"
              placeholder="语言"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label-width="labelWidth" prop="rootFile" label="根文件：">
            <el-input
              v-model="postForm.rootFile"
              placeholder="根文件"
              style="width: 100%"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label-width="labelWidth" prop="filePath" label="文件路径：">
            <el-input
              v-model="postForm.filePath"
              placeholder="文件路径"
              style="width: 100%"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label-width="labelWidth" prop="unzipPath" label="解压路径：">
            <el-input
              v-model="postForm.unzipPath"
              placeholder="解压路径"
              style="width: 100%"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label-width="labelWidth" prop="coverPath" label="封面路径：">
            <el-input
              v-model="postForm.coverPath"
              placeholder="封面路径"
              style="width: 100%"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label-width="labelWidth" prop="fileName" label="文件名称：">
            <el-input
              v-model="postForm.fileName"
              placeholder="文件名称"
              style="width: 100%"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label-width="60px" label="封面：" prop="cover">
            <a v-if="postForm.cover" :href="postForm.cover" target="_blank">
              <img :src="postForm.cover" class="preview-img">
            </a>
            <span v-else>无</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label-width="60px" label="目录：" >
            <div
              v-if="contentsTree && contentsTree.length > 0"
              class="contents-wrapper"
            >
              <el-tree :data="contentsTree" @node-click="onContentClick" />
            </div>
            <span v-else>无</span>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky/index.vue";
import Warning from './Warning.vue';
import EbookUpload from '@/components/EbookUpload/index.vue'
import MDinput from '@/components/MDinput/index.vue'
import {createBook,getBook,updateBook} from '@/api/book'


const defaultForm = {
        title:'',
        author:'',
        publisher:'',
        language:'',
        rootFile:'',
        cover:'',
        url:'',
        originalName:'',
        fileName:"",
        coverPath:'',
        filePath:'',
        unzipPath:'',
}

const fields= {
  title:"标题",
  author:"作者",
  publisher:'出版社',
  language:'语言'
}


export default {
  props: {
    isEdit: Boolean,
  },
  components: { Sticky,Warning,EbookUpload,MDinput},
  methods: {
    // 往表单写数据的方法
    setData(data){
      const {
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        url,
        originalName,
        contents,
        fileName,
        coverPath,
        filePath,
        unzipPath,
        contentsTree
      }=data
      this.postForm={
        ...this.postForm,
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        url,
        originalName,
        contents,
        fileName,
        coverPath,
        filePath,
        unzipPath,

      }
      this.contentsTree = contentsTree
      this.fileList = [{name:originalName||fileName,url}]

    },
    //重置数据
    setDefault(){
      // this.postForm = Object.assign({},defaultForm)
      this.contentsTree =[]
      this.fileList = []
      this.$refs.postForm.resetFields()
    },
    showGuide() {
      console.log("showGuide");
    },
    submitForm() {
      if(!this.loading){

        this.loading = true;
        this.$refs.postForm.validate((valid,fields)=>{
          console.log(valid,fields)
        if(valid){
          const book = Object.assign({},this.postForm)
          // const book = {...this.postForm}//浅拷贝
          delete book.contents
          delete book.contentsTree
          if(!this.isEdit){
            createBook(book).then(response=>{
              const {msg} = response
              this.$notify({
                title:'操作成功',
                message:msg,
                type:'success',
                duration:2000
              })
              this.loading = false
              // this.setDefault()
            }).catch(()=>{
              this.loading =false

            })
          }else{
            updateBook(book).then(response=>{
              const {msg} = response
              this.$notify({
                title:'操作成功',
                message:msg,
                type:'success',
                duration:2000
              })
              this.loading = false
            }).catch(()=>{
              this.loading = false
            })
          }
        }else{
         const message =  fileds[Object.keys(fields)[0][0]].message
         this.$message({
            message,
            type:'error'
         })
         this.loading =false

        }
      })
    }


    },
    onUploadSuccess(data){
      console.log('onUploadSuccess',data)
      this.setData(data)

    },
    // 点击清空表单
    onUploadRemove(){
      console.log('onUploadRemove')
      this.setDefault()

    },
    onContentClick(data){
      if(data.text){
        window.open(data.text)
      }

    },
    //获取图书数据的方法
    getBookData(fileName){
      getBook(fileName).then(response=>{
        this.setData(response.data)
      })

    }

  },
  created(){
    if(this.isEdit){
    const fileName = this.$route.params.fileName
    this.getBookData(fileName)

    }

  },
  data() {
    const validateRequire = (rule, value, callback) => {
    if (value === '') {
      this.$message({
        message: rule.field + '为必传项',
        type: 'error'
      })
      callback(new Error(rule.field + '为必传项'))
    } else {
      callback()
    }
  }
    return {
      loading: false,
      postForm:{

      },
      fileList:[],
      labelWidth:'120px',
      contentsTree:[],
      // 表单校检规则
      rules:{
        title:[{validator:validateRequire}],
        author:[{validator:validateRequire}],
        publisher:[{validator:validateRequire}],
        language:[{validator:validateRequire}],

      }
    };
  },
};
</script>

<style lang="scss" scoped>
.detail-container{
  padding: 40px 50px 20px;
  .preview-img{
    width:200px;
    height:270px
  }
}
</style>
