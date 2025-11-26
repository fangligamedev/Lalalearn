# Lalalearn MVP Demo - Zeabur 员工培训
## 最小化开发子集 (4-6 小时)

> **目标**: 今天完成一个可用的 Demo，让蛋黄（市场部）能通过游戏化闯关学习 Zeabur 技术文档  
> **日期**: 2025-11-26  
> **预估时间**: 4-6 小时

---

## 🎯 Demo 目标

```
用户: 蛋黄 (Zeabur 市场部)
目标: 快速掌握 Zeabur 核心概念，能向客户介绍产品
方式: 10 个游戏化关卡，答题闯关
```

---

## ✅ MVP 包含功能

| 功能 | 说明 | 优先级 |
|-----|------|-------|
| 📚 Zeabur 课程数据 | 10 个关卡，手动编写 JSON | P0 |
| ❓ 概念题型 | 单选题、判断题、填空题 | P0 |
| 🎮 闯关流程 | 选关 → 答题 → 结算 | P0 |
| ⭐ 评分系统 | 正确率 → 1-3 星 | P0 |
| 💬 Vibe 教授 | 复用现有 AI 辅导 | P1 |
| 🏆 完成弹窗 | 显示得分和星星 | P1 |

---

## ❌ MVP 不包含 (后续迭代)

| 功能 | 原因 |
|-----|------|
| AI 生成课程 | 手动写 JSON 更快 |
| 网页爬虫 | 手动整理 Zeabur 文档 |
| 艾宾浩斯复习 | Demo 不需要 |
| 多 LLM 支持 | 现有 Gemini 够用 |
| 数据埋点 | Demo 阶段不需要 |
| 语音功能 | 锦上添花 |
| 课程中心 | 只有一个课程 |
| 配置化系统 | 先硬编码 |

---

## 📁 文件改动清单

```
/Lalalearn
├── types.ts                    [修改] 添加概念题类型
├── constants.ts                [修改] 添加 Zeabur 题库
├── components/
│   ├── LevelMap.tsx           [修改] 支持课程切换
│   └── questions/             [新增] 题型组件
│       ├── QuestionRenderer.tsx
│       ├── SingleChoice.tsx
│       ├── TrueFalse.tsx
│       └── FillBlank.tsx
└── App.tsx                    [修改] 集成新题型
```

**改动量统计**:
- 新增: 4 个文件 (~400 行)
- 修改: 4 个文件 (~200 行)
- 总计: ~600 行代码

---

## 🚀 开发步骤 (按顺序执行)

### Step 1: 类型定义 (15 分钟)
**文件**: `types.ts`

```typescript
// 在现有类型后添加

/** 概念题类型 */
export type ConceptQuestionType = 'single_choice' | 'true_false' | 'fill_blank';

/** 单选题 */
export interface SingleChoiceQuestion {
  type: 'single_choice';
  question: string;
  options: { key: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
}

/** 判断题 */
export interface TrueFalseQuestion {
  type: 'true_false';
  statement: string;
  correctAnswer: boolean;
  explanation: string;
}

/** 填空题 */
export interface FillBlankQuestion {
  type: 'fill_blank';
  question: string;  // 包含 ____ 占位符
  correctAnswers: string[];  // 可接受的答案
  caseSensitive?: boolean;
  explanation: string;
}

/** 概念题联合类型 */
export type ConceptQuestion = SingleChoiceQuestion | TrueFalseQuestion | FillBlankQuestion;

/** 通用关卡 (扩展现有 LevelData) */
export interface UniversalLevel {
  id: number;
  title: string;
  description: string;
  type: 'code' | 'concept';
  questions: ConceptQuestion[];
}

/** 课程定义 */
export interface Course {
  id: string;
  name: string;
  icon: string;
  type: 'code' | 'concept';
  levels: UniversalLevel[] | LevelData[];
}
```

**验收**: TypeScript 编译通过

---

### Step 2: Zeabur 课程数据 (45 分钟)
**文件**: `constants.ts`

在文件末尾添加 Zeabur 课程数据：

