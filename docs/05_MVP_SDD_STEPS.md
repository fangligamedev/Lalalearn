# Lalalearn MVP - SDD 开发步骤
## Zeabur 员工培训 Demo

> **开发模式**: Spec-Driven Development (SDD)  
> **目标**: 每个 Step 都有明确的输入、规格、输出和验收标准  
> **日期**: 2025-11-26

---

## 📋 开发顺序总览

```
┌─────────────────────────────────────────────────────────────────┐
│                     MVP DEVELOPMENT FLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1        Step 2        Step 3        Step 4              │
│  ────────      ────────      ────────      ────────            │
│  类型定义  ───▶ 课程导入  ───▶ 题型组件  ───▶ 关卡地图          │
│  (15min)       (30min)       (90min)       (30min)             │
│                                                                 │
│                              Step 5        Step 6              │
│                              ────────      ────────            │
│                          ───▶ App集成  ───▶ 测试发布           │
│                              (60min)       (30min)             │
│                                                                 │
│                                     总计: 4-5 小时              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 课程导入方案

### 方案对比

| 方案 | 复杂度 | 时间 | 推荐 |
|-----|-------|------|-----|
| **A: 硬编码在 constants.ts** | ⭐ | 45min | ✅ MVP 首选 |
| **B: JSON 文件 + 动态加载** | ⭐⭐ | 60min | ✅ 稍后升级 |
| **C: 粘贴文档 + AI 生成** | ⭐⭐⭐ | 2-3h | 后续迭代 |
| **D: 爬虫自动抓取** | ⭐⭐⭐⭐ | 4-5h | v2.0 |

### MVP 采用方案 A+B

**方案 A (今天)**: 先把 Zeabur 课程硬编码在 `constants.ts`，快速出 Demo

**方案 B (可选)**: 同时支持从 JSON 文件加载，方便后续扩展

```typescript
// 课程加载逻辑
const loadCourse = async (courseId: string): Promise<Course> => {
  // 优先从内置课程加载
  const builtinCourse = BUILTIN_COURSES[courseId];
  if (builtinCourse) return builtinCourse;
  
  // 尝试从 localStorage 加载自定义课程
  const customCourses = JSON.parse(localStorage.getItem('custom_courses') || '[]');
  return customCourses.find(c => c.id === courseId);
};
```

---

# SDD 开发步骤

---

## Step 1: 类型定义

### 📥 Input
- 现有 `types.ts` 文件
- MVP 需求：单选题、判断题、填空题

### 📐 Spec

```typescript
// ============================================================
// 文件: src/types.ts
// 位置: 在文件末尾添加以下类型定义
// ============================================================

// ---------- 概念题类型 ----------

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
  question: string;
  correctAnswers: string[];
  caseSensitive?: boolean;
  explanation: string;
}

/** 概念题联合类型 */
export type ConceptQuestion = 
  | SingleChoiceQuestion 
  | TrueFalseQuestion 
  | FillBlankQuestion;

// ---------- 课程结构 ----------

/** 概念关卡 */
export interface ConceptLevel {
  id: number;
  title: string;
  description: string;
  type: 'concept';
  questions: ConceptQuestion[];
}

/** 课程定义 */
export interface Course {
  id: string;
  name: string;
  icon: string;
  description?: string;
  type: 'code' | 'concept';
  levels: ConceptLevel[] | LevelData[];
}
```

### 📤 Output
- 更新后的 `types.ts`

### ✅ 验收标准
```bash
# 运行 TypeScript 编译检查
npx tsc --noEmit

# 期望: 无错误
```

---

## Step 2: 课程数据与导入

### 📥 Input
- Zeabur 文档核心知识点 (10 个)
- 更新后的 `types.ts`

### 📐 Spec

#### 2.1 Zeabur 课程数据

```typescript
// ============================================================
// 文件: src/constants.ts
// 位置: 在文件末尾添加
// ============================================================

import { Course, ConceptLevel } from './types';

