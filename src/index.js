import FileUpload from './components/FileUpload/index.vue'

const FileUploadComponent = {
  version: '1.0.5',
  install: function (Vue, opt = {}) {
    if (typeof window !== 'undefined' && window.Vue) {
      Vue = window.Vue
    }
    Vue.component(FileUpload.name, FileUpload)
  },
  FileUpload
}

export default FileUploadComponent
