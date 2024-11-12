<template>
  <div class="popup-container fade-in">
    <header class="popup-header">
      <div class="logo-container">
        <span class="logo">L</span>
        <h1>LexNexus</h1>
      </div>
    </header>
    
    <main class="popup-content">
      <transition name="fade">
        <div class="api-key-section" v-if="!hasApiKey">
          <h2>Welcome to LexNexus</h2>
          <p class="description">Enter your OpenAI API key to start experiencing seamless bilingual translation.</p>
          
          <div class="input-group">
            <label>Model Selection</label>
            <div class="model-selector">
              <div 
                v-for="model in models" 
                :key="model.id"
                class="model-option"
                :class="{ active: selectedModel === model.id }"
                @click="selectedModel = model.id"
              >
                <div class="model-info">
                  <span class="model-name">{{ model.name }}</span>
                  <span class="model-description">{{ model.description }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="input-group">
            <label for="apiKey">API Key</label>
            <div class="input-wrapper">
              <input 
                id="apiKey"
                type="password" 
                v-model="apiKey" 
                placeholder="sk-..." 
                @focus="inputFocused = true"
                @blur="inputFocused = false"
              >
              <div class="input-hint" v-if="apiKey">
                <span class="hint-icon">?</span>
                <span class="hint-text">Your API key is securely stored locally</span>
              </div>
            </div>
          </div>

          <button 
            class="primary-button"
            :class="{ 'button-loading': isLoading }"
            @click="saveApiKey"
            :disabled="!apiKey || isLoading"
          >
            <span class="button-content">
              <span v-if="!isLoading">Save API Key</span>
              <span v-else class="loading-spinner"></span>
            </span>
          </button>
        </div>

        <div class="main-section slide-in" v-else>
          <div class="status-card">
            <div class="translation-demo">
              <transition name="quote" mode="out-in">
                <div class="text-stream" :key="currentQuote?.parts[0].text">
                  <template v-if="currentQuote" v-for="(part, index) in currentQuote.parts" :key="index">
                    <span 
                      :class="{ highlight: part.highlight }"
                      :style="{ animationDelay: `${index * 0.1}s` }"
                    >{{ part.text }}</span>
                  </template>
                </div>
              </transition>
            </div>
            <p>Ready to translate! Select any text and right-click to start.</p>
          </div>
          
          <button class="secondary-button" @click="clearApiKey">
            Reset API Key
          </button>
        </div>
      </transition>
    </main>

    <footer class="popup-footer">
      <span class="version">v1.0.0</span>
      <a href="#" class="help-link" @click.prevent="showHelp">Need help?</a>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const apiKey = ref('')
const hasApiKey = ref(false)
const isLoading = ref(false)
const inputFocused = ref(false)

const models = [
  {
    id: 'gpt4',
    name: 'OpenAI',
    description: 'GPT-4o-mini'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'v2.5'
  }
]

const selectedModel = ref('gpt4')

// 先定义 quotes 数组
const quotes = [
  {
    parts: [
      { text: "没想到有一天也要用最讨厌的" },
      { text: "Chinglish", highlight: true },
      { text: "来开发" },
      { text: "AI product", highlight: true },
      { text: "了" }
    ]
  },
  {
    parts: [
      { text: "黑猫白猫，" },
      { text: "catch the mouse", highlight: true },
      { text: "就是好猫" }
    ]
  },
  {
    parts: [
      { text: "这波" },
      { text: "mixed language", highlight: true },
      { text: "玩得有点" },
      { text: "smart", highlight: true }
    ]
  },
  {
    parts: [
      { text: "中英混合，" },
      { text: "efficiency", highlight: true },
      { text: "加倍" }
    ]
  },
  {
    parts: [
      { text: "谁说程序员不能" },
      { text: "bilingual", highlight: true },
      { text: "？" }
    ]
  }
]

// 然后再使用 quotes
const currentQuote = ref(quotes[0])

// 随机切换短句
const switchQuote = () => {
  const currentIndex = quotes.indexOf(currentQuote.value)
  let nextIndex
  do {
    nextIndex = Math.floor(Math.random() * quotes.length)
  } while (nextIndex === currentIndex && quotes.length > 1)
  
  currentQuote.value = null // 触发消失动画
  setTimeout(() => {
    currentQuote.value = quotes[nextIndex] // 设置新的短句
  }, 300)
}

// 定时切换短句
onMounted(() => {
  setInterval(switchQuote, 5000) // 每5秒切换一次
})

onMounted(async () => {
  try {
    const result = await chrome.storage.local.get(['openaiApiKey', 'selectedModel'])
    hasApiKey.value = !!result.openaiApiKey
    selectedModel.value = result.selectedModel || 'gpt4'
  } catch (error) {
    console.error('Error loading settings:', error)
  }
})

const saveApiKey = async () => {
  if (apiKey.value) {
    try {
      isLoading.value = true
      await chrome.storage.local.set({ 
        openaiApiKey: apiKey.value,
        selectedModel: selectedModel.value
      })
      hasApiKey.value = true
      apiKey.value = ''
      showToast('Settings saved successfully!')
    } catch (error) {
      showToast('Failed to save settings', 'error')
    } finally {
      isLoading.value = false
    }
  }
}

const clearApiKey = async () => {
  try {
    isLoading.value = true
    await chrome.storage.local.remove(['openaiApiKey'])
    hasApiKey.value = false
    showToast('API key removed')
  } catch (error) {
    showToast('Failed to remove API key', 'error')
  } finally {
    isLoading.value = false
  }
}

const showHelp = () => {
  window.open('https://help.lexnexus.com', '_blank')
}

const showToast = (message, type = 'success') => {
  // 简单的提示实现
  console.log(message)
}
</script>

<style>
.popup-container {
  width: 360px;
  min-height: 400px;
  padding: 20px;
  background: linear-gradient(to bottom right, #ffffff, #f8fafc);
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.logo {
  width: 40px;
  height: 40px;
  background: #2563eb;
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  transform: rotate(-5deg);
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: rotate(0deg) scale(1.05);
}

.popup-header h1 {
  font-size: 24px;
  color: #1f2937;
  font-weight: 700;
  background: linear-gradient(120deg, #2563eb, #1d4ed8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.description {
  color: #4b5563;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 24px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: #f9fafb;
  padding-right: 140px;
}

input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  background: white;
}

.primary-button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(to right, #2563eb, #1d4ed8);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.1);
}

.primary-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.2);
}

.primary-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: #94a3b8;
}

