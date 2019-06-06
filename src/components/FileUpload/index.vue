<!--qiu.bl-->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  .upload_warp_img {
    padding: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .upload_warp_img_all {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    height: 100%;
  }
  .upload_warp_img_div {
    position: relative;
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 5px;
  }
  .upload_warp_img_div_top {
    position: absolute;
    right: 0px;
    top: 0px;
  }
  .upload_warp_img_div_del {
    display: inline-block;
    height: 24px;
    width: 24px;
  }
  .upload_warp_img_phone {
    display: inline-block;
    width: 4.5em;
    height: 4.5em;
    border-radius: 4px;
    border: 1px solid #666;
  }
  .upload_warp_img_pc {
    display: inline-block;
    max-width: 200px;
    height: 80px;
    border-radius: 4px;
    border: 1px solid #666;
  }
  .upload_warp_text {
    margin: 0 20px;
  }
  .clearfix:after {
    content:"";
    display: block;
    clear:both;
  }
  .mask {
    position: fixed;
    top: 0;
    left:0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.8);
  }
  .mask_content {
    display: block;
    height: 100%;
    width: 100%;
    text-align: center;
  }
  .mask img, .mask video {
    position: relative;
    max-width: 100%;
    max-height: 100%;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    -webkit-transition: .15s ease-in-out;
    transition: .15s ease-in-out;
    border: 3px solid #fff;
    border-radius: 5px;
    -webkit-animation: move .25s;
    animation: move .25s;
  }
  .upload_warp_left {
    margin-left: 0px;
  }
  .upload_warp_left svg {
    display: inline-block;
    width: 64px;
    height: 64px;
  }
  img {
    -webkit-user-select: none; /* Chrome all / Safari all */
    -moz-user-select: none; /* Firefox all */
    -ms-user-select: none; /* IE 10+ */
    /* No support for these yet, use at own risk */
    -o-user-select: none;
    user-select: none;
  }
