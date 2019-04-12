<template>
  <div>
    <h1>附件上传</h1>
    <file-upload
      :isDesc="true"
      :maxLength="maxLength"
      @callbackFun="fileArrayCB"
    >
      <!--
        附件上传 支持 android 手机 直接拍照 上传
        isDesc: 默认显示图片大小个数； boolean 类型
        maxLength 默认图片添加数 6；Number 类型
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
      maxLength: 6
    }
  },
  methods: {
    fileArrayCB(array) {
      console.log(array)
    }
  }
}
</script>