// Zeabur 培训课程
export const ZEABUR_COURSE: Course = {
  id: 'zeabur-training',
  name: 'Zeabur 云平台速成',
  icon: '☁️',
  description: '10 分钟掌握 Zeabur 核心概念',
  type: 'concept',
  levels: [
    {
      id: 1,
      title: '什么是 Zeabur',
      description: '了解 Zeabur 的基本定位',
      type: 'concept',
      questions: [{
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
      }]
    },
    {
      id: 2,
      title: 'Zeabur 的核心优势',
      description: '了解 Zeabur 的独特卖点',
      type: 'concept',
      questions: [{
        type: 'true_false',
        statement: 'Zeabur 需要用户手动配置 CI/CD 流水线才能部署应用。',
        correctAnswer: false,
        explanation: 'Zeabur 最大的优势就是开箱即用的 CI/CD，无需手动配置即可自动构建部署。'
      }]
    },
    {
      id: 3,
      title: '按量计费',
      description: '理解 Zeabur 的计费方式',
      type: 'concept',
      questions: [{
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
      }]
    },
    {
      id: 4,
      title: '支持的编程语言',
      description: '了解 Zeabur 支持哪些技术栈',
      type: 'concept',
      questions: [{
        type: 'true_false',
        statement: 'Zeabur 只支持 Node.js 项目，不支持 Python 或 Go。',
        correctAnswer: false,
        explanation: 'Zeabur 支持多种编程语言，包括 Node.js、Python、Go、Java、Ruby、Rust 等。'
      }]
    },
    {
      id: 5,
      title: 'Git Service 部署',
      description: '学习从代码仓库部署',
      type: 'concept',
      questions: [{
        type: 'fill_blank',
        question: '在 Zeabur 中，通过 ____ Service 可以直接从 GitHub 仓库部署应用。',
        correctAnswers: ['Git', 'git', 'GIT'],
        explanation: 'Git Service 是最常用的部署方式，连接 GitHub 后自动检测并部署项目。'
      }]
    },
    {
      id: 6,
      title: '环境变量配置',
      description: '学习如何配置应用参数',
      type: 'concept',
      questions: [{
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
      }]
    },
    {
      id: 7,
      title: '预构建服务',
      description: '了解 Prebuilt 服务',
      type: 'concept',
      questions: [{
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
      }]
    },
    {
      id: 8,
      title: '域名配置',
      description: '学习如何绑定自定义域名',
      type: 'concept',
      questions: [{
        type: 'true_false',
        statement: 'Zeabur 部署的服务只能通过 Zeabur 提供的二级域名访问，不支持自定义域名。',
        correctAnswer: false,
        explanation: 'Zeabur 支持绑定自定义域名，在 Networking 中配置即可。'
      }]
    },
    {
      id: 9,
      title: '一键部署按钮',
      description: '了解 Deploy Button 功能',
      type: 'concept',
      questions: [{
        type: 'fill_blank',
        question: '开源项目可以在 README 中添加 "Deploy to ____" 按钮，让用户一键部署。',
        correctAnswers: ['Zeabur', 'zeabur', 'ZEABUR'],
        explanation: 'Deploy to Zeabur 按钮是吸引用户使用开源项目的好方法，一键即可部署完整应用。'
      }]
    },
    {
      id: 10,
      title: '综合测验',
      description: '检验你对 Zeabur 的理解',
      type: 'concept',
      questions: [{
        type: 'single_choice',
        question: '向客户介绍 Zeabur 时，以下哪个说法最准确？',
        options: [
          { key: 'A', text: 'Zeabur 是一个需要复杂配置的服务器托管平台' },
          { key: 'B', text: 'Zeabur 是一个开箱即用、按量计费的应用部署平台，支持多种语言' },
          { key: 'C', text: 'Zeabur 只适合大型企业使用' },
          { key: 'D', text: 'Zeabur 是一个本地开发工具' }
        ],
        correctAnswer: 'B',
        explanation: '🎉 恭喜！你已经掌握了 Zeabur 的核心卖点：开箱即用、按量计费、多语言支持。'
      }]
    }
  ] as ConceptLevel[]
};

// 所有可用课程
export const ALL_COURSES: Course[] = [ZEABUR_COURSE];

// 根据 ID 获取课程
export const getCourseById = (id: string): Course | undefined => {
  return ALL_COURSES.find(c => c.id === id);
};
```

#### 2.2 课程加载工具函数 (可选增强)

```typescript
// ============================================================
// 文件: src/services/courseService.ts (新建)
// ============================================================

import { Course } from '../types';
import { ALL_COURSES } from '../constants';

const CUSTOM_COURSES_KEY = 'lalalearn_custom_courses';

