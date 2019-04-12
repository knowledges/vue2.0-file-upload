<template>
  <div>
    <h1>附件上传</h1>
    <file-upload
      :isDesc="true"
      :maxLength="maxLength"
      :imgArray="imgArray"
      @callbackFun="fileArrayCB"
    >
      <!--
        附件上传 支持 android 手机 直接拍照 上传
        isDesc: 默认显示图片大小个数； boolean 类型
        maxLength 默认图片添加数 6；Number 类型
        imgArray 图片数据
        prefixUrl 图片 url 的前缀
        callbackFun 返回的数据组
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
        {
          fileData: '120x60',
          fileExtension: 'png',
          fileName: 'delete.png',
          fileSize: 3068,
          isImg: true,
          src: 'http://dummyimage.com/60x60'
        },
        {
          fileData: '120x600',
          fileExtension: 'png',
          fileName: 'delete.png',
          fileSize: 3068,
          isImg: true,
          src: 'http://dummyimage.com/120x120'
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