```typescript
// ============================================================
// Zeabur 培训课程
// ============================================================

export const ZEABUR_COURSE: Course = {
  id: 'zeabur-training',
  name: 'Zeabur 云平台速成',
  icon: '☁️',
  type: 'concept',
  levels: [
    // Level 1: 什么是 Zeabur
    {
      id: 1,
      title: '什么是 Zeabur',
      description: '了解 Zeabur 的基本定位',
      type: 'concept',
      questions: [
        {
          type: 'single_choice',
          question: 'Zeabur 是什么类型的平台？',
          options: [
            { key: 'A', text: '社交媒体平台' },
            { key: 'B', text: '应用部署与托管平台' },
            { key: 'C', text: '电商购物平台' },
            { key: 'D', text: '视频流媒体平台' }
          ],
          correctAnswer: 'B',
          explanation: 'Zeabur 是一个应用部署与托管平台，帮助开发者快速部署各种应用。'
        }
      ]
    },
    // Level 2: 核心优势
    {
      id: 2,
      title: 'Zeabur 的核心优势',
      description: '了解 Zeabur 的独特卖点',
      type: 'concept',
      questions: [
        {
          type: 'true_false',
          statement: 'Zeabur 需要用户手动配置 CI/CD 流水线才能部署应用。',
          correctAnswer: false,
          explanation: 'Zeabur 最大的优势就是开箱即用的 CI/CD，无需手动配置即可自动构建部署。'
        }
      ]
    },
    // Level 3: 计费模式
    {
      id: 3,
      title: '按量计费',
      description: '理解 Zeabur 的计费方式',
      type: 'concept',
      questions: [
        {
          type: 'single_choice',
          question: 'Zeabur 的默认计费模式是？',
          options: [
            { key: 'A', text: '固定月费，无论使用多少' },
            { key: 'B', text: '按实际资源使用量计费' },
            { key: 'C', text: '完全免费' },
            { key: 'D', text: '按年付费' }
          ],
          correctAnswer: 'B',
          explanation: 'Zeabur 采用按量计费模式，用多少付多少，对初创项目非常友好。'
        }
      ]
    },
    // Level 4: 支持的语言
    {
      id: 4,
      title: '支持的编程语言',
      description: '了解 Zeabur 支持哪些技术栈',
      type: 'concept',
      questions: [
        {
          type: 'true_false',
          statement: 'Zeabur 只支持 Node.js 项目，不支持 Python 或 Go。',
          correctAnswer: false,
          explanation: 'Zeabur 支持多种编程语言，包括 Node.js、Python、Go、Java、Ruby、Rust 等。'
        }
      ]
    },
    // Level 5: Git Service
    {
      id: 5,
      title: 'Git Service 部署',
      description: '学习从代码仓库部署',
      type: 'concept',
      questions: [
        {
          type: 'fill_blank',
          question: '在 Zeabur 中，通过 ____ Service 可以直接从 GitHub 仓库部署应用。',
          correctAnswers: ['Git', 'git', 'GIT'],
          explanation: 'Git Service 是最常用的部署方式，连接 GitHub 后自动检测并部署项目。'
        }
      ]
    },
    // Level 6: 环境变量
    {
      id: 6,
      title: '环境变量配置',
      description: '学习如何配置应用参数',
      type: 'concept',
      questions: [
        {
          type: 'single_choice',
          question: '在 Zeabur 中配置 API 密钥等敏感信息，应该使用？',
          options: [
            { key: 'A', text: '直接写在代码里' },
            { key: 'B', text: '环境变量 (Environment Variables)' },
            { key: 'C', text: '配置文件上传' },
            { key: 'D', text: '发邮件给客服' }
          ],
          correctAnswer: 'B',
          explanation: '环境变量是配置敏感信息的标准方式，Zeabur 在 Settings 中提供了便捷的环境变量管理。'
        }
      ]
    },
    // Level 7: Prebuilt 服务
    {
      id: 7,
      title: '预构建服务',
      description: '了解 Prebuilt 服务',
      type: 'concept',
      questions: [
        {
          type: 'single_choice',
          question: '如果需要在 Zeabur 上使用 PostgreSQL 数据库，应该选择？',
          options: [
            { key: 'A', text: '自己写数据库代码' },
            { key: 'B', text: 'Prebuilt 服务中的 PostgreSQL' },
            { key: 'C', text: '只能用 MySQL' },
            { key: 'D', text: 'Zeabur 不支持数据库' }
          ],
          correctAnswer: 'B',
          explanation: 'Zeabur 的 Prebuilt 服务提供了常用的数据库和中间件，一键添加即可使用。'
        }
      ]
    },
    // Level 8: 域名绑定
    {
      id: 8,
      title: '域名配置',
      description: '学习如何绑定自定义域名',
      type: 'concept',
      questions: [
        {
          type: 'true_false',
          statement: 'Zeabur 部署的服务只能通过 Zeabur 提供的二级域名访问，不支持自定义域名。',
          correctAnswer: false,
          explanation: 'Zeabur 支持绑定自定义域名，在 Networking 中配置即可。'
        }
      ]
    },
    // Level 9: 一键部署
    {
      id: 9,
      title: '一键部署按钮',
      description: '了解 Deploy Button 功能',
      type: 'concept',
      questions: [
        {
          type: 'fill_blank',
          question: '开源项目可以在 README 中添加 "Deploy to ____" 按钮，让用户一键部署。',
          correctAnswers: ['Zeabur', 'zeabur', 'ZEABUR'],
          explanation: 'Deploy to Zeabur 按钮是吸引用户使用开源项目的好方法，一键即可部署完整应用。'
        }
      ]
    },
    // Level 10: 综合测验
    {
      id: 10,
      title: '综合测验',
      description: '检验你对 Zeabur 的理解',
      type: 'concept',
      questions: [
        {
          type: 'single_choice',
          question: '向客户介绍 Zeabur 时，以下哪个说法最准确？',
          options: [
            { key: 'A', text: 'Zeabur 是一个需要复杂配置的服务器托管平台' },
            { key: 'B', text: 'Zeabur 是一个开箱即用、按量计费的应用部署平台，支持多种语言' },
            { key: 'C', text: 'Zeabur 只适合大型企业使用' },
            { key: 'D', text: 'Zeabur 是一个本地开发工具' }
          ],
          correctAnswer: 'B',
          explanation: '恭喜！你已经掌握了 Zeabur 的核心卖点：开箱即用、按量计费、多语言支持。'
        }
      ]
    }
  ]
};

// 课程列表
export const COURSES: Course[] = [
  {
    id: 'python-kids',
    name: 'Python 少儿编程',
    icon: '🐍',
    type: 'code',
    levels: [] // 现有题库
  },
  ZEABUR_COURSE
];
```

