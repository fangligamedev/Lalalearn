<div align="center">
<!-- You can add a logo here if available -->
<h1>Lalalearn - 游戏化学习平台</h1>
</div>

**Lalalearn** 是一个由 AI 驱动的游戏化互动学习平台。在这里，学习不再是枯燥的填鸭，而是一场充满趣味的冒险。

核心特色：**LLM Vibe 教授** (The Vibe Professor) —— 一位能够感知你的情绪、适应你的节奏、并根据你的喜好变换风格的 AI 导师。

---

## 🌟 核心功能

### 1. 🎓 LLM Vibe 教授 (The Vibe Professor)
不同于冷冰冰的自动回复，Vibe 教授拥有 "Vibe" (氛围感)。
- **动态人格**: 你想要温柔的保姆式教学，还是严厉的教授，亦或是幽默毒舌的伙伴？Vibe 教授都能实时切换。
- **上下文感知**: 它不仅知道你在问什么，还知道你当前的关卡、你的代码历史以及你现在的挫败感。
- **情绪共鸣**: 通过提示词工程 (Prompt Engineering)，教授能根据你的学习进度提供情绪价值。

### 2. 📚 可配置的学习资料 (Configurable Curriculum)
平台设计了高度灵活的内容架构，允许教育者或开发者轻松定制学习路径。
- **题库配置**: 所有的关卡、任务、提示词都集中管理（目前在 `constants.ts`），可以轻松扩展为从 JSON/YAML 或远程 API 加载。
- **多语言支持**: 内置中英文支持，可扩展更多语言。
- **关卡设计**: 支持定义多种题型（填空、纠错、从零编写）。

### 3. 🎮 沉浸式游戏体验
- **实时判题**: 就像游戏中的战斗结算，代码运行结果即时反馈。
- **进度地图**: 游戏化的闯关地图，可视化的成长路径。
- **勋章与XP**: 完整的激励系统。

---

## 🛠️ 技术架构

- **前端**: React 18 + TypeScript + Vite
- **样式**: Tailwind CSS
- **AI 核心**: Google Gemini (通过 Zeabur AI Hub 接入)
- **部署**: Static Site (静态站点托管)

```text
/
├── components/          # UI 组件 (地图, 编辑器, 聊天框)
├── services/            # 业务逻辑
│   └── geminiService.ts # Vibe 教授的大脑 (Prompt Engineering)
├── constants.ts         # [配置中心] 题库、人格设定、游戏参数
└── types.ts             # 类型定义
```

---

## 🚀 快速开始

### 本地运行

1. 克隆项目
2. 安装依赖:
   ```bash
   npm install
   ```
3. 配置环境变量:
   在根目录创建 `.env.local`，填入你的 Gemini API Key (或 Zeabur AI Hub Key):
   ```
   GEMINI_API_KEY=sk-xxxxxxxxxxxxxxxx
   ```
4. 启动:
   ```bash
   npm run dev
   ```

---

## ☁️ 部署指南 (Zeabur)

本项目完美适配 **Zeabur** 的静态站点托管。

1. **Push 代码**: 将代码推送到 GitHub。
2. **创建服务**: 在 Zeabur 中选择 "Git Service"，连接你的仓库。
3. **配置变量**:
   在 Zeabur 服务的 Settings -> Environment Variables 中添加：
   - `GEMINI_API_KEY`: 你的 API 密钥
4. **自动部署**: 保存后 Zeabur 会自动构建并发布。

---

## 🤖 提示词工程揭秘

我们如何打造 "Vibe 教授"？

关键在于 **System Context Injection**。每次对话，我们不仅发送你的问题，还会悄悄告诉 AI：
> "你现在是[毒舌风格]的导师。学生正在第3关，任务是[变量定义]。他刚刚写了代码 `pirnt('hello')`，报错了。请用幽默的方式指出他的拼写错误。"

这使得 Vibe 教授能提供令人惊叹的精准指导。
