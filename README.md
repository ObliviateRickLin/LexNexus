# LexNexus - AI Mixed Translation Browser Extension

![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)

[English Version](#english) | [中文版本](#chinese)

## <h2 id="english">English</h2>

**LexNexus** is a Chrome browser extension powered by Large Language Models (LLMs), designed to translate English text into a natural Chinese-English mixed format, with Chinese and English mixed in the translated text.

### ✨ Features

- **Multiple LLM Support**:
  - Currently supports OpenAI GPT-4 and DeepSeek
  - Easily extensible architecture for future LLM integrations
- **Smart Mixed Translation**: Intelligently preserves key English terms while integrating the Chinese context.
- **Elegant UI/UX**:
  - Beautiful popup interface with dynamic animations.
  - Smooth translation animations with word-by-word effects.
  - Context-aware highlighting of preserved English terms.
- **Easy Integration**:
  - Simple right-click menu for instant translation.
  - Results appear directly on the webpage.
  - Floating reference window with original text.
- **Customization**:
  - Flexible choice of LLM providers
  - Personal API key configuration for different providers
  - Secure local storage of settings
  - Customizable translation style based on selected LLM

### 🛠️ Tech Stack

- **Vue.js 3**: For modern reactive UI.
- **LLM Integration**:
  - OpenAI GPT-4o-mini API
  - DeepSeek API
  - Extensible API architecture
- **Chrome Extension APIs**: For seamless browser integration.
- **Vite**: For fast development and building.

### 🚀 Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/ObliviateRickLin/LexNexus.git
   cd lexnexus
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Load in Chrome:
   - Open Chrome Extensions (`chrome://extensions/`).
   - Enable "Developer mode".
   - Click "Load unpacked".
   - Select the `dist` folder.
5. Configure:
   - Click the LexNexus icon.
   - Choose your preferred LLM provider.
   - Enter corresponding API credentials.
   - Start translating!

### 📝 License

GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

This software is protected under GPL v3.0, which means:
- You must disclose source code
- You must state changes
- You must use the same license
- You must include original license and copyright notice


## <h2 id="chinese">中文</h2>

**LexNexus** 是一款由大语言模型（LLM）驱动的 Chrome 浏览器扩展，旨在将英文文本翻译成自然的中英混合格式，用中英夹杂的形式来翻译你选中的文本。

### ✨ 特点

- **多语言模型支持**：
  - 目前支持 OpenAI GPT-4 和 DeepSeek
  - 易扩展的架构设计，支持未来集成更多语言模型
- **智能混合翻译**：在整合中文语境的同时，智能保留关键英文术语
- **优雅的用户界面/用户体验**：
  - 美观的弹出界面，配有动态动画。
  - 平滑的逐词翻译动画。
  - 能够识别保留英文术语的上下文高亮显示。
- **易于整合**：
  - 简单的右键菜单，即时翻译。
  - 结果直接显示在网页上。
  - 带有原文的浮动参考窗口。
- **个性化定制**：
  - 灵活选择语言模型提供商
  - 支持不同提供商的个人 API 密钥配置
  - 安全的本地设置存储
  - 基于所选语言模型的自定义翻译风格

### 🛠️ 技术栈

- **Vue.js 3**：用于现代反应式用户界面。
- **语言模型集成**：
  - OpenAI GPT-4o-mini API
  - DeepSeek API
  - 可扩展的 API 架构
- **Chrome 扩展 API**：实现浏览器的无缝整合。
- **Vite**：快速开发和构建。

### 🚀 快速开始

1. 克隆仓库：
   ```bash
   git clone https://github.com/ObliviateRickLin/LexNexus.git
   cd lexnexus
   ```
2. 安装依赖：
   ```bash
   npm install
   ```
3. 构建扩展：
   ```bash
   npm run build
   ```
4. 在 Chrome 中加载：
   - 打开 Chrome 扩展页面 (`chrome://extensions/`)。
   - 启用"开发者模式"。
   - 点击"加载已解压的扩展程序"。
   - 选择 `dist` 文件夹。
5. 配置使用：
   - 点击 LexNexus 图标。
   - 选择你偏好的语言模型提供商。
   - 输入相应的 API 凭证。
   - 开始翻译！

### 📝 许可证

GNU 通用公共许可证 v3.0 - 详情见 [LICENSE](LICENSE) 文件。

本软件受 GPL v3.0 保护，这意味着：
- 必须开放源代码
- 必须说明修改内容
- 必须使用相同的许可证
- 必须包含原始许可证和版权声明