**验收**: 10 个关卡数据完整

---

### Step 3: 题型组件 (90 分钟)

#### 3.1 QuestionRenderer.tsx (20 分钟)
**文件**: `components/questions/QuestionRenderer.tsx`

```typescript
import React from 'react';
import { ConceptQuestion } from '../../types';
import SingleChoice from './SingleChoice';
import TrueFalse from './TrueFalse';
import FillBlank from './FillBlank';

interface QuestionRendererProps {
  question: ConceptQuestion;
  onAnswer: (answer: string | boolean) => void;
  showResult: boolean;
  userAnswer?: string | boolean;
  isCorrect?: boolean;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
  showResult,
  userAnswer,
  isCorrect
}) => {
  switch (question.type) {
    case 'single_choice':
      return (
        <SingleChoice
          question={question}
          onAnswer={onAnswer}
          showResult={showResult}
          userAnswer={userAnswer as string}
          isCorrect={isCorrect}
        />
      );
    case 'true_false':
      return (
        <TrueFalse
          question={question}
          onAnswer={onAnswer}
          showResult={showResult}
          userAnswer={userAnswer as boolean}
          isCorrect={isCorrect}
        />
      );
    case 'fill_blank':
      return (
        <FillBlank
          question={question}
          onAnswer={onAnswer}
          showResult={showResult}
          userAnswer={userAnswer as string}
          isCorrect={isCorrect}
        />
      );
    default:
      return <div>未知题型</div>;
  }
};

export default QuestionRenderer;
```

#### 3.2 SingleChoice.tsx (25 分钟)
**文件**: `components/questions/SingleChoice.tsx`