/** 获取所有课程 (内置 + 自定义) */
export const getAllCourses = (): Course[] => {
  const customCourses = getCustomCourses();
  return [...ALL_COURSES, ...customCourses];
};

/** 获取自定义课程 */
export const getCustomCourses = (): Course[] => {
  try {
    const data = localStorage.getItem(CUSTOM_COURSES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/** 保存自定义课程 */
export const saveCustomCourse = (course: Course): void => {
  const courses = getCustomCourses();
  const existingIndex = courses.findIndex(c => c.id === course.id);
  
  if (existingIndex >= 0) {
    courses[existingIndex] = course;
  } else {
    courses.push(course);
  }
  
  localStorage.setItem(CUSTOM_COURSES_KEY, JSON.stringify(courses));
};

/** 从 JSON 字符串导入课程 */
export const importCourseFromJSON = (jsonString: string): Course => {
  const course = JSON.parse(jsonString) as Course;
  
  // 基础校验
  if (!course.id || !course.name || !course.levels) {
    throw new Error('无效的课程格式');
  }
  
  // 自动生成 ID 如果没有
  if (!course.id) {
    course.id = `custom-${Date.now()}`;
  }
  
  saveCustomCourse(course);
  return course;
};
```

### 📤 Output
- 更新后的 `constants.ts` (含 ZEABUR_COURSE)
- 新建 `services/courseService.ts` (可选)

### ✅ 验收标准
```typescript
// 在浏览器控制台测试
import { ZEABUR_COURSE } from './constants';
console.log(ZEABUR_COURSE.levels.length); // 期望: 10
console.log(ZEABUR_COURSE.levels[0].questions[0].type); // 期望: 'single_choice'
```

---

## Step 3: 题型组件

### 📥 Input
- 类型定义 (Step 1)
- Tailwind CSS 样式系统

### 📐 Spec

#### 3.1 创建目录结构
```bash
mkdir -p src/components/questions
```

#### 3.2 QuestionRenderer.tsx

```typescript
// ============================================================
// 文件: src/components/questions/QuestionRenderer.tsx
// ============================================================

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
  disabled?: boolean;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = (props) => {
  const { question, ...rest } = props;
  
  switch (question.type) {
    case 'single_choice':
      return <SingleChoice question={question} {...rest} />;
    case 'true_false':
      return <TrueFalse question={question} {...rest} />;
    case 'fill_blank':
      return <FillBlank question={question} {...rest} />;
    default:
      return (
        <div className="text-red-400 p-4 bg-red-900/20 rounded-xl">
          ⚠️ 未知题型: {(question as any).type}
        </div>
      );
  }
};

export default QuestionRenderer;
```

#### 3.3 SingleChoice.tsx

```typescript
// ============================================================
// 文件: src/components/questions/SingleChoice.tsx
// ============================================================

import React from 'react';
import { SingleChoiceQuestion } from '../../types';

interface Props {
  question: SingleChoiceQuestion;
  onAnswer: (answer: string) => void;
  showResult: boolean;
  userAnswer?: string;
  isCorrect?: boolean;
  disabled?: boolean;
}

const SingleChoice: React.FC<Props> = ({
  question,
  onAnswer,
  showResult,
  userAnswer,
  isCorrect,
  disabled
}) => {
  const handleSelect = (key: string) => {
    if (!showResult && !disabled) {
      onAnswer(key);
    }
  };

  return (
    <div className="space-y-6">
      {/* 问题 */}
      <h2 className="text-2xl font-bold text-white leading-relaxed">
        {question.question}
      </h2>
      
      {/* 选项 */}
      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = userAnswer === option.key;
          const isCorrectOption = option.key === question.correctAnswer;
          
          // 样式逻辑
          let className = 'w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center gap-3 ';
          
          if (showResult) {
            if (isCorrectOption) {
              className += 'bg-green-600 ring-2 ring-green-400';
            } else if (isSelected) {
              className += 'bg-red-600 ring-2 ring-red-400';
            } else {
              className += 'bg-slate-700/50 opacity-60';
            }
          } else if (isSelected) {
            className += 'bg-blue-600 ring-2 ring-blue-400';
          } else {
            className += 'bg-slate-700 hover:bg-slate-600 cursor-pointer';
          }
          
          return (
            <button
              key={option.key}
              onClick={() => handleSelect(option.key)}
              disabled={showResult || disabled}
              className={className}
            >
              {/* 选项标记 */}
              <span className={`
                w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                ${isSelected ? 'bg-white/20' : 'bg-slate-600'}
              `}>
                {option.key}
              </span>
              
              {/* 选项文本 */}
              <span className="flex-1">{option.text}</span>
              
              {/* 正确标记 */}
              {showResult && isCorrectOption && (
                <span className="text-xl">✓</span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* 结果反馈 */}
      {showResult && (
        <div className={`p-5 rounded-xl ${
          isCorrect 
            ? 'bg-green-900/40 border border-green-500/30' 
            : 'bg-red-900/40 border border-red-500/30'
        }`}>
          <p className="font-bold text-lg mb-2">
            {isCorrect ? '🎉 答对了！' : '❌ 答错了'}
          </p>
          <p className="text-slate-300 leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default SingleChoice;
```

#### 3.4 TrueFalse.tsx

```typescript
// ============================================================
// 文件: src/components/questions/TrueFalse.tsx
// ============================================================

import React from 'react';
import { TrueFalseQuestion } from '../../types';

interface Props {
  question: TrueFalseQuestion;
  onAnswer: (answer: boolean) => void;
  showResult: boolean;
  userAnswer?: boolean;
  isCorrect?: boolean;
  disabled?: boolean;
}

const TrueFalse: React.FC<Props> = ({
  question,
  onAnswer,
  showResult,
  userAnswer,
  isCorrect,
  disabled
}) => {
  const options = [
    { value: true, label: '正确', icon: '✓', color: 'green' },
    { value: false, label: '错误', icon: '✗', color: 'red' }
  ];

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <h2 className="text-xl font-bold text-slate-300">
        判断以下说法是否正确：
      </h2>
      
      {/* 陈述 */}
      <div className="p-6 bg-slate-700/50 rounded-xl border border-slate-600">
        <p className="text-xl text-white leading-relaxed">
          "{question.statement}"
        </p>
      </div>
      
      {/* 选项按钮 */}
      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => {
          const isSelected = userAnswer === option.value;
          const isCorrectOption = option.value === question.correctAnswer;
          
          let className = 'p-6 rounded-xl text-center transition-all duration-200 ';
          
          if (showResult) {
            if (isCorrectOption) {
              className += 'bg-green-600 ring-2 ring-green-400';
            } else if (isSelected) {
              className += 'bg-red-600 ring-2 ring-red-400';
            } else {
              className += 'bg-slate-700/50 opacity-60';
            }
          } else if (isSelected) {
            className += 'bg-blue-600 ring-2 ring-blue-400';
          } else {
            className += 'bg-slate-700 hover:bg-slate-600 cursor-pointer';
          }
          
          return (
            <button
              key={String(option.value)}
              onClick={() => !showResult && !disabled && onAnswer(option.value)}
              disabled={showResult || disabled}
              className={className}
            >
              <span className="text-4xl mb-2 block">{option.icon}</span>
              <span className="font-bold text-lg">{option.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* 结果反馈 */}
      {showResult && (
        <div className={`p-5 rounded-xl ${
          isCorrect 
            ? 'bg-green-900/40 border border-green-500/30' 
            : 'bg-red-900/40 border border-red-500/30'
        }`}>
          <p className="font-bold text-lg mb-2">
            {isCorrect ? '🎉 答对了！' : '❌ 答错了'}
          </p>
          <p className="text-slate-300 leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default TrueFalse;
```

#### 3.5 FillBlank.tsx

```typescript
// ============================================================
// 文件: src/components/questions/FillBlank.tsx
// ============================================================

import React, { useState, useEffect } from 'react';
import { FillBlankQuestion } from '../../types';

interface Props {
  question: FillBlankQuestion;
  onAnswer: (answer: string) => void;
  showResult: boolean;
  userAnswer?: string;
  isCorrect?: boolean;
  disabled?: boolean;
}

const FillBlank: React.FC<Props> = ({
  question,
  onAnswer,
  showResult,
  userAnswer,
  isCorrect,
  disabled
}) => {
  const [input, setInput] = useState('');
  
  // 重置输入框当题目变化
  useEffect(() => {
    setInput(userAnswer || '');
  }, [question, userAnswer]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (trimmed) {
      onAnswer(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      handleSubmit();
    }
  };

  // 渲染问题文本，将 ____ 替换为输入框或答案
  const renderQuestionText = () => {
    const parts = question.question.split('____');
    
    return (
      <p className="text-xl leading-relaxed">
        <span>{parts[0]}</span>
        
        {showResult ? (
          <span className={`
            inline-block px-3 py-1 mx-1 rounded-lg font-bold
            ${isCorrect ? 'bg-green-600' : 'bg-red-600'}
          `}>
            {userAnswer || '(未填写)'}
          </span>
        ) : (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="输入答案"
            autoFocus
            className="
              inline-block w-40 px-3 py-1 mx-1
              bg-slate-600 border-2 border-blue-500 rounded-lg
              text-center text-white font-bold
              focus:outline-none focus:ring-2 focus:ring-blue-400
              disabled:opacity-50
            "
          />
        )}
        
        <span>{parts[1]}</span>
      </p>
    );
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <h2 className="text-xl font-bold text-slate-300">
        填写空白处：
      </h2>
      
      {/* 问题文本 */}
      <div className="p-6 bg-slate-700/50 rounded-xl border border-slate-600">
        {renderQuestionText()}
      </div>
      
      {/* 提交按钮 */}
      {!showResult && (
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || disabled}
          className="
            w-full py-4 rounded-xl font-bold text-lg
            transition-all duration-200
            bg-blue-600 hover:bg-blue-500
            disabled:bg-slate-600 disabled:cursor-not-allowed
          "
        >
          提交答案
        </button>
      )}
      
      {/* 结果反馈 */}
      {showResult && (
        <div className={`p-5 rounded-xl ${
          isCorrect 
            ? 'bg-green-900/40 border border-green-500/30' 
            : 'bg-red-900/40 border border-red-500/30'
        }`}>
          <p className="font-bold text-lg mb-2">
            {isCorrect ? '🎉 答对了！' : '❌ 答错了'}
          </p>
          
          {!isCorrect && (
            <p className="text-yellow-300 mb-2">
              正确答案：<strong>{question.correctAnswers[0]}</strong>
              {question.correctAnswers.length > 1 && (
                <span className="text-slate-400">
                  （也可以是：{question.correctAnswers.slice(1).join('、')}）
                </span>
              )}
            </p>
          )}
          
          <p className="text-slate-300 leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default FillBlank;
```

### 📤 Output
- `src/components/questions/QuestionRenderer.tsx`
- `src/components/questions/SingleChoice.tsx`
- `src/components/questions/TrueFalse.tsx`
- `src/components/questions/FillBlank.tsx`

### ✅ 验收标准
```typescript
// 临时测试代码
import QuestionRenderer from './components/questions/QuestionRenderer';
import { ZEABUR_COURSE } from './constants';

// 渲染第一个问题
<QuestionRenderer
  question={ZEABUR_COURSE.levels[0].questions[0]}
  onAnswer={(a) => console.log('答案:', a)}
  showResult={false}
/>
```

---

## Step 4: 关卡地图升级

### 📥 Input
- 现有 `LevelMap.tsx`
- 课程数据 (Step 2)

### 📐 Spec

在 `LevelMap.tsx` 中添加课程切换功能：

```typescript
// ============================================================
// 文件: src/components/LevelMap.tsx
// 修改: 添加课程切换 Tab
// ============================================================

// 1. 添加导入
import { ALL_COURSES, getCourseById, ZEABUR_COURSE } from '../constants';
import { Course, ConceptLevel } from '../types';

// 2. 在组件内添加状态 (在现有 state 后面)
const [activeCourseId, setActiveCourseId] = useState<string>('zeabur-training');

// 获取当前课程
const activeCourse = getCourseById(activeCourseId) || ZEABUR_COURSE;
const isConceptCourse = activeCourse.type === 'concept';

// 3. 在 JSX 最顶部添加课程切换 Tab
{/* 课程切换 Tab */}
<div className="flex gap-2 mb-6 overflow-x-auto pb-2">
  {ALL_COURSES.map((course) => (
    <button
      key={course.id}
      onClick={() => setActiveCourseId(course.id)}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl font-bold
        whitespace-nowrap transition-all duration-200
        ${activeCourseId === course.id
          ? 'bg-blue-600 text-white ring-2 ring-blue-400'
          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
        }
      `}
    >
      <span className="text-xl">{course.icon}</span>
      <span>{course.name}</span>
    </button>
  ))}
</div>

// 4. 修改关卡渲染逻辑，支持概念课程
{isConceptCourse ? (
  // 概念课程关卡
  (activeCourse.levels as ConceptLevel[]).map((level) => (
    <button
      key={level.id}
      onClick={() => onLevelSelect?.(level.id, activeCourseId)}
      className="..."
    >
      <span className="text-2xl mb-1">📖</span>
      <span className="font-bold">{level.id}</span>
      <span className="text-xs text-slate-400 truncate w-full">
        {level.title}
      </span>
    </button>
  ))
) : (
  // 现有代码课程关卡
  // ... 保持原有渲染逻辑
)}
```

### 📤 Output
- 更新后的 `LevelMap.tsx`

### ✅ 验收标准
- 顶部显示课程切换 Tab
- 点击 "Zeabur 云平台速成" 显示 10 个关卡
- 点击关卡可触发 onLevelSelect

---

## Step 5: App.tsx 集成

### 📥 Input
- 所有之前创建的组件和类型
- 现有 App.tsx

### 📐 Spec

核心修改点：

```typescript
// ============================================================
// 文件: src/App.tsx
// 修改: 添加概念课程支持
// ============================================================

// 1. 添加导入
import QuestionRenderer from './components/questions/QuestionRenderer';
import { ConceptQuestion, ConceptLevel, Course } from './types';
import { ZEABUR_COURSE, getCourseById } from './constants';

// 2. 添加新状态
const [activeCourseId, setActiveCourseId] = useState<string>('zeabur-training');
const [currentConceptLevel, setCurrentConceptLevel] = useState<ConceptLevel | null>(null);
const [conceptAnswer, setConceptAnswer] = useState<string | boolean | null>(null);
const [showConceptResult, setShowConceptResult] = useState(false);
const [conceptCorrect, setConceptCorrect] = useState(false);

// 3. 获取当前课程
const currentCourse = getCourseById(activeCourseId);
const isConceptCourse = currentCourse?.type === 'concept';

// 4. 处理关卡选择
const handleLevelSelect = (levelId: number, courseId?: string) => {
  if (courseId) {
    setActiveCourseId(courseId);
  }
  
  const course = getCourseById(courseId || activeCourseId);
  
  if (course?.type === 'concept') {
    const level = (course.levels as ConceptLevel[]).find(l => l.id === levelId);
    if (level) {
      setCurrentConceptLevel(level);
      setConceptAnswer(null);
      setShowConceptResult(false);
      setGamePhase('playing');
    }
  } else {
    // 原有代码课程逻辑
    setCurrentLevel(levelId);
    // ...
  }
};

// 5. 验证概念题答案
const checkConceptAnswer = (question: ConceptQuestion, answer: string | boolean): boolean => {
  switch (question.type) {
    case 'single_choice':
      return answer === question.correctAnswer;
    case 'true_false':
      return answer === question.correctAnswer;
    case 'fill_blank':
      const userAnswer = String(answer).trim();
      return question.correctAnswers.some(correct =>
        question.caseSensitive
          ? correct === userAnswer
          : correct.toLowerCase() === userAnswer.toLowerCase()
      );
    default:
      return false;
  }
};

// 6. 处理概念题答题
const handleConceptAnswer = (answer: string | boolean) => {
  if (!currentConceptLevel) return;
  
  const question = currentConceptLevel.questions[0];
  const isCorrect = checkConceptAnswer(question, answer);
  
  setConceptAnswer(answer);
  setConceptCorrect(isCorrect);
  setShowConceptResult(true);
  
  // 播放音效
  if (isCorrect) {
    playSound(SFX.WIN);
  } else {
    playSound(SFX.LOSE);
  }
};

// 7. 处理概念题继续/完成
const handleConceptContinue = () => {
  if (!currentConceptLevel || !currentCourse) return;
  
  const levels = currentCourse.levels as ConceptLevel[];
  const currentIndex = levels.findIndex(l => l.id === currentConceptLevel.id);
  
  if (currentIndex < levels.length - 1) {
    // 下一关
    const nextLevel = levels[currentIndex + 1];
    setCurrentConceptLevel(nextLevel);
    setConceptAnswer(null);
    setShowConceptResult(false);
  } else {
    // 课程完成
    setGamePhase('victory');
  }
};

// 8. 在 JSX 渲染中添加概念课程界面
{gamePhase === 'playing' && isConceptCourse && currentConceptLevel && (
  <div className="max-w-2xl mx-auto p-6">
    {/* 关卡标题 */}
    <div className="mb-8">
      <div className="flex items-center gap-2 text-slate-400 mb-2">
        <span>Level {currentConceptLevel.id}</span>
        <span>•</span>
        <span>{currentCourse?.name}</span>
      </div>
      <h1 className="text-3xl font-bold text-white">
        {currentConceptLevel.title}
      </h1>
      <p className="text-slate-400 mt-1">
        {currentConceptLevel.description}
      </p>
    </div>
    
    {/* 题目渲染 */}
    <QuestionRenderer
      question={currentConceptLevel.questions[0]}
      onAnswer={handleConceptAnswer}
      showResult={showConceptResult}
      userAnswer={conceptAnswer ?? undefined}
      isCorrect={conceptCorrect}
    />
    
    {/* 继续按钮 */}
    {showConceptResult && (
      <button
        onClick={handleConceptContinue}
        className="
          w-full mt-6 py-4 rounded-xl font-bold text-lg
          bg-gradient-to-r from-purple-600 to-blue-600
          hover:from-purple-500 hover:to-blue-500
          transition-all duration-200
        "
      >
        {currentConceptLevel.id < (currentCourse?.levels.length || 0)
          ? '继续下一关 →'
          : '🎉 完成课程!'
        }
      </button>
    )}
    
    {/* 返回按钮 */}
    <button
      onClick={() => setGamePhase('levelMap')}
      className="w-full mt-3 py-3 rounded-xl bg-slate-700 hover:bg-slate-600"
    >
      返回关卡选择
    </button>
  </div>
)}
```

### 📤 Output
- 更新后的 `App.tsx`

### ✅ 验收标准
- 可以选择 Zeabur 课程
- 可以进入关卡答题
- 单选题、判断题、填空题都能正常答题
- 答对/答错有正确的反馈
- 可以继续下一关或返回

---

## Step 6: 测试与部署

### 📐 测试清单

```bash
# 1. 启动开发服务器
npm run dev
```

#### 功能测试

| 测试项 | 操作 | 期望结果 | ✓/✗ |
|-------|------|---------|-----|
| 课程切换 | 点击 "Zeabur 云平台速成" | 显示 10 个关卡 | |
| 进入关卡 | 点击 Level 1 | 显示单选题 | |
| 单选题答对 | 选择 B | 绿色反馈，显示解释 | |
| 单选题答错 | 选择 A | 红色反馈，显示解释 | |
| 判断题 | 进入 Level 2 | 显示判断题界面 | |
| 填空题 | 进入 Level 5 | 可输入并提交 | |
| 继续下一关 | 点击继续按钮 | 进入下一关 | |
| 完成课程 | 完成 Level 10 | 显示完成提示 | |
| 返回 | 点击返回按钮 | 回到关卡选择 | |

#### 音效测试
- [ ] 答对播放胜利音效
- [ ] 答错播放失败音效

### 📐 部署清单

```bash
# 1. 构建
npm run build

# 2. 预览构建结果
npm run preview

# 3. 部署到 Zeabur
# 自动检测并部署
```

---

## 📊 时间跟踪

| Step | 内容 | 预估 | 实际 | 状态 |
|------|------|------|------|------|
| 1 | 类型定义 | 15min | | ⬜ |
| 2 | 课程数据 | 30min | | ⬜ |
| 3 | 题型组件 | 90min | | ⬜ |
| 4 | 关卡地图 | 30min | | ⬜ |
| 5 | App 集成 | 60min | | ⬜ |
| 6 | 测试部署 | 30min | | ⬜ |
| **总计** | | **4.5h** | | |

---

## 🚀 开始开发

准备好后，按顺序执行每个 Step：

```bash
# Step 1: 更新 types.ts
# Step 2: 更新 constants.ts  
# Step 3: 创建题型组件
# Step 4: 更新 LevelMap.tsx
# Step 5: 更新 App.tsx
# Step 6: 测试并部署
```

**开始吧！🎮**

