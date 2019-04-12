import FileUploadComponent from '@/components/FileUpload/'

const FileUpload = {
  version: '1.0.0',
  install: function (Vue, opt = {}) {
    if (typeof window !== 'undefined' && window.Vue) {
      Vue = window.Vue
    }
    Vue.component(FileUploadComponent.name, FileUploadComponent)
  },
  FileUploadComponent
}

export default FileUpload
