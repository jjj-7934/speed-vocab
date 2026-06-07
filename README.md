# 速过单词 🃏

> **键盘翻卡背单词工具** — 每按一次 `Space`，刷新一词，自动朗读。

![preview](https://img.shields.io/badge/react-19-blue)
![preview](https://img.shields.io/badge/TypeScript-5.9-brightgreen)
![preview](https://img.shields.io/badge/license-MIT-green)

---

## ✨ 功能

- **单词卡片** — 展示单词、音标、词性、中文释义
- **自动朗读** — 基于 Web Speech API，优先使用神经网络自然语音
- **键盘翻卡** — `Space` / `→` / `↓` 一键切换下一词
- **三级分类** — 基础(初中) / 四级 / 六级，共 10,000+ 唯一单词
- **音标懒加载** — 首次展示时自动从 Dictionary API 获取音标并缓存
- **学习统计** — 实时显示累计翻卡数、已学进度、词库总词数
- **响应式设计** — 桌面和移动端均可流畅使用

## ⌨️ 快捷键

| 按键 | 功能 |
|------|------|
| `Space` / `→` / `↓` | 下一张单词卡 |
| `1` | 基础词库 |
| `2` | 四级词库 |
| `3` | 六级词库 |
| 点击朗读按钮 | 手动朗读当前单词 |

## 🚀 快速开始

```bash
# 克隆仓库
git clone https://github.com/jjj-7934/speed-vocab.git
cd speed-vocab

# 安装依赖
npm install

# 本地开发
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| [React 19](https://react.dev/) | UI 框架 |
| [TypeScript](https://www.typescriptlang.org/) | 类型安全 |
| [Vite](https://vite.dev/) | 构建工具 |
| [Tailwind CSS](https://tailwindcss.com/) | 样式框架 |
| [shadcn/ui](https://ui.shadcn.com/) | UI 组件库 |
| [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) | 语音朗读 |
| [Free Dictionary API](https://api.dictionaryapi.dev/) | 音标数据 |

## 📦 数据来源

词汇数据来自 [KyleBing/english-vocabulary](https://github.com/KyleBing/english-vocabulary) 开源词库，经过去重清洗后使用。

| 分类 | 单词数 | 来源 |
|------|:-----:|------|
| 🟢 基础 | 1,987 | 初中词汇 |
| 🔵 四级 | 4,544 | CET4 考纲 |
| 🟣 六级 | 3,991 | CET6 考纲 |

## 📄 许可证

[MIT](LICENSE)
