// 检查是否已经初始化
if (!window.hasOwnProperty('_lexnexusInitialized')) {
  // 设置初始化标志
  window._lexnexusInitialized = true;

  // 创建翻译结果显示容器
  const createTranslationPopup = () => {
    const popup = document.createElement('div')
    popup.id = 'lexnexus-translation-popup'
    popup.style.cssText = `
      position: fixed;
      padding: 16px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      z-index: 10000;
      display: none;
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.5;
    `
    document.body.appendChild(popup)
    return popup
  }

  let popup = null

  // 初始化函数
  const initialize = () => {
    try {
      // 移除可能存在的旧弹窗
      const existingPopup = document.getElementById('lexnexus-translation-popup')
      if (existingPopup) {
        existingPopup.remove()
      }
      
      popup = createTranslationPopup()
      
      // 添加点击事件监听器
      const handleClick = (e) => {
        if (popup && !popup.contains(e.target)) {
          popup.style.display = 'none'
        }
      }
      document.addEventListener('click', handleClick)
      
      // 添加消息监听器
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'showTranslation') {
          try {
            const { translation, position } = request
            
            // 获取当前选中的文本范围
            const selection = window.getSelection()
            const range = selection.getRangeAt(0)
            const originalText = range.toString()

            // 创建临时容器
            const container = document.createElement('div')
            container.className = 'text-stream'
            container.style.cssText = `
              display: inline-flex;
              flex-wrap: wrap;
              gap: 4px;
              align-items: center;
            `

            // 添加样式
            const style = document.createElement('style')
            style.textContent = `
              .text-stream span {
                opacity: 0;
                animation: wordFadeIn 0.5s ease-out forwards;
              }

              .text-stream .highlight {
                color: #2563eb;
                font-weight: 500;
                background: linear-gradient(120deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%);
                padding: 2px 6px;
                border-radius: 4px;
                position: relative;
                overflow: hidden;
              }

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
            `
            document.head.appendChild(style)

            // 清除选中的文本
            range.deleteContents()

            // 获取翻译文本
            const translatedText = translation.split('翻译: "')[1].split('"')[0]
            
            // 将翻译文本拆分成单词和标点
            const words = translatedText.split(/(\s+|[,.!?;:])/g).filter(word => word.trim())
            
            // 为每个单词创建 span 元素
            words.forEach((word, index) => {
              const span = document.createElement('span')
              // 判断是否为英文单词
              const isEnglish = /[a-zA-Z]/.test(word)
              if (isEnglish) {
                span.className = 'highlight'
              }
              span.textContent = word
              span.style.animationDelay = `${index * 0.1}s`
              container.appendChild(span)
            })

            // 插入新的文本节点
            range.insertNode(container)
            
            // 清除选择
            selection.removeAllRanges()
            
            // 显示弹窗提示
            popup.innerHTML = `
              <div style="margin-bottom: 8px; color: #6b7280; font-size: 12px;">原文:</div>
              <div style="margin-bottom: 12px;">${originalText}</div>
              <div style="margin-bottom: 8px; color: #6b7280; font-size: 12px;">翻译:</div>
              <div style="color: #2563eb;">${translatedText}</div>
            `
            
            // 设置弹窗位置
            const popupX = position.x
            const popupY = position.y + 10
            
            const viewportWidth = window.innerWidth
            const viewportHeight = window.innerHeight
            const popupWidth = popup.offsetWidth
            const popupHeight = popup.offsetHeight
            
            let finalX = popupX
            let finalY = popupY
            
            if (finalX + popupWidth > viewportWidth) {
              finalX = viewportWidth - popupWidth - 10
            }
            
            if (finalY + popupHeight > viewportHeight) {
              finalY = position.y - popupHeight - 10
            }
            
            popup.style.left = `${finalX}px`
            popup.style.top = `${finalY}px`
            popup.style.display = 'block'
            
            // 添加动画
            popup.style.opacity = '0'
            popup.style.transform = 'translateY(-10px)'
            
            requestAnimationFrame(() => {
              popup.style.transition = 'opacity 0.3s, transform 0.3s'
              popup.style.opacity = '1'
              popup.style.transform = 'translateY(0)'
            })
            
            sendResponse({ success: true })
          } catch (error) {
            console.error('Translation error:', error)
            sendResponse({ success: false, error: error.message })
          }
          return true
        }
      })
    } catch (error) {
      console.error('Initialization error:', error)
    }
  }

  // 初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize)
  } else {
    initialize()
  }
}