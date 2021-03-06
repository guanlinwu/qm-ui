// export { default as ActionSheet } from './ActionSheet'
// export { default as Dialog } from './Dialog'
// export { default as Loading } from './Loading'
// export { default as Toast } from './Toast'
// export { default as Popup } from './Popup'
// export { default as PreLoad } from './PreLoad'
// export { default as PopCurtain } from './PopCurtain'
// export { default as CarouselNotice } from './CarouselNotice'
// export { default as PullRefresh } from './PullRefresh'
// export { default as Picker } from './Picker'
// export { default as PopupPicker } from './PopupPicker'
// export { default as DatetimePicker } from './DatetimePicker'
// export { default as Tabs } from './Tabs'
// export { default as NavBar } from './NavBar'
// export { default as lazyLoadImg } from './lazyLoadImg'

const files = require.context('@/packages', true, /index\.js$/)
const modules = {}
files.keys().forEach(key => {
  if (/\.\/[\w]+\/index\.js/.test(key)) { // 如果遵守./*/index.js
    const name = key.match(/\.\/([\w]+)\/index\.js/)[1]
    modules[name] = files(key).default || files(key)
  }
})

module.exports = modules
