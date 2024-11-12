import { createApp } from 'vue'
import Popup from './Popup.vue'

// 导入样式
import '../styles/global.css'

const app = createApp(Popup)
app.mount('#app')

// 用于调试
console.log('Vue app mounted') 