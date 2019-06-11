<template>
  <div>
    <h1>附件上传</h1>
    <file-upload
      :ident="0"
      :accept="'video/*'"
      :isDesc="false"
      :maxLength="maxLength"
      :imgArray="imgArray"
      :prefix-url="'http://pgc.cdn.xiaodutv.com/'"
      :owner-table="'ceshi'"
      @callbackFun="fileArrayCB"
    >
      <!--
        附件上传 支持 android 手机 直接拍照 上传
        ident: Number, // 唯一标识
        isDesc: 默认显示图片大小个数； boolean 类型
        maxLength 默认图片添加数 6；Number 类型
        imgArray 图片数据
        prefixUrl 图片 url 的前缀
        callbackFun 返回的数据组
        dynamicAssignment 动态赋值 只有当组件的时候用到
        accept: String; image/*:接受所有的图像文件; video/*: 接受所有的视频文件; audio/*: 	接受所有的声音文件; other:MIME_type 自己百度
       -->
    </file-upload>
  </div>
</template>

<script>
import fileUpload from '@/components/FileUpload/index'
export default {
  name: 'App',
  components: {
    fileUpload
  },
  data() {
    return {
      maxLength: 6,
      imgArray: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.imgArray = [
        // {
        //   fileData: '120x60',
        //   fileExtension: 'png',
        //   fileName: 'delete.png',
        //   fileSize: 3068,
        //   isImg: true,
        //   src: 'http://dummyimage.com/60x60'
        // },
        // {
        //   fileData: '120x600',
        //   fileExtension: 'png',
        //   fileName: 'delete.png',
        //   fileSize: 3068,
        //   isImg: true,
        //   src: 'http://dummyimage.com/120x120'
        // },
        {
          fileId: '',
          fileName: 'timg.jpg',
          fileType: '',
          fileData: '2228663865_1850018490_2018121916501620181219212104.mp4?Cache-Control=max-age%3D8640000&responseExpires=Fri%2C+29+Mar+2019+21%3A22%3A29+GMT&xcode=74b792d6272017634a6db956e815c55f43fac43cc653acf1&time=1559975770&_=1559889376572',
          ownerTable: ''
        }
      ]
    })
  },
  methods: {
    fileArrayCB(array) {
      console.log(array)
    }
  }
}
</script>