</style>
<template>
  <div>
    <input :id="'upload_file' + ident" type="file" style="display: none;" :accept="accept" name="file" @change="fileChange($event)">
    <div class="image-item space" @click="showActionSheet">
      <!-- 点击事件，弹出选择摄像头和相册的选项 -->
      <div class="image-up">
        <!-- 容器 填充原声弹出层 相册|照相机 -->
      </div>
    </div>

    <div class="upload_warp">
      <div class="upload_warp_img clearfix">
        <div class="upload_warp_img_all">
          <div v-for="(item, key) in imgList" :key="key" class="upload_warp_img_div">
            <div class="upload_warp_img_div_top" @click="fileDel(key)">
              <img src="./img/close.png" class="upload_warp_img_div_del" alt="关闭">
            </div>
            <template v-if="accept == 'image/*'">
              <img :src="item.src" :class="ISPHONE ? 'upload_warp_img_phone' : 'upload_warp_img_pc'" @click="enlargeClk(item)">
            </template>
            <template v-else>
              <img :id="'img' + key" :class="ISPHONE ? 'upload_warp_img_phone' : 'upload_warp_img_pc'" @click="enlargeClk(item)">
              <video :id="'video' + key" v-show="false" :src="item.src" controls="controls" width="400" height="300">
                不支持视频功能呢
              </video>
            </template>
          </div>
          <div v-if="imgList.length < maxLength" class="upload_warp_left" @click="fileClick()">
            <img src="./img/addimg.png" width="64" height="64" alt="添加">
          </div>
        </div>
      </div>
    </div>

    <div v-if="isDesc" class="upload_warp_text">
      <span>选中{{ imgList.length }}张图片，共{{ bytesToSize(size) }}</span>
    </div>
    <div v-if="isShow" class="mask" @click="isShow=false">
      <div class="mask_content">
        <template v-if="accept == 'image/*'">
          <img :src="maskSrc" alt="">
        </template>
        <template v-else>
          <video :src="maskSrc" controls="controls" width="400" height="300">
            不支持视频功能呢
          </video>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'file-upload',
    components: {},
    props: {
      ident: Number, // 唯一标识
      ownerTable: String, // 数据库名称
      isDesc: {
        type: Boolean,
        default: true
      }, // 是否显示下面的描述大小文字
      maxLength: {
        type: Number,
        default: 6
      }, // 最多显示多少张图片
      prefixUrl: {
        type: String,
        default: ''
      }, // 前缀 url
      imgArray: Array, // 图片数组 子类传递
      dynamicAssignment: Function, // 动态赋值 只有当组件的时候用到
      /* image/*:接受所有的图像文件; video/*: 接受所有的视频文件; audio/*: 	接受所有的声音文件; other:MIME_type 自己百度  */
      accept: { // 附件接受类型 默认为图片
        type: String,
        default: 'image/*'
      }
    },
    data() {
      return {
        imgList: [],
        maskSrc: '',
        isShow: false,
        datas: new FormData(),
        files: 0,
        size: 0,
        ISPHONE: true
      }
    },
    watch: {
      imgArray: {
        handler: function (n, o) {
          if (n.length > 0) {
            n.map((item, key) => {
              /* 按位运算符 等同于  item.src.indexOf('http') < 0  */
              if (item.src && !~item.src.indexOf('http')) {
                item.src = this.prefixUrl + item.src
              } else {
                item.src = this.prefixUrl + item.fileData
              }
              this.size = isNaN(this.size + item.fileSize) ? 0 : this.size + item.fileSize
              this.imgList.push(item)
            })
            console.log(this.accept)
            if (this.accept === 'video/*') {
              console.log('icom in')
              this.$nextTick(() => {
                const scale = 0.5
                this.imgList.forEach((item, key) => {
                  let video = this.$('video' + Number(key))
                  var img = this.$('img' + Number(key))
                  video.addEventListener('loadedmetadata', function loadedmetadata() {
                    var canvas = document.createElement('canvas')
                    canvas.width = video.videoWidth * scale
                    canvas.height = video.videoHeight * scale
                    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
                    img.setAttribute('crossOrigin', 'anonymous');
                    img.src = canvas.toDataURL('image/png')
                    console.log(img)
                  })
                  /* 结局问题:直接获取 videoHeight、videoWidth会得到 0 值  */
                  /* 对视频更改来源或其他设置后要对视频元素进行更新，更改后需要重新加载 video 元素，在 video 元素加载完成后 （oncanplay），此时才能获取到正确的 videoHeight、videoWidth值 */
                })
              })
            }
          } else {
            /*
              careful： 结合element ui form 重置【当组件中存在图片，点击重置不能将图片情况的问题】
              2019-05-14 17:29:07
             */
            this.imgList = []
          }
        },
        immediate: true
      }
    },
    mounted() {
      if (!this.validatPHONE()) {
        this.ISPHONE = false
      }
    },
    methods: {
      $ (id) {
        return document.getElementById(id)
      },
      fileClick() {
        /* eslint-disable */
        this.$('upload_file' + this.ident).click()
      },
      getImage() { // 调用手机摄像头并拍照
        /* eslint-disable */
        let cmr = plus.camera.getCamera()
        cmr.captureImage(function (p) {
          plus.io.resolveLocalFileSystemURL(p, function(entry) {
            compressImage(entry.toLocalURL(), entry.name)
          }, function(e) {
            plus.nativeUI.toast('读取拍照文件错误:' + e.message)
          })
        }, function(e) {
        }, {
          filter: 'image'
        })
      }, // 调用手机摄像头并拍照
      galleryImgs() { // 从相册选择照片
        /* eslint-disable */
        plus.gallery.pick(function(e) {
          var name = e.substr(e.lastIndexOf('/') + 1)
          compressImage(e, name)
        }, function(e) {
        }, {
          filter: 'image'
        })
      }, // 从相册选择照片
      showActionSheet() {
        // 点击事件，弹出选择摄像头和相册的选项
        /* eslint-disable */
        var bts = [{
          title: '拍照'
        }, {
          title: '从相册选择'
        }]
        plus.nativeUI.actionSheet(
          {
            cancel: '取消',
            buttons: bts
          },
          function(e) {
            if (Number(e.index) === 1) {
              this.getImage()
            } else if (Number(e.index) === 2) {
              this.galleryImgs()
            }
          }
        )
      }, // 点击事件，弹出选择摄像头和相册的选项
      fileChange(el) {
        /* eslint-disable */
        this.files = this.$('upload_file' + this.ident).files
        for (let i = 0; i < this.files.length; i++) {
          this.datas.append('file', this.files[i])
        }
        if (!el.target.files[0].size) return
        this.fileList(el.target)
        el.target.value = ''
      }, // file 改变后的方法
      fileList(fileList) {
        var files = fileList.files
        for (let i = 0; i < files.length; i++) {
          /* 判断是否为文件夹 */
          if (files[i].type !== '') {
            this.fileAdd(files[i])
          } else {
            console.log('非图片类型？')
            this.folders(fileList.items[i])
          }
        }
      },
      fileAdd(file) {
        const { ownerTable } = this
        // 总大小
        this.size = Number(this.size) + Number(file.size)
        /* 判断是否为图片文件 注：'image/*' 已经写死了,只会是图片 */
        /* TODO 缺少如下字段
          * fileData
          * fileType: 后缀
          * fileName: 名称
          * fileSize:
          * isImg: 是否是图片
          * src
          * */
        var reader = new FileReader()
        reader.vue = this
        reader.readAsDataURL(file)
        reader.onload = function(e) {
          file.src = this.result
          file.idx = 0
          // var fileExtension = file.name.lastIndexOf('.') > -1 ? file.name.substring(file.name.lastIndexOf('.') + 1) : '未知类型'
          var obj = {}
          obj.fileData = this.result.substring(this.result.indexOf(',') + 1)
          obj.fileName = file.name
          obj.fileSize = file.size
          /* fileType 图片为image 视频为 video  */
          if (this.vue.accept === 'image/*') {
            obj.fileType = 'image'
            obj.isImg = true
          } else if (this.vue.accept === 'video/*') {
            obj.fileType = 'video'
            obj.isImg = false
          }
          if (ownerTable !== undefined) {
            obj.ownerTable = ownerTable
          }
          obj.src = file.src
          obj.file = file
          this.vue.imgList.push(obj) // 移除原来前套曾
        }

        setTimeout(() => {
          if (file.type.indexOf('image') == -1) {
            console.log('非图片')
            const scale = 0.5
            let video = this.$('video' + Number(this.imgList.length - 1))
            if (video !== null) {
              var canvas = document.createElement('canvas')
              canvas.width = video.videoWidth * scale
              canvas.height = video.videoHeight * scale
              canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)

              var img = this.$('img' + Number(this.imgList.length - 1))
              img.src = canvas.toDataURL('image/png')
            }
          }
          this.$emit('callbackFun', this.imgList)
          this.dynamicAssignment && this.dynamicAssignment(this.ident, this.imgList)
        }, 300)

        // this.$nextTick(() => {
        //   this.$emit('callbackFun', this.imgList)
        //   this.dynamicAssignment(this.ident, this.imgList)
        // })

        // if (file.type.indexOf('image') == -1) {
        //   console.log('非图片')
        // } else {
        // }
      },
      folders(files) {
        var this_ = this
        // 判断是否为原生file
        if (files.kind) {
          files = files.webkitGetAsEntry()
        }
        files.createReader().readEntries(function(file) {
          for (let i = 0; i < file.length; i++) {
            if (file[i].isFile) {
              this_.foldersAdd(file[i])
            } else {
              this_.folders(file[i])
            }
          }
        })
      },
      fileDel(index) {
        this.size = this.size - this.imgList[index].fileSize // 总大小
        this.imgList.splice(index, 1)
        this.$emit('callbackFun', this.imgList)
      },
      bytesToSize(bytes) {
        if (bytes === 0) {
          return '0 B'
        }
        var k = 1024 // or 1024
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        var i = Math.floor(Math.log(bytes) / Math.log(k))
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
      },
      dragenter(el) {
        el.stopPropagation()
        el.preventDefault()
      },
      dragover(el) {
        el.stopPropagation()
        el.preventDefault()
      },
      drop(el) {
        el.stopPropagation()
        el.preventDefault()
        this.fileList(el.dataTransfer)
      },
      shows(et, tx) {
        this.strut = et
        this.txt = tx
      },
      handleClick() {
        this.$store.commit('add')
      },
      enlargeClk(obj) {
        this.maskSrc = obj.src
        this.isShow = true
      },
      validatPHONE() {
        const reg = /(iPhone|iPad|iPod|iOS|Android)/i
        return reg.test(navigator.userAgent)
      }
    }
  }
</script>
