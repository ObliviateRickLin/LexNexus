// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'translate-selection',
    title: 'Translate with LexNexus',
    contexts: ['selection']
  })
})

// 调用 API 进行翻译
async function translateText(text) {
  try {
    // 获取存储的设置
    const { openaiApiKey, selectedModel } = await chrome.storage.local.get(['openaiApiKey', 'selectedModel'])
    if (!openaiApiKey) {
      throw new Error('API key not found. Please set your API key in the extension options.')
    }

    // 根据选择的模型使用不同的 API 端点
    const apiEndpoint = selectedModel === 'deepseek' 
      ? 'https://api.deepseek.com/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions'

    // 使用相同的请求格式（因为 DeepSeek API 兼容 OpenAI API）
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: selectedModel === 'deepseek' ? "deepseek-chat" : "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `你是一个专业的有着在中国和美国生活多年经验的跨文化者。你正在帮助你的朋友学习语言。你需要将输入的英文文本翻译成中英混合的形式，遵循以下规则：
            1. 保持专业术语、重要概念、品牌名称等语言不变。
            2. 保持原文当中较为困难，有学习价值的单词或者词组不变，尤其是形容词和动词词组
            3. 将普通词汇、语法结构等翻译成另一种语言，尤其是动词和形容词部分，还有逻辑词组
            4. 确保翻译自然流畅，中英混合要符合阅读习惯
            5. 对于专业领域的词汇，优先保持英文
            6. 保持原文的语气和语调 
            7. 确保中英文之间的过渡自然
            8. 有创意！！！But be native and natural.

            示例：
            输入: "The new machine learning algorithm achieves state-of-the-art performance on various benchmark datasets."
            输出: "这个新的 machine learning algorithm 在各种 benchmark datasets 上达到了 state-of-the-art 的性能表现。"
            
            输入: "The user interface should be intuitive and user-friendly."
            输出: "这个 user interface 应该直观且 user-friendly。"`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.85,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      throw new Error(`${selectedModel === 'deepseek' ? 'DeepSeek' : 'OpenAI'} API request failed`)
    }

    const data = await response.json()
    const translation = data.choices[0].message.content

    return `测试翻译结果 (Test Translation):
原文: "${text}"
翻译: "${translation}"`

  } catch (error) {
    console.error('Translation error:', error)
    return `Translation error: ${error.message}`
  }
}

// 处理右键菜单点击
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'translate-selection') {
    console.log('Menu clicked, selected text:', info.selectionText)
    const translation = await translateText(info.selectionText)
    console.log('Translation result:', translation)
    
    try {
      // 确保内容脚本已注入
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          return window.hasOwnProperty('_lexnexusInitialized')
        }
      }).then(async (results) => {
        if (!results[0].result) {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          })
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      })

      // 发送翻译消息
      await chrome.tabs.sendMessage(tab.id, {
        action: 'showTranslation',
        translation,
        position: {
          x: info.x,
          y: info.y
        }
      })
      console.log('Message sent successfully')
    } catch (error) {
      console.error('Error:', error)
      // 如果发生错误，尝试重新注入内容脚本
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        })
        await chrome.tabs.sendMessage(tab.id, {
          action: 'showTranslation',
          translation,
          position: {
            x: info.x,
            y: info.y
          }
        })
      } catch (retryError) {
        console.error('Retry error:', retryError)
      }
    }
  }
})

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'textSelected') {
    console.log('Text selected message received')
    sendResponse({ received: true })
  }
  return true
}) 