```typescript
import React from 'react';
import { SingleChoiceQuestion } from '../../types';

interface SingleChoiceProps {
  question: SingleChoiceQuestion;
  onAnswer: (answer: string) => void;
  showResult: boolean;
  userAnswer?: string;
  isCorrect?: boolean;
}

const SingleChoice: React.FC<SingleChoiceProps> = ({
  question,
  onAnswer,
  showResult,
  userAnswer,
  isCorrect
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-6">
        {question.question}
      </h2>
      
      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = userAnswer === option.key;
          const isCorrectOption = option.key === question.correctAnswer;
          
          let bgColor = 'bg-slate-700 hover:bg-slate-600';
          if (showResult) {
            if (isCorrectOption) {
              bgColor = 'bg-green-600';
            } else if (isSelected && !isCorrect) {
              bgColor = 'bg-red-600';
            }
          } else if (isSelected) {
            bgColor = 'bg-blue-600';
          }
          
          return (
            <button
              key={option.key}
              onClick={() => !showResult && onAnswer(option.key)}
              disabled={showResult}
              className={`w-full p-4 rounded-xl text-left transition-all ${bgColor} ${
                showResult ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <span className="font-bold mr-3">{option.key}.</span>
              {option.text}
              {showResult && isCorrectOption && (
                <span className="ml-2">✓</span>
              )}
            </button>
          );
        })}
      </div>
      
      {showResult && (
        <div className={`p-4 rounded-xl mt-4 ${isCorrect ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
          <p className="font-bold mb-2">{isCorrect ? '🎉 正确!' : '❌ 错误'}</p>
          <p className="text-slate-300">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default SingleChoice;
```

#### 3.3 TrueFalse.tsx (20 分钟)
**文件**: `components/questions/TrueFalse.tsx`

```typescript
import React from 'react';
import { TrueFalseQuestion } from '../../types';

interface TrueFalseProps {
  question: TrueFalseQuestion;
  onAnswer: (answer: boolean) => void;
  showResult: boolean;
  userAnswer?: boolean;
  isCorrect?: boolean;
}

const TrueFalse: React.FC<TrueFalseProps> = ({
  question,
  onAnswer,
  showResult,
  userAnswer,
  isCorrect
}) => {
  const options = [
    { value: true, label: '✓ 正确', emoji: '👍' },
    { value: false, label: '✗ 错误', emoji: '👎' }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-6">
        判断以下说法是否正确：
      </h2>
      
      <div className="p-6 bg-slate-700 rounded-xl mb-6">
        <p className="text-lg">{question.statement}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => {
          const isSelected = userAnswer === option.value;
          const isCorrectOption = option.value === question.correctAnswer;
          
          let bgColor = 'bg-slate-700 hover:bg-slate-600';
          if (showResult) {
            if (isCorrectOption) {
              bgColor = 'bg-green-600';
            } else if (isSelected && !isCorrect) {
              bgColor = 'bg-red-600';
            }
          } else if (isSelected) {
            bgColor = 'bg-blue-600';
          }
          
          return (
            <button
              key={String(option.value)}
              onClick={() => !showResult && onAnswer(option.value)}
              disabled={showResult}
              className={`p-6 rounded-xl text-center transition-all ${bgColor}`}
            >
              <span className="text-3xl mb-2 block">{option.emoji}</span>
              <span className="font-bold">{option.label}</span>
            </button>
          );
        })}
      </div>
      
      {showResult && (
        <div className={`p-4 rounded-xl mt-4 ${isCorrect ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
          <p className="font-bold mb-2">{isCorrect ? '🎉 正确!' : '❌ 错误'}</p>
          <p className="text-slate-300">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default TrueFalse;
```

#### 3.4 FillBlank.tsx (25 分钟)
**文件**: `components/questions/FillBlank.tsx`

```typescript
import React, { useState } from 'react';
import { FillBlankQuestion } from '../../types';

interface FillBlankProps {
  question: FillBlankQuestion;
  onAnswer: (answer: string) => void;
  showResult: boolean;
  userAnswer?: string;
  isCorrect?: boolean;
}

const FillBlank: React.FC<FillBlankProps> = ({
  question,
  onAnswer,
  showResult,
  userAnswer,
  isCorrect
}) => {
  const [input, setInput] = useState(userAnswer || '');

  const handleSubmit = () => {
    if (input.trim()) {
      onAnswer(input.trim());
    }
  };

  // 将问题文本中的 ____ 替换为输入框或答案
  const renderQuestion = () => {
    const parts = question.question.split('____');
    return (
      <p className="text-xl">
        {parts[0]}
        {showResult ? (
          <span className={`font-bold px-2 py-1 rounded ${
            isCorrect ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {userAnswer || '(空)'}
          </span>
        ) : (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="输入答案"
            className="w-32 px-3 py-1 bg-slate-600 border-2 border-blue-500 rounded-lg text-center mx-1"
            autoFocus
          />
        )}
        {parts[1]}
      </p>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-6">
        填写空白处：
      </h2>
      
      <div className="p-6 bg-slate-700 rounded-xl mb-6">
        {renderQuestion()}
      </div>
      
      {!showResult && (
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 rounded-xl font-bold transition-all"
        >
          提交答案
        </button>
      )}
      
      {showResult && (
        <div className={`p-4 rounded-xl ${isCorrect ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
          <p className="font-bold mb-2">{isCorrect ? '🎉 正确!' : '❌ 错误'}</p>
          {!isCorrect && (
            <p className="text-yellow-300 mb-2">
              正确答案: {question.correctAnswers.join(' 或 ')}
            </p>
          )}
          <p className="text-slate-300">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default FillBlank;
```

**验收**: 三个题型组件可独立渲染

---

### Step 4: LevelMap 升级 (30 分钟)
**文件**: `components/LevelMap.tsx`

添加课程切换和概念关卡支持：

```typescript
// 在文件顶部添加
import { COURSES } from '../constants';

// 在 LevelMap 组件中添加课程切换
const [selectedCourseId, setSelectedCourseId] = useState('python-kids');
const selectedCourse = COURSES.find(c => c.id === selectedCourseId);

// 添加课程切换 UI (在 return 中添加)
<div className="mb-6 flex gap-2">
  {COURSES.map(course => (
    <button
      key={course.id}
      onClick={() => setSelectedCourseId(course.id)}
      className={`px-4 py-2 rounded-lg font-bold transition-all ${
        selectedCourseId === course.id 
          ? 'bg-blue-600' 
          : 'bg-slate-700 hover:bg-slate-600'
      }`}
    >
      {course.icon} {course.name}
    </button>
  ))}
</div>
```

**验收**: 可以切换 Python 和 Zeabur 课程

---

### Step 5: App.tsx 集成 (60 分钟)
**文件**: `App.tsx`

核心改动：

```typescript
// 1. 添加导入
import QuestionRenderer from './components/questions/QuestionRenderer';
import { ConceptQuestion, UniversalLevel } from './types';
import { ZEABUR_COURSE } from './constants';

// 2. 添加状态
const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
const [conceptAnswer, setConceptAnswer] = useState<string | boolean | null>(null);
const [showConceptResult, setShowConceptResult] = useState(false);

// 3. 处理概念题答题
const handleConceptAnswer = (answer: string | boolean) => {
  setConceptAnswer(answer);
  const currentQuestion = getCurrentConceptQuestion();
  const isCorrect = checkConceptAnswer(currentQuestion, answer);
  setShowConceptResult(true);
  
  // 播放音效
  if (isCorrect) {
    playSound(SFX.CLICK);
    // 记录正确
  } else {
    playSound(SFX.LOSE);
    // 记录错误
  }
};

// 4. 验证概念题答案
const checkConceptAnswer = (question: ConceptQuestion, answer: string | boolean): boolean => {
  switch (question.type) {
    case 'single_choice':
      return answer === question.correctAnswer;
    case 'true_false':
      return answer === question.correctAnswer;
    case 'fill_blank':
      const normalizedAnswer = String(answer).toLowerCase().trim();
      return question.correctAnswers.some(
        correct => question.caseSensitive 
          ? correct === answer 
          : correct.toLowerCase() === normalizedAnswer
      );
    default:
      return false;
  }
};

// 5. 在 JSX 中根据课程类型渲染不同内容
{currentCourse?.type === 'concept' ? (
  <QuestionRenderer
    question={currentLevel.questions[0]}
    onAnswer={handleConceptAnswer}
    showResult={showConceptResult}
    userAnswer={conceptAnswer}
    isCorrect={/* 计算正确性 */}
  />
) : (
  // 现有的 CodeEditor
)}
```

**验收**: Zeabur 课程可完整答题

---

### Step 6: 测试与调整 (30 分钟)

1. **功能测试**:
   - [ ] 可切换到 Zeabur 课程
   - [ ] 10 个关卡都可进入
   - [ ] 单选题正确答题
   - [ ] 判断题正确答题
   - [ ] 填空题正确答题
   - [ ] 答错显示解释
   - [ ] 完成关卡显示星星
   - [ ] 进度正确保存

2. **视觉调整**:
   - [ ] 题目字体大小合适
   - [ ] 选项按钮间距合理
   - [ ] 正确/错误颜色醒目
   - [ ] 移动端适配 (可选)

---

## 📅 时间分配

| 步骤 | 预估时间 | 实际时间 |
|-----|---------|---------|
| Step 1: 类型定义 | 15 min | |
| Step 2: 课程数据 | 45 min | |
| Step 3: 题型组件 | 90 min | |
| Step 4: LevelMap | 30 min | |
| Step 5: App 集成 | 60 min | |
| Step 6: 测试调整 | 30 min | |
| **总计** | **4.5 h** | |

---

## 🎯 Demo 演示要点

给蛋黄演示时的话术：

> "这是专门为你设计的 Zeabur 学习课程，共 10 个关卡，涵盖平台核心概念。
> 每个关卡有不同类型的题目：选择题、判断题、填空题。
> 答对获得星星，答错有详细解释。
> 完成后你就能自信地向客户介绍 Zeabur 的核心优势了！"

---

## 🔜 后续迭代

Demo 完成后，下一步可以考虑：

1. **增加更多关卡** (15-20 个，覆盖更多功能)
2. **添加爬虫功能** (自动抓取文档更新题库)
3. **加入 AI 生成** (快速扩展其他课程)
4. **复习系统** (巩固记忆)

---

*开始开发吧！🚀*