.secondary-button {
  width: 100%;
  padding: 10px;
  background-color: #f3f4f6;
  color: #1f2937;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.secondary-button:hover {
  background-color: #e5e7eb;
}

.status-card {
  background: linear-gradient(to right, #f0f9ff, #e0f2fe);
  padding: 24px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
  border: 1px solid #bae6fd;
  position: relative;
  overflow: hidden;
}

.status-card p {
  margin: 0;
  color: #0369a1;
  font-size: 14px;
  line-height: 1.5;
  z-index: 1;
}

.translation-demo {
  width: 100%;
  position: relative;
  font-size: 15px;
  line-height: 1.8;
  margin-bottom: 16px;
}

.text-stream {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.text-stream span {
  opacity: 0;
  animation: wordFadeIn 0.5s ease-out forwards;
}

.highlight {
  color: #2563eb;
  font-weight: 500;
  background: linear-gradient(120deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%);
  padding: 2px 6px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.highlight::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transform: translateX(-100%);
  animation: shimmer 2s infinite;
}

/* 切换动画 */
.quote-enter-active,
.quote-leave-active {
  transition: all 0.3s ease-in-out;
}

.quote-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.quote-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 单词入场动画 */
@keyframes wordFadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  60% {
    transform: translateY(-2px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 高亮词闪光效果 */
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

/* 状态卡片背景动画 */
.status-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent 0%,
    rgba(37, 99, 235, 0.02) 50%,
    transparent 100%
  );
  background-size: 200% 200%;
  animation: gradientMove 8s ease infinite;
}

@keyframes gradientMove {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}

.popup-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  margin-top: auto;
}

.version {
  font-size: 12px;
  color: #6b7280;
}

.help-link {
  font-size: 12px;
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.help-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

.button-loading {
  pointer-events: none;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.input-hint {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 12px;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
}

.hint-icon {
  display: none;
}

.hint-text {
  color: #6b7280;
}

.model-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.model-option {
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.model-option:hover {
  border-color: #93c5fd;
  background: #f8fafc;
}

.model-option.active {
  border-color: #2563eb;
  background: #eff6ff;
}

.model-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.model-name {
  font-weight: 500;
  color: #1f2937;
}

.model-description {
  font-size: 12px;
  color: #6b7280;
}
</style> 