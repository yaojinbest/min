# 🧙 魔法英语 · Magic English MVP

> 6-12 岁儿童英语学习 PWA · 基于 [magic-english-buddy](https://github.com/xckevin/magic-english-buddy) 思路

## ✨ 核心功能(MVP)

- 📖 **TTS 朗读**:英语单词级高亮同步
- 🎙️ **跟读练习**:录音 + 回放对比
- 🔍 **查词弹窗**:50 词 L1 基础词典,点击任意单词查
- 📝 **2 种 Quiz**:图选(听音选图)+ 拼词(字母拼单词)
- 🗺️ **关卡解锁**:完成一关自动解锁下一关
- ⭐ **星数系统**:答对题目积累星星
- 🎉 **撒花 + 音效**:答对播 C 大调和弦,全对撒花

## 🛠️ 技术栈

- React 18 + TypeScript + Vite 5
- Zustand(状态 + localStorage 持久化)
- TailwindCSS(儿童向色彩)
- Web Speech API(TTS)
- MediaRecorder API(录音)
- canvas-confetti(撒花)
- Web Audio API(合成音效,零依赖)

## 🚀 快速开始

```bash
npm install
npm run dev      # 开发
npm run build    # 生产构建
npm run preview  # 预览生产
npm run deploy   # 部署到 GitHub Pages
```

## 📂 项目结构

```
src/
├── components/
│   ├── WordHighlight.tsx    # 单词高亮
│   ├── DictionaryPopup.tsx  # 查词弹窗
│   ├── Recorder.tsx         # 录音跟读
│   ├── Confetti.tsx         # 撒花
│   └── quiz/
│       ├── ImageChoice.tsx  # 图选题
│       └── WordBuilder.tsx  # 拼词题
├── data/
│   ├── dictionary.ts        # 50 词 L1 词典
│   └── stories.ts           # 3 个魔法故事
├── pages/
│   ├── Onboarding.tsx       # 创号
│   ├── Home.tsx             # 关卡列表
│   ├── Reader.tsx           # 阅读+跟读
│   ├── Quiz.tsx             # 答题
│   └── Settings.tsx         # 设置
├── services/
│   ├── tts.ts               # TTS 封装
│   └── recorder.ts          # 录音封装
├── store/
│   └── useAppStore.ts       # Zustand 状态
├── utils/
│   └── audio.ts             # 合成音效
├── App.tsx
└── main.tsx
```

## 📚 3 个 L1 故事

1. 🥚 **The Magic Egg** (魔法蛋)
2. 🐲 **The Little Dragon** (小雏龙)
3. ⭐ **A Bright Star** (闪亮的星星)

每个故事 3 段英文 + 4 题(2 图选 + 2 拼词)

## 🔄 学习流程

```
Onboarding → Home → Reader(TTS+跟读+查词) → Quiz(图选+拼词) → Done(撒花+解锁下一关)
```

## 📝 License

MIT
