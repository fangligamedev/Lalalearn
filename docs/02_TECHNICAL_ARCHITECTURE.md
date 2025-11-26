# Lalalearn 2.0 技术架构设计文档 (TDD)
## Technical Design Document

> **版本**: 2.0-alpha  
> **日期**: 2025-11-26  
> **架构师**: AI  

---

## 1. 架构总览

### 1.1 现有架构 (v1.0)

```
┌─────────────────────────────────────────────────────────────┐
│                      CURRENT STACK                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    React 18 + Vite                    │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐  │   │
│  │  │ App.tsx  │ │ LevelMap │ │CodeEditor│ │CoachChat│  │   │
│  │  └────┬─────┘ └──────────┘ └──────────┘ └─────────┘  │   │
│  │       │                                               │   │
│  │       ▼                                               │   │
│  │  ┌──────────────────────────────────────────────┐    │   │
│  │  │              geminiService.ts                 │    │   │
│  │  │  • validateCodeWithGemini()                  │    │   │
│  │  │  • sendChatMessage()                         │    │   │
│  │  └────────────────────┬─────────────────────────┘    │   │
│  └───────────────────────┼──────────────────────────────┘   │
│                          │                                   │
│                          ▼                                   │
│            ┌────────────────────────────┐                   │
│            │    Zeabur AI Hub (Gemini)  │                   │
│            └────────────────────────────┘                   │
│                                                             │
│  数据存储: localStorage (用户进度、设置)                      │
│  部署: Zeabur Static Site                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 目标架构 (v2.0)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        LALALEARN 2.0 ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                        ┌─────────────────────┐                      │
│                        │   React 18 + Vite    │                      │
│                        │   (TypeScript)       │                      │
│                        └──────────┬──────────┘                      │
│                                   │                                  │
│  ┌────────────────────────────────┼────────────────────────────────┐ │
│  │                          UI LAYER                               │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │ │
│  │  │ LevelMap │ │CodeEditor│ │ConceptQ  │ │ Review   │ (新增)    │ │
│  │  │ (升级)   │ │ (保持)   │ │ (新增)   │ │ (新增)   │           │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │ │
│  │                                                                 │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │ │
│  │  │CoachChat │ │ Victory  │ │Leaderbd  │ │CourseHub │ (新增)    │ │
│  │  │ (升级)   │ │ (升级)   │ │ (升级)   │ │ (新增)   │           │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                   │                                  │
│  ┌────────────────────────────────┼────────────────────────────────┐ │
│  │                        SERVICE LAYER                            │ │
│  │                                                                 │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │ │
│  │  │geminiService │  │ courseService│  │spacedRepetition│ (新增) │ │
│  │  │   (升级)     │  │   (新增)     │  │   (新增)     │          │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │ │
│  │         │                 │                 │                   │ │
│  │         ▼                 ▼                 ▼                   │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │                    storageService (新增)                 │   │ │
│  │  │  • UserProgress   • CourseData   • ReviewSchedule       │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                   │                                  │
│                  ┌────────────────┴────────────────┐                │
│                  ▼                                 ▼                │
│       ┌────────────────────┐            ┌────────────────────┐      │
│       │  Zeabur AI Hub     │            │   localStorage     │      │
│       │  (Gemini 2.5)      │            │   (or IndexedDB)   │      │
│       └────────────────────┘            └────────────────────┘      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. 目录结构设计

### 2.1 当前结构

```
/Lalalearn
├── App.tsx
├── components/
│   ├── CoachChat.tsx
│   ├── CodeEditor.tsx
│   ├── LeaderboardModal.tsx
│   ├── LevelMap.tsx
│   ├── TutorialOverlay.tsx
│   ├── UserSelectModal.tsx
│   └── VictoryModal.tsx
├── constants.ts          # 硬编码题库
├── services/
│   ├── audioService.ts
│   └── geminiService.ts
├── types.ts
└── index.tsx
```

### 2.2 目标结构 (最小化改动)

```
/Lalalearn
├── App.tsx                           # 保持，增加路由逻辑
├── components/
│   ├── CoachChat.tsx                 # 升级：支持总结功能
│   ├── CodeEditor.tsx                # 保持不变
│   ├── LeaderboardModal.tsx          # 升级：支持课程筛选
│   ├── LevelMap.tsx                  # 升级：支持通用课程
│   ├── TutorialOverlay.tsx           # 保持不变
│   ├── UserSelectModal.tsx           # 保持不变
│   ├── VictoryModal.tsx              # 升级：增加复习推荐
│   │
│   │── [新增] questions/             # 新增：题型组件
│   │   ├── SingleChoice.tsx
│   │   ├── MultipleChoice.tsx
│   │   ├── TrueFalse.tsx
│   │   ├── FillBlank.tsx
│   │   ├── Matching.tsx
│   │   └── QuestionRenderer.tsx      # 题型分发器
│   │
│   │── [新增] course/                # 新增：课程管理
│   │   ├── CourseHub.tsx             # 课程选择/创建中心
│   │   ├── CourseCard.tsx            # 课程卡片
│   │   ├── CourseImport.tsx          # 导入向导
│   │   └── CourseProgress.tsx        # 进度展示
│   │
│   └── [新增] review/                # 新增：复习系统
│       ├── ReviewDashboard.tsx       # 复习任务面板
│       ├── FlashCard.tsx             # 闪卡组件
│       └── ReviewSession.tsx         # 复习会话
│
├── constants.ts                       # 保持：默认Python题库
│
├── [新增] courses/                    # 预置课程数据
│   ├── python-kids.json              # 儿童Python (迁移自constants)
│   └── zeabur-training.json          # Zeabur培训 (新增)
│
├── services/
│   ├── audioService.ts               # 保持不变
│   ├── geminiService.ts              # 升级：通用验证+生成
│   │
│   │── [新增] courseService.ts       # 课程加载/管理
│   │── [新增] contentGenerator.ts    # AI 内容生成
│   └── [新增] spacedRepetition.ts    # 艾宾浩斯算法
│
├── [新增] store/                      # 状态管理 (可选 Zustand)
│   ├── userStore.ts
│   ├── courseStore.ts
│   └── reviewStore.ts
│
├── types.ts                           # 扩展类型定义
└── index.tsx
```

---

## 3. 核心类型定义扩展

### 3.1 新增类型 (types.ts)

```typescript
// ============================================================
// 课程与题目类型
// ============================================================

/** 课程类型 */
export type CourseType = 'code' | 'concept' | 'mixed';

/** 难度等级 */
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

/** 题目类型 */
export type QuestionType = 
  | 'single_choice'
  | 'multiple_choice'
  | 'true_false'
  | 'fill_blank'
  | 'matching'
  | 'code_completion'
  | 'debug'
  | 'write_code';

/** 通用题目基类 */
export interface BaseQuestion {
  id: string;
  type: QuestionType;
  difficulty: Difficulty;
  points: number;
  timeLimit: number;
  hint?: string;
  explanation?: string;
  tags: string[];  // 知识点标签
}

/** 选择题 */
export interface SingleChoiceQuestion extends BaseQuestion {
  type: 'single_choice';
  question: string;
  options: { key: string; text: string }[];
  correctAnswer: string;
}

/** 多选题 */
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  question: string;
  options: { key: string; text: string }[];
  correctAnswers: string[];
  partialCredit?: boolean;
}

/** 判断题 */
export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true_false';
  statement: string;
  correctAnswer: boolean;
}

/** 填空题 */
export interface FillBlankQuestion extends BaseQuestion {
  type: 'fill_blank';
  question: string;  // 包含 ____ 占位符
  correctAnswers: string[];  // 多个可接受答案
  caseSensitive?: boolean;
}

/** 配对题 */
export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  instruction: string;
  pairs: { left: string; right: string }[];
}

/** 代码题 (兼容现有 LevelData) */
export interface CodeQuestion extends BaseQuestion {
  type: 'code_completion' | 'debug' | 'write_code';
  language: string;
  task: string;
  description: string;
  starterCode: string;
  expectedPatterns?: string[];  // 正则/模式匹配
  concepts: string[];
}

/** 所有题目类型的联合 */
export type Question = 
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillBlankQuestion
  | MatchingQuestion
  | CodeQuestion;

// ============================================================
// 课程结构
// ============================================================

/** 关卡定义 */
export interface Level {
  id: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  questions: Question[];
  unlockCondition?: {
    requiredLevels?: number[];
    minStars?: number;
  };
}

/** 模块 (章节) */
export interface Module {
  id: string;
  name: string;
  description?: string;
  levels: Level[];
}

/** 课程定义 */
export interface Course {
  id: string;
  name: string;
  description: string;
  type: CourseType;
  difficulty: Difficulty;
  language: Language;
  estimatedMinutes: number;
  icon?: string;
  color?: string;
  tags: string[];
  
  modules: Module[];
  
  metadata: {
    version: string;
    author: string;
    source?: string;  // 如果是 AI 生成，记录来源 URL
    createdAt: string;
    updatedAt: string;
  };
}

// ============================================================
// 用户进度 (扩展现有 UserState)
// ============================================================

/** 题目回答记录 */
export interface AnswerRecord {
  questionId: string;
  correct: boolean;
  timestamp: number;
  timeSpent: number;
  attempts: number;
}

/** 关卡进度 */
export interface LevelProgress {
  levelId: number;
  stars: number;
  score: number;
  completedAt?: number;
  answers: AnswerRecord[];
}

/** 课程进度 */
export interface CourseProgress {
  courseId: string;
  currentLevelId: number;
  levels: Record<number, LevelProgress>;
  startedAt: number;
  lastPlayedAt: number;
  completedAt?: number;
}

/** 扩展的用户状态 */
export interface UserStateV2 extends UserState {
  // 新增：多课程进度
  courseProgress: Record<string, CourseProgress>;
  
  // 新增：活跃课程
  activeCourseId: string | null;
  
  // 新增：复习数据
  reviewData: ReviewData;
  
  // 新增：学习统计
  stats: {
    totalCoursesCompleted: number;
    totalQuestionsAnswered: number;
    totalCorrectAnswers: number;
    streakDays: number;
    lastActiveDate: string;
  };
}

// ============================================================
// 艾宾浩斯复习系统
// ============================================================

/** 复习项目 */
export interface ReviewItem {
  questionId: string;
  courseId: string;
  levelId: number;
  
  // 间隔重复参数
  easeFactor: number;      // 难度因子 (默认 2.5)
  interval: number;        // 当前间隔 (小时)
  repetitions: number;     // 复习次数
  nextReviewAt: number;    // 下次复习时间 (timestamp)
  
  // 历史
  history: {
    reviewedAt: number;
    quality: number;  // 0-5 评分
  }[];
}

/** 用户复习数据 */
export interface ReviewData {
  items: ReviewItem[];
  settings: {
    dailyGoal: number;       // 每日目标 (题数)
    reminderEnabled: boolean;
    reminderTime: string;    // "09:00"
  };
  stats: {
    todayReviewed: number;
    totalReviewed: number;
    reviewAccuracy: number;
  };
}

// ============================================================
// AI 服务相关
// ============================================================

/** 内容生成请求 */
export interface ContentGenerationRequest {
  source: {
    type: 'url' | 'text' | 'file';
    content: string;
  };
  options: {
    difficulty: Difficulty;
    questionCount: number;
    questionTypes: QuestionType[];
    language: Language;
  };
}

/** 验证请求 (通用化) */
export interface ValidationRequest {
  questionType: QuestionType;
  question: Question;
  userAnswer: unknown;
  language: Language;
}

/** 验证结果 (通用化) */
export interface ValidationResultV2 {
  correct: boolean;
  score: number;        // 0-100
  feedback: string;
  explanation?: string;
  partialCredit?: boolean;
}
```

---

## 4. 服务层设计

### 4.1 courseService.ts (新增)

```typescript
/**
 * 课程管理服务
 * 职责：加载、缓存、管理课程数据
 */

import { Course, CourseProgress } from '../types';

// 预置课程 ID
export const BUILTIN_COURSES = {
  PYTHON_KIDS: 'python-kids-v1',
  ZEABUR_TRAINING: 'zeabur-training-v1',
};

/**
 * 加载预置课程
 */
export async function loadBuiltinCourse(courseId: string): Promise<Course> {
  const courseMap: Record<string, () => Promise<{ default: Course }>> = {
    [BUILTIN_COURSES.PYTHON_KIDS]: () => import('../courses/python-kids.json'),
    [BUILTIN_COURSES.ZEABUR_TRAINING]: () => import('../courses/zeabur-training.json'),
  };
  
  const loader = courseMap[courseId];
  if (!loader) throw new Error(`Course not found: ${courseId}`);
  
  const module = await loader();
  return module.default;
}

/**
 * 加载自定义课程 (从 localStorage)
 */
export function loadCustomCourses(): Course[] {
  const raw = localStorage.getItem('lalalearn_custom_courses');
  return raw ? JSON.parse(raw) : [];
}

/**
 * 保存自定义课程
 */
export function saveCustomCourse(course: Course): void {
  const courses = loadCustomCourses();
  const existing = courses.findIndex(c => c.id === course.id);
  
  if (existing >= 0) {
    courses[existing] = course;
  } else {
    courses.push(course);
  }
  
  localStorage.setItem('lalalearn_custom_courses', JSON.stringify(courses));
}

/**
 * 获取所有可用课程
 */
export async function getAllCourses(): Promise<{
  builtin: Course[];
  custom: Course[];
}> {
  const builtinPromises = Object.values(BUILTIN_COURSES).map(loadBuiltinCourse);
  const builtin = await Promise.all(builtinPromises);
  const custom = loadCustomCourses();
  
  return { builtin, custom };
}

/**
 * 将 v1 题库迁移为 v2 课程格式 (向后兼容)
 */
export function migrateV1ToV2(v1Levels: LevelData[], bankId: string): Course {
  // 兼容逻辑...
}
```

### 4.2 contentGenerator.ts (新增)

```typescript
/**
 * AI 内容生成服务
 * 职责：根据输入源（URL/文本/文件）生成课程题库
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Course, Question, ContentGenerationRequest } from '../types';

const MODEL_NAME = 'gemini-2.5-flash';

/**
 * 从 URL 抓取内容
 * 注意：需要后端代理或使用允许 CORS 的内容
 */
async function fetchUrlContent(url: string): Promise<string> {
  // 对于 Zeabur Docs，可以抓取其公开 API 或使用 Markdown 源
  // 简化实现：提示用户粘贴内容
  throw new Error('URL fetching requires backend proxy. Please paste content directly.');
}

/**
 * 生成课程提示词
 */
function buildGenerationPrompt(content: string, options: ContentGenerationRequest['options']): string {
  return `
你是一位专业的教育内容设计师。请根据以下材料生成一套游戏化学习课程。

【输入材料】
${content}

【要求】
1. 提取 ${options.questionCount} 个核心知识点
2. 为每个知识点生成 1-3 道题目
3. 题型分布：${options.questionTypes.join(', ')}
4. 难度分布：30% easy, 40% medium, 20% hard, 10% expert
5. 按难度从低到高排序

【输出格式】
返回 JSON，结构如下：
{
  "courseTitle": "课程名称",
  "description": "课程描述",
  "levels": [
    {
      "id": 1,
      "title": "关卡标题",
      "difficulty": "easy",
      "questions": [
        {
          "type": "single_choice",
          "question": "问题",
          "options": [{"key": "A", "text": "选项A"}, ...],
          "correctAnswer": "A",
          "explanation": "解释",
          "hint": "提示"
        }
      ]
    }
  ]
}

语言：${options.language === 'zh' ? '中文' : 'English'}
`;
}

/**
 * 主生成函数
 */
export async function generateCourse(request: ContentGenerationRequest): Promise<Course> {
  const apiKey = process.env.API_KEY || '';
  if (!apiKey) throw new Error('API Key required');

  let content: string;
  
  switch (request.source.type) {
    case 'url':
      content = await fetchUrlContent(request.source.content);
      break;
    case 'text':
      content = request.source.content;
      break;
    case 'file':
      // 需要前端处理文件读取
      content = request.source.content;
      break;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel(
    { model: MODEL_NAME },
    { baseUrl: 'https://hnd1.aihub.zeabur.ai/gemini' }
  );

  const prompt = buildGenerationPrompt(content, request.options);
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // 清理并解析 JSON
  const cleanText = text.replace(/```json\n|\n```/g, '').trim();
  const generated = JSON.parse(cleanText);

  // 组装完整 Course 对象
  return {
    id: `custom-${Date.now()}`,
    name: generated.courseTitle,
    description: generated.description,
    type: 'concept',
    difficulty: 'medium',
    language: request.options.language,
    estimatedMinutes: generated.levels.length * 5,
    tags: ['ai-generated'],
    modules: [{
      id: 'main',
      name: '主模块',
      levels: generated.levels
    }],
    metadata: {
      version: '1.0.0',
      author: 'AI Generated',
      source: request.source.type === 'url' ? request.source.content : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };
}
```

### 4.3 spacedRepetition.ts (新增)

```typescript
/**
 * 艾宾浩斯间隔重复服务
 * 实现 SM-2 算法变体
 */

import { ReviewItem, ReviewData } from '../types';

/** 默认间隔 (小时) */
const DEFAULT_INTERVALS = [1, 6, 24, 72, 168, 336, 720]; // 1h, 6h, 1d, 3d, 7d, 14d, 30d

/**
 * 计算下次复习时间
 * @param item 复习项
 * @param quality 用户评分 0-5 (0=完全忘记, 5=完美记忆)
 */
export function calculateNextReview(item: ReviewItem, quality: number): ReviewItem {
  const newItem = { ...item };
  
  if (quality < 3) {
    // 忘记了，重新开始
    newItem.repetitions = 0;
    newItem.interval = DEFAULT_INTERVALS[0];
  } else {
    // 记住了，增加间隔
    newItem.repetitions += 1;
    
    // SM-2 算法
    newItem.easeFactor = Math.max(
      1.3,
      newItem.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );
    
    if (newItem.repetitions === 1) {
      newItem.interval = DEFAULT_INTERVALS[1]; // 6h
    } else if (newItem.repetitions === 2) {
      newItem.interval = DEFAULT_INTERVALS[2]; // 1d
    } else {
      newItem.interval = Math.round(newItem.interval * newItem.easeFactor);
    }
  }
  
  newItem.nextReviewAt = Date.now() + newItem.interval * 60 * 60 * 1000;
  
  newItem.history.push({
    reviewedAt: Date.now(),
    quality
  });
  
  return newItem;
}

/**
 * 获取今日待复习项目
 */
export function getDueReviews(reviewData: ReviewData): ReviewItem[] {
  const now = Date.now();
  return reviewData.items.filter(item => item.nextReviewAt <= now);
}

/**
 * 添加新的复习项目 (答错时自动加入)
 */
export function addToReview(
  reviewData: ReviewData,
  questionId: string,
  courseId: string,
  levelId: number
): ReviewData {
  const exists = reviewData.items.find(i => i.questionId === questionId);
  if (exists) return reviewData;
  
  const newItem: ReviewItem = {
    questionId,
    courseId,
    levelId,
    easeFactor: 2.5,
    interval: DEFAULT_INTERVALS[0],
    repetitions: 0,
    nextReviewAt: Date.now() + DEFAULT_INTERVALS[0] * 60 * 60 * 1000,
    history: []
  };
  
  return {
    ...reviewData,
    items: [...reviewData.items, newItem]
  };
}

/**
 * 从复习队列移除 (连续正确多次)
 */
export function removeFromReview(reviewData: ReviewData, questionId: string): ReviewData {
  return {
    ...reviewData,
    items: reviewData.items.filter(i => i.questionId !== questionId)
  };
}

/**
 * 获取复习统计
 */
export function getReviewStats(reviewData: ReviewData) {
  const dueCount = getDueReviews(reviewData).length;
  const totalItems = reviewData.items.length;
  const masteredItems = reviewData.items.filter(i => i.repetitions >= 5).length;
  
  return {
    dueCount,
    totalItems,
    masteredItems,
    masteryRate: totalItems > 0 ? masteredItems / totalItems : 0
  };
}
```

### 4.4 geminiService.ts (升级)

```typescript
/**
 * Gemini AI 服务 (升级版)
 * 新增：通用题目验证、学习总结生成
 */

// ... 保留现有代码 ...

/**
 * [新增] 通用题目验证
 */
export async function validateAnswer(
  question: Question,
  userAnswer: unknown,
  language: Language
): Promise<ValidationResultV2> {
  // 对于简单题型，本地验证
  if (['single_choice', 'true_false'].includes(question.type)) {
    return validateLocally(question, userAnswer);
  }
  
  // 复杂题型使用 AI
  const prompt = buildValidationPrompt(question, userAnswer, language);
  // ... AI 调用逻辑 ...
}

/**
 * [新增] 生成学习总结
 */
export async function generateSummary(
  context: {
    course: Course;
    progress: CourseProgress;
    recentAnswers: AnswerRecord[];
  },
  language: Language
): Promise<string> {
  const prompt = `
作为学习助手，请为学生生成一份简短的学习总结：

课程：${context.course.name}
完成进度：${calculateProgress(context.progress)}%
最近表现：${summarizeRecentAnswers(context.recentAnswers)}

请包括：
1. 已掌握的知识点
2. 需要加强的方面
3. 下一步建议

语言：${language === 'zh' ? '简洁的中文' : 'English'}
`;
  
  // ... AI 调用 ...
}
```

---

## 5. 组件设计

### 5.1 QuestionRenderer.tsx (新增)

```typescript
/**
 * 题目渲染分发器
 * 根据题目类型渲染对应组件
 */

interface QuestionRendererProps {
  question: Question;
  onAnswer: (answer: unknown) => void;
  showResult?: boolean;
  userAnswer?: unknown;
  disabled?: boolean;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
  showResult,
  userAnswer,
  disabled
}) => {
  switch (question.type) {
    case 'single_choice':
      return <SingleChoice question={question} {...props} />;
    case 'multiple_choice':
      return <MultipleChoice question={question} {...props} />;
    case 'true_false':
      return <TrueFalse question={question} {...props} />;
    case 'fill_blank':
      return <FillBlank question={question} {...props} />;
    case 'matching':
      return <Matching question={question} {...props} />;
    case 'code_completion':
    case 'debug':
    case 'write_code':
      // 复用现有 CodeEditor
      return <CodeQuestion question={question} {...props} />;
    default:
      return <div>Unknown question type</div>;
  }
};
```

### 5.2 CourseHub.tsx (新增)

```typescript
/**
 * 课程中心
 * 展示所有课程，支持筛选和创建
 */

export const CourseHub: React.FC = () => {
  const [courses, setCourses] = useState<{ builtin: Course[]; custom: Course[] }>();
  const [showImport, setShowImport] = useState(false);
  
  return (
    <div className="course-hub">
      {/* 预置课程 */}
      <section>
        <h2>📚 官方课程</h2>
        <div className="grid grid-cols-2 gap-4">
          {courses?.builtin.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
      
      {/* 自定义课程 */}
      <section>
        <h2>✨ 我的课程</h2>
        <button onClick={() => setShowImport(true)}>
          + 创建新课程
        </button>
        <div className="grid grid-cols-2 gap-4">
          {courses?.custom.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
      
      {showImport && <CourseImport onClose={() => setShowImport(false)} />}
    </div>
  );
};
```

### 5.3 ReviewDashboard.tsx (新增)

```typescript
/**
 * 复习仪表盘
 * 展示待复习任务，开始复习会话
 */

export const ReviewDashboard: React.FC = () => {
  const { reviewData, updateReview } = useReviewStore();
  const dueItems = getDueReviews(reviewData);
  const stats = getReviewStats(reviewData);
  
  return (
    <div className="review-dashboard">
      {/* 今日任务 */}
      <div className="today-tasks">
        <h2>🧠 今日复习</h2>
        <div className="stats">
          <span>{dueItems.length} 待复习</span>
          <span>{stats.masteredItems}/{stats.totalItems} 已掌握</span>
        </div>
        
        {dueItems.length > 0 ? (
          <button onClick={startReviewSession}>
            开始复习
          </button>
        ) : (
          <p>🎉 今日任务已完成！</p>
        )}
      </div>
      
      {/* 进度条 */}
      <ProgressBar value={stats.masteryRate * 100} />
      
      {/* 复习日历 (可选) */}
      <ReviewCalendar />
    </div>
  );
};
```

---

## 6. 数据存储策略

### 6.1 存储键设计

```typescript
const STORAGE_KEYS = {
  // 用户数据
  PLAYERS: 'lalalearn_players',           // UserStateV2[]
  CURRENT_PLAYER: 'lalalearn_current',    // string (userId)
  
  // 课程数据
  CUSTOM_COURSES: 'lalalearn_custom_courses',  // Course[]
  COURSE_CACHE: 'lalalearn_course_cache',      // Record<string, Course>
  
  // 复习数据 (按用户)
  REVIEW_DATA: (userId: string) => `lalalearn_review_${userId}`,
  
  // 设置
  SETTINGS: 'lalalearn_settings'
};
```

### 6.2 迁移策略

```typescript
/**
 * v1 -> v2 数据迁移
 */
export function migrateUserData(): void {
  const oldData = localStorage.getItem('pysparky_players');
  if (!oldData) return;
  
  const v1Players: UserState[] = JSON.parse(oldData);
  
  const v2Players: UserStateV2[] = v1Players.map(p => ({
    ...p,
    // 将 v1 进度转换为课程进度
    courseProgress: {
      'python-kids-v1': {
        courseId: 'python-kids-v1',
        currentLevelId: p.currentLevel,
        levels: Object.fromEntries(
          Object.entries(p.levelStars).map(([id, stars]) => [
            id,
            { levelId: Number(id), stars, score: 0, answers: [] }
          ])
        ),
        startedAt: Date.now(),
        lastPlayedAt: Date.now()
      }
    },
    activeCourseId: 'python-kids-v1',
    reviewData: { items: [], settings: { dailyGoal: 10, reminderEnabled: false, reminderTime: '09:00' }, stats: { todayReviewed: 0, totalReviewed: 0, reviewAccuracy: 0 } },
    stats: { totalCoursesCompleted: 0, totalQuestionsAnswered: 0, totalCorrectAnswers: 0, streakDays: 0, lastActiveDate: '' }
  }));
  
  localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(v2Players));
  
  // 可选：保留旧数据作为备份
  localStorage.setItem('pysparky_players_backup', oldData);
}
```

---

## 7. API 设计 (内部服务接口)

### 7.1 课程服务 API

```typescript
interface CourseServiceAPI {
  // 课程管理
  getAllCourses(): Promise<{ builtin: Course[]; custom: Course[] }>;
  getCourse(id: string): Promise<Course>;
  saveCourse(course: Course): void;
  deleteCourse(id: string): void;
  
  // 进度管理
  getCourseProgress(userId: string, courseId: string): CourseProgress;
  updateLevelProgress(userId: string, courseId: string, levelId: number, progress: LevelProgress): void;
}
```

### 7.2 AI 服务 API

```typescript
interface AIServiceAPI {
  // 内容生成
  generateCourse(request: ContentGenerationRequest): Promise<Course>;
  
  // 验证
  validateCode(code: string, task: string, language: Language): Promise<ValidationResult>;
  validateAnswer(question: Question, answer: unknown, language: Language): Promise<ValidationResultV2>;
  
  // 辅导
  chat(messages: ChatMessage[], context: AIContext): Promise<string>;
  generateSummary(context: SummaryContext): Promise<string>;
}
```

### 7.3 复习服务 API

```typescript
interface ReviewServiceAPI {
  // 复习管理
  getDueReviews(userId: string): ReviewItem[];
  recordReview(userId: string, questionId: string, quality: number): void;
  addToReview(userId: string, questionId: string, courseId: string, levelId: number): void;
  
  // 统计
  getReviewStats(userId: string): ReviewStats;
}
```

---

## 8. 性能优化

### 8.1 代码分割

```typescript
// 路由级别懒加载
const CourseHub = lazy(() => import('./components/course/CourseHub'));
const ReviewDashboard = lazy(() => import('./components/review/ReviewDashboard'));

// 题型组件按需加载
const questionComponents = {
  single_choice: lazy(() => import('./components/questions/SingleChoice')),
  matching: lazy(() => import('./components/questions/Matching')),
  // ...
};
```

### 8.2 课程数据缓存

```typescript
// 使用 IndexedDB 缓存大型课程数据
import { openDB } from 'idb';

const db = await openDB('lalalearn', 1, {
  upgrade(db) {
    db.createObjectStore('courses', { keyPath: 'id' });
  }
});

async function cacheCourse(course: Course) {
  await db.put('courses', course);
}
```

---

## 9. 部署注意事项

### 9.1 环境变量

```bash
# .env.local (本地开发)
API_KEY=your_gemini_api_key

# Zeabur 环境变量
GEMINI_API_KEY=sk-xxx
```

### 9.2 构建配置

```typescript
// vite.config.ts
export default defineConfig({
  // 现有配置保持不变
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'ai': ['@google/generative-ai'],
          'questions': [
            './src/components/questions/SingleChoice',
            './src/components/questions/MultipleChoice',
            // ...
          ]
        }
      }
    }
  }
});
```

---

## 10. 渲染与逻辑分离架构 (ECS-Inspired)

### 10.1 设计理念

借鉴游戏开发中的 ECS (Entity-Component-System) 架构思想，将 **数据(Data)**、**逻辑(Logic)** 和 **渲染(View)** 分离，实现高度解耦。

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ECS-INSPIRED ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐          │
│   │   ENTITY    │     │  COMPONENT  │     │   SYSTEM    │          │
│   │   (数据)     │     │   (状态)    │     │   (逻辑)    │          │
│   └──────┬──────┘     └──────┬──────┘     └──────┬──────┘          │
│          │                   │                   │                  │
│   Course, Level,      UserProgress,       ValidationSystem,        │
│   Question, User      ReviewState,        ScoringSystem,           │
│   (纯数据对象)        GameState           SpacedRepetitionSystem   │
│          │                   │                   │                  │
│          └───────────────────┼───────────────────┘                  │
│                              │                                      │
│                              ▼                                      │
│                    ┌─────────────────┐                             │
│                    │     RENDERER    │                             │
│                    │    (React组件)   │                             │
│                    │   纯展示，无逻辑  │                             │
│                    └─────────────────┘                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 10.2 实现方案

```typescript
// ============================================================
// ENTITIES (纯数据，无方法)
// ============================================================
// 已在 types.ts 中定义: Course, Level, Question, UserState 等

// ============================================================
// SYSTEMS (纯函数，处理逻辑)
// ============================================================

// systems/validationSystem.ts
export const ValidationSystem = {
  validate(question: Question, answer: unknown): ValidationResult {
    // 纯函数，不依赖外部状态
  },
  
  calculateScore(result: ValidationResult, timeSpent: number, config: ScoringConfig): number {
    // 根据配置计算分数
  }
};

// systems/progressSystem.ts
export const ProgressSystem = {
  updateProgress(state: UserStateV2, levelResult: LevelResult): UserStateV2 {
    // 返回新状态，不修改原状态 (Immutable)
  },
  
  checkUnlockConditions(course: Course, progress: CourseProgress): number[] {
    // 返回可解锁的关卡 ID 列表
  }
};

// systems/reviewSystem.ts
export const ReviewSystem = {
  scheduleReview(item: ReviewItem, quality: number): ReviewItem {
    // SM-2 算法
  },
  
  getDueItems(reviewData: ReviewData, now: number): ReviewItem[] {
    // 获取待复习项目
  }
};

// ============================================================
// RENDERERS (纯展示组件)
// ============================================================

// components/renderers/QuestionRenderer.tsx
// 只接收 props，只负责渲染，不含业务逻辑
interface QuestionRendererProps {
  question: Question;
  userAnswer?: unknown;
  showResult: boolean;
  onAnswerChange: (answer: unknown) => void;  // 回调给 Controller
}

// components/renderers/ProgressRenderer.tsx
interface ProgressRendererProps {
  progress: CourseProgress;
  course: Course;
}
```

### 10.3 Controller 层 (连接 System 和 Renderer)

```typescript
// controllers/GameController.ts
// 使用 React Hooks 或 Zustand 管理状态流转

export function useGameController() {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const config = useConfig();  // 从配置加载
  
  const submitAnswer = useCallback((answer: unknown) => {
    // 1. 调用 System 处理逻辑
    const result = ValidationSystem.validate(gameState.currentQuestion, answer);
    const score = ValidationSystem.calculateScore(result, timeSpent, config.scoring);
    
    // 2. 更新状态
    const newProgress = ProgressSystem.updateProgress(gameState.userState, { result, score });
    
    // 3. 触发埋点
    AnalyticsSystem.track('answer_submitted', { questionId, correct: result.correct });
    
    // 4. 更新 State (触发 Renderer 重绘)
    setGameState(prev => ({ ...prev, userState: newProgress }));
  }, [gameState, config]);
  
  return { gameState, submitAnswer, ... };
}
```

### 10.4 改造成本评估

| 改造项 | 当前状态 | 目标状态 | 工作量 | 优先级 |
|-------|---------|---------|-------|-------|
| 类型定义分离 | types.ts 已分离 | ✅ 无需改动 | - | - |
| 验证逻辑抽取 | 在 geminiService 中 | 独立 ValidationSystem | 2h | 高 |
| 进度逻辑抽取 | 在 App.tsx 中 | 独立 ProgressSystem | 3h | 高 |
| 组件纯化 | 混合逻辑+渲染 | 纯 Renderer | 4h | 中 |
| 状态管理 | useState 散落 | 统一 Controller | 3h | 中 |

**总评估**: 约 12 小时，可渐进式改造，优先抽取核心 System。

---

## 11. 全局配置化系统

### 11.1 配置文件结构

```
/config/
├── game.config.json        # 游戏机制配置
├── ui.config.json          # UI/UX 配置
├── ai.config.json          # AI 服务配置
├── audio.config.json       # 音效配置
└── analytics.config.json   # 埋点配置
```

### 11.2 游戏配置 (game.config.json)

```json
{
  "$schema": "./schemas/game.schema.json",
  "version": "2.0.0",
  
  "scoring": {
    "baseScore": 1000,
    "timeBonusMultiplier": 20,
    "starThresholds": {
      "3stars": 0.5,
      "2stars": 0.2,
      "1star": 0
    },
    "xpRewards": {
      "levelComplete1Star": 500,
      "levelComplete2Star": 750,
      "levelComplete3Star": 1000,
      "reviewComplete": 50,
      "streakBonus": 100,
      "courseComplete": 2000
    }
  },
  
  "difficulty": {
    "easy": {
      "timeLimit": 90,
      "hintsAllowed": 3,
      "penaltyMultiplier": 0
    },
    "medium": {
      "timeLimit": 60,
      "hintsAllowed": 2,
      "penaltyMultiplier": 0.1
    },
    "hard": {
      "timeLimit": 45,
      "hintsAllowed": 1,
      "penaltyMultiplier": 0.2
    },
    "expert": {
      "timeLimit": 0,
      "hintsAllowed": 0,
      "penaltyMultiplier": 0.3
    }
  },
  
  "spacedRepetition": {
    "algorithm": "SM2",
    "intervals": [1, 6, 24, 72, 168, 336, 720],
    "defaultEaseFactor": 2.5,
    "minEaseFactor": 1.3,
    "masteryThreshold": 5
  },
  
  "progression": {
    "unlockMode": "sequential",
    "requireStarsToUnlock": 0,
    "allowReplay": true
  }
}
```

### 11.3 AI 配置 (ai.config.json)

```json
{
  "$schema": "./schemas/ai.schema.json",
  "version": "2.0.0",
  
  "providers": {
    "gemini": {
      "enabled": true,
      "priority": 1,
      "models": {
        "default": "gemini-2.5-flash",
        "advanced": "gemini-2.0-pro"
      },
      "endpoints": {
        "zeabur": "https://hnd1.aihub.zeabur.ai/gemini",
        "direct": "https://generativelanguage.googleapis.com"
      },
      "settings": {
        "temperature": 0.7,
        "maxTokens": 2048,
        "timeout": 30000
      }
    },
    "openai": {
      "enabled": false,
      "priority": 2,
      "models": {
        "default": "gpt-4o-mini",
        "advanced": "gpt-4o"
      },
      "endpoint": "https://api.openai.com/v1",
      "settings": {
        "temperature": 0.7,
        "maxTokens": 2048
      }
    },
    "anthropic": {
      "enabled": false,
      "priority": 3,
      "models": {
        "default": "claude-3-haiku",
        "advanced": "claude-sonnet-4"
      },
      "endpoint": "https://api.anthropic.com",
      "settings": {
        "temperature": 0.7,
        "maxTokens": 2048
      }
    },
    "deepseek": {
      "enabled": false,
      "priority": 4,
      "models": {
        "default": "deepseek-chat"
      },
      "endpoint": "https://api.deepseek.com"
    }
  },
  
  "fallback": {
    "enabled": true,
    "maxRetries": 2,
    "retryDelay": 1000
  },
  
  "personas": {
    "gentle": {
      "name": "温柔鼓励型",
      "prompt": "You are a gentle, patient tutor. Use encouraging language and emojis."
    },
    "sarcastic": {
      "name": "毒舌压力型",
      "prompt": "You are a witty, slightly sarcastic tutor. Tease playfully but still help."
    },
    "professional": {
      "name": "专业严谨型",
      "prompt": "You are a serious CS professor. Be precise and academic."
    },
    "concise": {
      "name": "极速效率型",
      "prompt": "You are extremely efficient. Give shortest possible hints."
    },
    "stepbystep": {
      "name": "新手引导型",
      "prompt": "You break everything into Step 1, Step 2, Step 3."
    }
  }
}
```

### 11.4 音效配置 (audio.config.json)

```json
{
  "$schema": "./schemas/audio.schema.json",
  "version": "2.0.0",
  
  "enabled": true,
  "masterVolume": 0.8,
  
  "tts": {
    "provider": "azure",
    "language": "zh-CN",
    "voice": "zh-CN-XiaoxiaoNeural",
    "rate": 1.0,
    "pitch": 1.0
  },
  
  "stt": {
    "provider": "azure",
    "languages": ["zh-CN", "en-US"],
    "continuous": false
  },
  
  "sfx": {
    "click": {
      "url": "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
      "volume": 0.6
    },
    "win": {
      "url": "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3",
      "volume": 0.8
    },
    "lose": {
      "url": "https://assets.mixkit.co/active_storage/sfx/2044/2044-preview.mp3",
      "volume": 0.5
    },
    "tick": {
      "url": "https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3",
      "volume": 0.4
    },
    "start": {
      "url": "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
      "volume": 0.7
    },
    "correct": {
      "url": "/audio/correct.mp3",
      "volume": 0.7
    },
    "badge": {
      "url": "/audio/badge.mp3",
      "volume": 0.8
    }
  }
}
```

### 11.5 配置加载服务

```typescript
// services/configService.ts

import gameConfig from '../config/game.config.json';
import aiConfig from '../config/ai.config.json';
import audioConfig from '../config/audio.config.json';
import analyticsConfig from '../config/analytics.config.json';

export interface AppConfig {
  game: typeof gameConfig;
  ai: typeof aiConfig;
  audio: typeof audioConfig;
  analytics: typeof analyticsConfig;
}

class ConfigService {
  private config: AppConfig;
  private overrides: Partial<AppConfig> = {};
  
  constructor() {
    this.config = {
      game: gameConfig,
      ai: aiConfig,
      audio: audioConfig,
      analytics: analyticsConfig
    };
    
    // 从 localStorage 加载用户覆盖配置
    this.loadOverrides();
  }
  
  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return { ...this.config[key], ...this.overrides[key] };
  }
  
  set<K extends keyof AppConfig>(key: K, value: Partial<AppConfig[K]>): void {
    this.overrides[key] = { ...this.overrides[key], ...value };
    this.saveOverrides();
  }
  
  private loadOverrides(): void {
    const saved = localStorage.getItem('lalalearn_config_overrides');
    if (saved) this.overrides = JSON.parse(saved);
  }
  
  private saveOverrides(): void {
    localStorage.setItem('lalalearn_config_overrides', JSON.stringify(this.overrides));
  }
}

export const configService = new ConfigService();

// React Hook
export function useConfig<K extends keyof AppConfig>(key: K): AppConfig[K] {
  return useMemo(() => configService.get(key), [key]);
}
```

---

## 12. LLM API 抽象层 (多模型支持)

### 12.1 Provider 接口设计

```typescript
// services/llm/types.ts

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequest {
  messages: LLMMessage[];
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'text' | 'json';
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
  model: string;
  provider: string;
}

export interface LLMProvider {
  name: string;
  isAvailable(): boolean;
  chat(request: LLMRequest): Promise<LLMResponse>;
  generateContent(prompt: string): Promise<string>;
}
```

### 12.2 Provider 实现

```typescript
// services/llm/providers/geminiProvider.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { LLMProvider, LLMRequest, LLMResponse } from '../types';
import { configService } from '../../configService';

export class GeminiProvider implements LLMProvider {
  name = 'gemini';
  private client: GoogleGenerativeAI | null = null;
  
  isAvailable(): boolean {
    const config = configService.get('ai').providers.gemini;
    return config.enabled && !!process.env.GEMINI_API_KEY;
  }
  
  private getClient(): GoogleGenerativeAI {
    if (!this.client) {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
      this.client = new GoogleGenerativeAI(apiKey);
    }
    return this.client;
  }
  
  async chat(request: LLMRequest): Promise<LLMResponse> {
    const config = configService.get('ai').providers.gemini;
    const client = this.getClient();
    
    const model = client.getGenerativeModel(
      { model: config.models.default },
      { baseUrl: config.endpoints.zeabur }
    );
    
    // 转换消息格式
    const prompt = request.messages.map(m => 
      `${m.role}: ${m.content}`
    ).join('\n');
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    return {
      content: text,
      model: config.models.default,
      provider: this.name
    };
  }
  
  async generateContent(prompt: string): Promise<string> {
    const response = await this.chat({
      messages: [{ role: 'user', content: prompt }]
    });
    return response.content;
  }
}

// services/llm/providers/openaiProvider.ts
export class OpenAIProvider implements LLMProvider {
  name = 'openai';
  
  isAvailable(): boolean {
    const config = configService.get('ai').providers.openai;
    return config.enabled && !!process.env.OPENAI_API_KEY;
  }
  
  async chat(request: LLMRequest): Promise<LLMResponse> {
    const config = configService.get('ai').providers.openai;
    
    const response = await fetch(`${config.endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.models.default,
        messages: request.messages,
        temperature: request.temperature ?? config.settings.temperature,
        max_tokens: request.maxTokens ?? config.settings.maxTokens
      })
    });
    
    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens
      },
      model: config.models.default,
      provider: this.name
    };
  }
  
  async generateContent(prompt: string): Promise<string> {
    const response = await this.chat({
      messages: [{ role: 'user', content: prompt }]
    });
    return response.content;
  }
}

// 类似实现 AnthropicProvider, DeepSeekProvider...
```

### 12.3 LLM 服务管理器

```typescript
// services/llm/llmService.ts

import { LLMProvider, LLMRequest, LLMResponse } from './types';
import { GeminiProvider } from './providers/geminiProvider';
import { OpenAIProvider } from './providers/openaiProvider';
import { AnthropicProvider } from './providers/anthropicProvider';
import { configService } from '../configService';

class LLMService {
  private providers: Map<string, LLMProvider> = new Map();
  
  constructor() {
    // 注册所有 Provider
    this.registerProvider(new GeminiProvider());
    this.registerProvider(new OpenAIProvider());
    this.registerProvider(new AnthropicProvider());
  }
  
  registerProvider(provider: LLMProvider): void {
    this.providers.set(provider.name, provider);
  }
  
  /**
   * 获取最优可用 Provider (按配置优先级)
   */
  private getAvailableProvider(): LLMProvider {
    const aiConfig = configService.get('ai');
    
    // 按优先级排序
    const sortedProviders = Object.entries(aiConfig.providers)
      .filter(([_, config]) => config.enabled)
      .sort((a, b) => a[1].priority - b[1].priority);
    
    for (const [name] of sortedProviders) {
      const provider = this.providers.get(name);
      if (provider?.isAvailable()) {
        return provider;
      }
    }
    
    throw new Error('No LLM provider available');
  }
  
  /**
   * 带自动 Fallback 的请求
   */
  async chat(request: LLMRequest): Promise<LLMResponse> {
    const aiConfig = configService.get('ai');
    const provider = this.getAvailableProvider();
    
    for (let attempt = 0; attempt <= aiConfig.fallback.maxRetries; attempt++) {
      try {
        return await provider.chat(request);
      } catch (error) {
        console.error(`LLM request failed (attempt ${attempt + 1}):`, error);
        
        if (attempt < aiConfig.fallback.maxRetries) {
          await new Promise(r => setTimeout(r, aiConfig.fallback.retryDelay));
          // 可选：切换到备用 Provider
        }
      }
    }
    
    throw new Error('All LLM request attempts failed');
  }
  
  async generateContent(prompt: string): Promise<string> {
    const response = await this.chat({
      messages: [{ role: 'user', content: prompt }]
    });
    return response.content;
  }
  
  /**
   * 获取当前使用的 Provider 信息
   */
  getCurrentProvider(): { name: string; model: string } {
    const provider = this.getAvailableProvider();
    const config = configService.get('ai').providers[provider.name];
    return {
      name: provider.name,
      model: config.models.default
    };
  }
}

export const llmService = new LLMService();
```

---

## 13. 数据埋点与分析系统

### 13.1 系统架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ANALYTICS SYSTEM ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │   用户行为    │───▶│  事件收集器   │───▶│  本地存储    │          │
│  │  (UI Events) │    │ (Collector)  │    │ (IndexedDB) │          │
│  └──────────────┘    └──────────────┘    └──────┬───────┘          │
│                                                  │                  │
│                                                  ▼                  │
│                                         ┌──────────────┐            │
│                                         │   分析引擎   │            │
│                                         │  (Analyzer)  │            │
│                                         └──────┬───────┘            │
│                                                │                    │
│                      ┌─────────────────────────┼───────────────┐   │
│                      ▼                         ▼               ▼   │
│               ┌──────────┐            ┌──────────┐     ┌─────────┐ │
│               │ 留存分析 │            │ 漏斗分析 │     │ 热点图  │ │
│               └──────────┘            └──────────┘     └─────────┘ │
│                                                                     │
│                              ┌──────────────┐                      │
│                              │  管理后台    │                      │
│                              │ (Dashboard)  │                      │
│                              └──────────────┘                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 13.2 事件类型定义

```typescript
// services/analytics/types.ts

/** 事件类别 */
export type EventCategory = 
  | 'navigation'    // 导航
  | 'interaction'   // 交互
  | 'learning'      // 学习
  | 'achievement'   // 成就
  | 'error'         // 错误
  | 'performance';  // 性能

/** 基础事件 */
export interface AnalyticsEvent {
  id: string;
  timestamp: number;
  userId: string;
  sessionId: string;
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

/** 预定义事件 */
export const EVENTS = {
  // 导航事件
  PAGE_VIEW: 'page_view',
  COURSE_SELECT: 'course_select',
  LEVEL_ENTER: 'level_enter',
  LEVEL_EXIT: 'level_exit',
  
  // 学习事件
  ANSWER_SUBMIT: 'answer_submit',
  ANSWER_CORRECT: 'answer_correct',
  ANSWER_WRONG: 'answer_wrong',
  HINT_REQUEST: 'hint_request',
  AI_CHAT: 'ai_chat',
  
  // 复习事件
  REVIEW_START: 'review_start',
  REVIEW_COMPLETE: 'review_complete',
  
  // 成就事件
  LEVEL_COMPLETE: 'level_complete',
  COURSE_COMPLETE: 'course_complete',
  BADGE_EARNED: 'badge_earned',
  STREAK_ACHIEVED: 'streak_achieved',
  
  // 卡点事件 (重要!)
  LEVEL_FAIL: 'level_fail',
  TIMEOUT: 'timeout',
  ABANDON: 'abandon',
  RETRY_MANY: 'retry_many',
  
  // 用户行为
  SETTINGS_CHANGE: 'settings_change',
  VOICE_USED: 'voice_used',
  
  // 错误
  API_ERROR: 'api_error',
  UI_ERROR: 'ui_error'
} as const;

/** 会话数据 */
export interface SessionData {
  sessionId: string;
  userId: string;
  startTime: number;
  endTime?: number;
  events: AnalyticsEvent[];
  
  // 汇总
  summary: {
    pagesViewed: number;
    levelsAttempted: number;
    levelsCompleted: number;
    questionsAnswered: number;
    correctAnswers: number;
    hintsUsed: number;
    timeSpent: number;
  };
}
```

### 13.3 事件收集服务

```typescript
// services/analytics/analyticsService.ts

import { openDB, IDBPDatabase } from 'idb';
import { AnalyticsEvent, SessionData, EVENTS } from './types';
import { v4 as uuid } from 'uuid';

class AnalyticsService {
  private db: IDBPDatabase | null = null;
  private sessionId: string;
  private userId: string = '';
  private eventQueue: AnalyticsEvent[] = [];
  private flushInterval: number = 5000; // 5秒批量写入
  
  constructor() {
    this.sessionId = uuid();
    this.initDB();
    this.startFlushTimer();
  }
  
  private async initDB(): Promise<void> {
    this.db = await openDB('lalalearn_analytics', 1, {
      upgrade(db) {
        // 事件存储
        const eventStore = db.createObjectStore('events', { keyPath: 'id' });
        eventStore.createIndex('timestamp', 'timestamp');
        eventStore.createIndex('userId', 'userId');
        eventStore.createIndex('category', 'category');
        eventStore.createIndex('action', 'action');
        
        // 会话存储
        const sessionStore = db.createObjectStore('sessions', { keyPath: 'sessionId' });
        sessionStore.createIndex('userId', 'userId');
        sessionStore.createIndex('startTime', 'startTime');
        
        // 聚合数据
        db.createObjectStore('aggregates', { keyPath: 'id' });
      }
    });
  }
  
  setUser(userId: string): void {
    this.userId = userId;
  }
  
  /**
   * 核心埋点方法
   */
  track(
    action: string,
    metadata?: Record<string, unknown>,
    category: EventCategory = 'interaction'
  ): void {
    const event: AnalyticsEvent = {
      id: uuid(),
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
      category,
      action,
      metadata
    };
    
    this.eventQueue.push(event);
    
    // 重要事件立即写入
    if (['level_complete', 'course_complete', 'api_error'].includes(action)) {
      this.flush();
    }
  }
  
  // 便捷方法
  trackPageView(page: string): void {
    this.track(EVENTS.PAGE_VIEW, { page }, 'navigation');
  }
  
  trackLearning(action: string, data: {
    courseId: string;
    levelId: number;
    questionId?: string;
    correct?: boolean;
    timeSpent?: number;
  }): void {
    this.track(action, data, 'learning');
  }
  
  trackError(error: Error, context?: Record<string, unknown>): void {
    this.track(EVENTS.UI_ERROR, {
      message: error.message,
      stack: error.stack,
      ...context
    }, 'error');
  }
  
  /**
   * 批量写入数据库
   */
  private async flush(): Promise<void> {
    if (!this.db || this.eventQueue.length === 0) return;
    
    const events = [...this.eventQueue];
    this.eventQueue = [];
    
    const tx = this.db.transaction('events', 'readwrite');
    await Promise.all([
      ...events.map(e => tx.store.add(e)),
      tx.done
    ]);
  }
  
  private startFlushTimer(): void {
    setInterval(() => this.flush(), this.flushInterval);
    
    // 页面关闭前写入
    window.addEventListener('beforeunload', () => {
      this.flush();
      this.endSession();
    });
  }
  
  private async endSession(): Promise<void> {
    // 保存会话汇总
  }
  
  /**
   * 数据导出 (用于后台分析)
   */
  async exportData(startTime?: number, endTime?: number): Promise<AnalyticsEvent[]> {
    if (!this.db) return [];
    
    const tx = this.db.transaction('events', 'readonly');
    const index = tx.store.index('timestamp');
    
    const range = IDBKeyRange.bound(
      startTime || 0,
      endTime || Date.now()
    );
    
    return await index.getAll(range);
  }
}

export const analytics = new AnalyticsService();

// React Hook
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackLearning: analytics.trackLearning.bind(analytics)
  };
}
```

### 13.4 分析引擎

```typescript
// services/analytics/analyzer.ts

import { AnalyticsEvent, EVENTS } from './types';
import { analytics } from './analyticsService';

export interface AnalyticsReport {
  period: { start: number; end: number };
  
  // 用户统计
  users: {
    total: number;
    active: number;
    new: number;
  };
  
  // 留存分析
  retention: {
    day1: number;
    day7: number;
    day30: number;
  };
  
  // 功能使用排名
  featureUsage: {
    feature: string;
    count: number;
    uniqueUsers: number;
  }[];
  
  // 卡点分析
  painPoints: {
    levelId: number;
    courseId: string;
    failRate: number;
    avgAttempts: number;
    dropOffRate: number;
  }[];
  
  // 学习效果
  learningMetrics: {
    avgCompletionRate: number;
    avgCorrectRate: number;
    avgTimePerLevel: number;
    reviewCompletionRate: number;
  };
  
  // AI 使用
  aiUsage: {
    chatCount: number;
    hintCount: number;
    avgChatLength: number;
  };
}

export class AnalyticsAnalyzer {
  /**
   * 生成综合报告
   */
  async generateReport(startTime: number, endTime: number): Promise<AnalyticsReport> {
    const events = await analytics.exportData(startTime, endTime);
    
    return {
      period: { start: startTime, end: endTime },
      users: this.analyzeUsers(events),
      retention: await this.analyzeRetention(events),
      featureUsage: this.analyzeFeatureUsage(events),
      painPoints: this.analyzePainPoints(events),
      learningMetrics: this.analyzeLearning(events),
      aiUsage: this.analyzeAIUsage(events)
    };
  }
  
  /**
   * 卡点分析 (重点功能)
   */
  private analyzePainPoints(events: AnalyticsEvent[]) {
    const levelStats: Map<string, {
      attempts: number;
      failures: number;
      completions: number;
      dropOffs: number;
    }> = new Map();
    
    // 统计每个关卡的尝试、失败、完成
    events.forEach(e => {
      if (e.action === EVENTS.LEVEL_ENTER || 
          e.action === EVENTS.LEVEL_FAIL || 
          e.action === EVENTS.LEVEL_COMPLETE) {
        const key = `${e.metadata?.courseId}-${e.metadata?.levelId}`;
        const stats = levelStats.get(key) || { attempts: 0, failures: 0, completions: 0, dropOffs: 0 };
        
        if (e.action === EVENTS.LEVEL_ENTER) stats.attempts++;
        if (e.action === EVENTS.LEVEL_FAIL) stats.failures++;
        if (e.action === EVENTS.LEVEL_COMPLETE) stats.completions++;
        
        levelStats.set(key, stats);
      }
    });
    
    // 计算失败率并排序
    return Array.from(levelStats.entries())
      .map(([key, stats]) => {
        const [courseId, levelId] = key.split('-');
        return {
          levelId: Number(levelId),
          courseId,
          failRate: stats.failures / stats.attempts,
          avgAttempts: stats.attempts / Math.max(stats.completions, 1),
          dropOffRate: 1 - (stats.completions / stats.attempts)
        };
      })
      .sort((a, b) => b.failRate - a.failRate)
      .slice(0, 10);
  }
  
  /**
   * 功能使用热度
   */
  private analyzeFeatureUsage(events: AnalyticsEvent[]) {
    const usage: Map<string, { count: number; users: Set<string> }> = new Map();
    
    events.forEach(e => {
      const feature = e.action;
      const stats = usage.get(feature) || { count: 0, users: new Set() };
      stats.count++;
      stats.users.add(e.userId);
      usage.set(feature, stats);
    });
    
    return Array.from(usage.entries())
      .map(([feature, stats]) => ({
        feature,
        count: stats.count,
        uniqueUsers: stats.users.size
      }))
      .sort((a, b) => b.count - a.count);
  }
  
  // ... 其他分析方法
}

export const analyzer = new AnalyticsAnalyzer();
```

### 13.5 管理后台组件

```typescript
// components/admin/AnalyticsDashboard.tsx

import React, { useState, useEffect } from 'react';
import { analyzer, AnalyticsReport } from '../../services/analytics/analyzer';
import { BarChart, LineChart, PieChart } from 'recharts'; // 或其他图表库

export const AnalyticsDashboard: React.FC = () => {
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [dateRange, setDateRange] = useState({ start: Date.now() - 7*24*60*60*1000, end: Date.now() });
  
  useEffect(() => {
    analyzer.generateReport(dateRange.start, dateRange.end).then(setReport);
  }, [dateRange]);
  
  if (!report) return <div>Loading...</div>;
  
  return (
    <div className="analytics-dashboard p-6 bg-slate-900">
      <h1 className="text-2xl font-bold mb-6">📊 学习数据分析</h1>
      
      {/* 时间选择器 */}
      <DateRangePicker value={dateRange} onChange={setDateRange} />
      
      {/* 概览卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard title="活跃用户" value={report.users.active} />
        <StatCard title="平均完成率" value={`${(report.learningMetrics.avgCompletionRate * 100).toFixed(1)}%`} />
        <StatCard title="平均正确率" value={`${(report.learningMetrics.avgCorrectRate * 100).toFixed(1)}%`} />
        <StatCard title="AI 对话次数" value={report.aiUsage.chatCount} />
      </div>
      
      {/* 卡点分析 (重点!) */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">⚠️ 卡点关卡 (需关注)</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th>关卡</th>
              <th>失败率</th>
              <th>平均尝试</th>
              <th>流失率</th>
            </tr>
          </thead>
          <tbody>
            {report.painPoints.map(p => (
              <tr key={`${p.courseId}-${p.levelId}`} className={p.failRate > 0.5 ? 'bg-red-900/30' : ''}>
                <td>{p.courseId} - Level {p.levelId}</td>
                <td>{(p.failRate * 100).toFixed(1)}%</td>
                <td>{p.avgAttempts.toFixed(1)}</td>
                <td>{(p.dropOffRate * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      
      {/* 功能使用热度 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">🔥 功能使用热度</h2>
        <BarChart data={report.featureUsage.slice(0, 10)} />
      </section>
      
      {/* 留存曲线 */}
      <section>
        <h2 className="text-xl font-bold mb-4">📈 用户留存</h2>
        <LineChart data={[
          { day: 'D1', rate: report.retention.day1 },
          { day: 'D7', rate: report.retention.day7 },
          { day: 'D30', rate: report.retention.day30 }
        ]} />
      </section>
    </div>
  );
};
```

---

## 14. 网页内容爬虫服务

### 14.1 功能需求

用户输入文档网站首页（如 `https://zeabur.com/docs/zh-CN`），系统自动：
1. 分析页面结构，提取所有文档链接
2. 递归抓取所有子页面内容
3. 清洗并合并内容
4. 送给 AI 生成课程题库

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CONTENT CRAWLER FLOW                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   用户输入                                                           │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  https://zeabur.com/docs/zh-CN                              │  │
│   └───────────────────────────┬─────────────────────────────────┘  │
│                               │                                     │
│                               ▼                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  1️⃣ 链接提取器                                               │  │
│   │  • 解析导航菜单/侧边栏                                        │  │
│   │  • 提取所有文档 URL                                          │  │
│   │  • 去重 & 过滤外部链接                                        │  │
│   └───────────────────────────┬─────────────────────────────────┘  │
│                               │                                     │
│                               ▼                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  2️⃣ 内容抓取器 (并发)                                         │  │
│   │  • 批量请求页面                                               │  │
│   │  • 提取正文内容                                               │  │
│   │  • 移除导航/页脚噪音                                          │  │
│   └───────────────────────────┬─────────────────────────────────┘  │
│                               │                                     │
│                               ▼                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  3️⃣ 内容清洗器                                               │  │
│   │  • HTML → Markdown/Text                                     │  │
│   │  • 保留标题层级                                               │  │
│   │  • 合并为结构化文档                                           │  │
│   └───────────────────────────┬─────────────────────────────────┘  │
│                               │                                     │
│                               ▼                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  4️⃣ AI 生成课程                                              │  │
│   │  • 分析知识点                                                 │  │
│   │  • 生成题库                                                   │  │
│   │  • 输出 Course JSON                                          │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 14.2 技术方案对比

由于浏览器 CORS 限制，纯前端无法直接抓取其他网站，需要借助以下方案：

| 方案 | 优点 | 缺点 | 推荐场景 |
|-----|------|------|---------|
| **Jina Reader API** | 免费、简单、返回 Markdown | 单页抓取，需自行处理链接 | ✅ 推荐 |
| **Firecrawl API** | 专业爬虫、支持递归 | 付费服务 | 企业级 |
| **Zeabur Serverless** | 自主可控 | 需要部署后端 | 深度定制 |
| **本地 CLI 脚本** | 无限制 | 用户需手动运行 | 技术用户 |

### 14.3 推荐方案：Jina Reader + 链接解析

[Jina Reader](https://jina.ai/reader/) 提供免费的网页转 Markdown 服务，只需在 URL 前加 `https://r.jina.ai/`：

```typescript
// 原始 URL
const url = 'https://zeabur.com/docs/zh-CN/deploy/create-project';

// Jina Reader URL
const readerUrl = `https://r.jina.ai/${url}`;

// 返回干净的 Markdown 内容
const response = await fetch(readerUrl);
const markdown = await response.text();
```

### 14.4 爬虫服务实现

```typescript
// services/crawler/crawlerService.ts

import { configService } from '../configService';

export interface CrawlOptions {
  maxPages: number;          // 最大抓取页数
  maxDepth: number;          // 最大递归深度
  delay: number;             // 请求间隔 (ms)
  includePatterns?: RegExp[]; // URL 包含模式
  excludePatterns?: RegExp[]; // URL 排除模式
}

export interface CrawlResult {
  url: string;
  title: string;
  content: string;
  links: string[];
}

export interface CrawlProgress {
  total: number;
  completed: number;
  current: string;
  status: 'crawling' | 'done' | 'error';
}

class CrawlerService {
  private defaultOptions: CrawlOptions = {
    maxPages: 50,
    maxDepth: 3,
    delay: 500,
    excludePatterns: [
      /\.(png|jpg|gif|svg|pdf|zip)$/i,
      /#.*/,  // 锚点
    ]
  };

  /**
   * 使用 Jina Reader 抓取单页内容
   */
  async fetchPage(url: string): Promise<CrawlResult> {
    const readerUrl = `https://r.jina.ai/${url}`;
    
    const response = await fetch(readerUrl, {
      headers: {
        'Accept': 'text/markdown'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${url}`);
    }
    
    const content = await response.text();
    
    // 提取标题 (第一个 # 标题)
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : url;
    
    // 提取内部链接
    const links = this.extractLinks(content, url);
    
    return { url, title, content, links };
  }

  /**
   * 从 Markdown 内容提取链接
   */
  private extractLinks(markdown: string, baseUrl: string): string[] {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links: Set<string> = new Set();
    const baseOrigin = new URL(baseUrl).origin;
    const basePath = new URL(baseUrl).pathname.split('/').slice(0, -1).join('/');
    
    let match;
    while ((match = linkRegex.exec(markdown)) !== null) {
      let href = match[2];
      
      // 跳过外部链接和锚点
      if (href.startsWith('http') && !href.startsWith(baseOrigin)) continue;
      if (href.startsWith('#')) continue;
      
      // 处理相对路径
      if (href.startsWith('/')) {
        href = baseOrigin + href;
      } else if (!href.startsWith('http')) {
        href = baseOrigin + basePath + '/' + href;
      }
      
      links.add(href);
    }
    
    return Array.from(links);
  }

  /**
   * 递归抓取整个文档站点
   */
  async crawlSite(
    startUrl: string, 
    options: Partial<CrawlOptions> = {},
    onProgress?: (progress: CrawlProgress) => void
  ): Promise<CrawlResult[]> {
    const opts = { ...this.defaultOptions, ...options };
    const visited: Set<string> = new Set();
    const results: CrawlResult[] = [];
    const queue: { url: string; depth: number }[] = [{ url: startUrl, depth: 0 }];
    
    while (queue.length > 0 && results.length < opts.maxPages) {
      const { url, depth } = queue.shift()!;
      
      // 跳过已访问
      if (visited.has(url)) continue;
      visited.add(url);
      
      // 检查深度
      if (depth > opts.maxDepth) continue;
      
      // 检查排除模式
      if (opts.excludePatterns?.some(p => p.test(url))) continue;
      
      // 检查包含模式
      if (opts.includePatterns?.length && !opts.includePatterns.some(p => p.test(url))) continue;
      
      // 更新进度
      onProgress?.({
        total: visited.size + queue.length,
        completed: results.length,
        current: url,
        status: 'crawling'
      });
      
      try {
        const result = await this.fetchPage(url);
        results.push(result);
        
        // 添加新链接到队列
        for (const link of result.links) {
          if (!visited.has(link)) {
            queue.push({ url: link, depth: depth + 1 });
          }
        }
        
        // 请求间隔
        await new Promise(r => setTimeout(r, opts.delay));
        
      } catch (error) {
        console.error(`Failed to crawl: ${url}`, error);
      }
    }
    
    onProgress?.({
      total: results.length,
      completed: results.length,
      current: '',
      status: 'done'
    });
    
    return results;
  }

  /**
   * 合并抓取结果为单一文档
   */
  mergeResults(results: CrawlResult[]): string {
    let merged = '';
    
    for (const result of results) {
      merged += `\n\n---\n\n`;
      merged += `# ${result.title}\n\n`;
      merged += `来源: ${result.url}\n\n`;
      merged += result.content;
    }
    
    return merged.trim();
  }

  /**
   * 估算抓取内容的 Token 数 (粗略)
   */
  estimateTokens(content: string): number {
    // 粗略估算：中文约 0.5 token/字，英文约 0.25 token/word
    const chineseChars = (content.match(/[\u4e00-\u9fff]/g) || []).length;
    const words = content.split(/\s+/).length;
    return Math.round(chineseChars * 0.5 + words * 0.25);
  }
}

export const crawlerService = new CrawlerService();
```

### 14.5 智能分段处理

当内容过长超过 LLM Token 限制时，需要分段处理：

```typescript
// services/crawler/contentSplitter.ts

export interface ContentChunk {
  index: number;
  content: string;
  source: string;
  tokens: number;
}

/**
 * 按 Token 限制分割内容
 */
export function splitContent(
  results: CrawlResult[],
  maxTokensPerChunk: number = 8000
): ContentChunk[] {
  const chunks: ContentChunk[] = [];
  let currentChunk = '';
  let currentTokens = 0;
  let currentSources: string[] = [];
  
  for (const result of results) {
    const content = `## ${result.title}\n\n${result.content}\n\n`;
    const tokens = estimateTokens(content);
    
    if (currentTokens + tokens > maxTokensPerChunk && currentChunk) {
      // 保存当前块
      chunks.push({
        index: chunks.length,
        content: currentChunk,
        source: currentSources.join(', '),
        tokens: currentTokens
      });
      currentChunk = '';
      currentTokens = 0;
      currentSources = [];
    }
    
    currentChunk += content;
    currentTokens += tokens;
    currentSources.push(result.url);
  }
  
  // 最后一块
  if (currentChunk) {
    chunks.push({
      index: chunks.length,
      content: currentChunk,
      source: currentSources.join(', '),
      tokens: currentTokens
    });
  }
  
  return chunks;
}

/**
 * 分块生成课程 (大型文档站点)
 */
export async function generateCourseFromChunks(
  chunks: ContentChunk[],
  options: GenerationOptions
): Promise<Course> {
  const allLevels: Level[] = [];
  
  for (const chunk of chunks) {
    // 为每个分块生成题目
    const partialCourse = await contentGenerator.generateFromText(
      chunk.content,
      {
        ...options,
        questionCount: Math.ceil(options.questionCount / chunks.length)
      }
    );
    
    allLevels.push(...partialCourse.modules[0].levels);
  }
  
  // 重新编号并排序
  allLevels.forEach((level, i) => {
    level.id = i + 1;
  });
  
  // 按难度排序
  allLevels.sort((a, b) => 
    DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]
  );
  
  return {
    id: `crawled-${Date.now()}`,
    name: '自动生成课程',
    modules: [{ id: 'main', name: '主模块', levels: allLevels }],
    // ...
  };
}
```

### 14.6 Zeabur 文档专用适配器

针对 Zeabur 文档结构的优化适配：

```typescript
// services/crawler/adapters/zeaburAdapter.ts

/**
 * Zeabur 文档站点适配器
 * 基于文档结构: https://zeabur.com/docs/zh-CN
 */
export class ZeaburDocsAdapter {
  private baseUrl = 'https://zeabur.com/docs';
  
  /**
   * 获取文档目录结构
   * Zeabur 使用 VitePress/Docusaurus 类似框架，导航在侧边栏
   */
  async getDocumentTree(lang: 'zh-CN' | 'en' = 'zh-CN'): Promise<DocNode[]> {
    const indexUrl = `${this.baseUrl}/${lang}`;
    const result = await crawlerService.fetchPage(indexUrl);
    
    // 解析侧边栏导航结构
    // Zeabur 文档结构：
    // - 基本介绍
    // - 快速开始
    // - 部署 (子目录)
    //   - 创建项目
    //   - Dockerfile 部署
    //   - ...
    
    return this.parseNavigation(result.content);
  }
  
  /**
   * 按章节分组抓取
   */
  async crawlBySection(
    sections: string[],  // ['deploy', 'template', 'network']
    lang: 'zh-CN' | 'en' = 'zh-CN',
    onProgress?: (progress: CrawlProgress) => void
  ): Promise<CrawlResult[]> {
    const allResults: CrawlResult[] = [];
    
    for (const section of sections) {
      const sectionUrl = `${this.baseUrl}/${lang}/${section}`;
      const results = await crawlerService.crawlSite(sectionUrl, {
        maxPages: 20,
        maxDepth: 2,
        includePatterns: [new RegExp(`/docs/${lang}/${section}`)]
      }, onProgress);
      
      allResults.push(...results);
    }
    
    return allResults;
  }
  
  /**
   * 快速模式：只抓取主要页面
   */
  async quickCrawl(lang: 'zh-CN' | 'en' = 'zh-CN'): Promise<CrawlResult[]> {
    const keyPages = [
      '',                    // 首页/介绍
      '/deploy/create-project',
      '/deploy/environment-variables',
      '/deploy/dockerfile',
      '/networking/public',
      '/template',
      '/pricing'
    ];
    
    const results: CrawlResult[] = [];
    
    for (const page of keyPages) {
      try {
        const result = await crawlerService.fetchPage(
          `${this.baseUrl}/${lang}${page}`
        );
        results.push(result);
        await new Promise(r => setTimeout(r, 300));
      } catch (e) {
        console.warn(`Skip: ${page}`);
      }
    }
    
    return results;
  }
}

export const zeaburAdapter = new ZeaburDocsAdapter();
```

### 14.7 UI 集成

```typescript
// components/course/CrawlerImport.tsx

import React, { useState } from 'react';
import { crawlerService, CrawlProgress } from '../../services/crawler/crawlerService';
import { Globe, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface CrawlerImportProps {
  onComplete: (content: string) => void;
}

export const CrawlerImport: React.FC<CrawlerImportProps> = ({ onComplete }) => {
  const [url, setUrl] = useState('');
  const [progress, setProgress] = useState<CrawlProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const presets = [
    { name: 'Zeabur 文档', url: 'https://zeabur.com/docs/zh-CN' },
    { name: 'React 文档', url: 'https://react.dev/learn' },
    { name: 'Vite 文档', url: 'https://vitejs.dev/guide/' },
  ];
  
  const handleCrawl = async () => {
    setError(null);
    setProgress({ total: 0, completed: 0, current: url, status: 'crawling' });
    
    try {
      const results = await crawlerService.crawlSite(url, {
        maxPages: 30,
        maxDepth: 2
      }, setProgress);
      
      const merged = crawlerService.mergeResults(results);
      const tokens = crawlerService.estimateTokens(merged);
      
      console.log(`Crawled ${results.length} pages, ~${tokens} tokens`);
      
      onComplete(merged);
    } catch (e) {
      setError(e instanceof Error ? e.message : '抓取失败');
      setProgress(null);
    }
  };
  
  return (
    <div className="crawler-import p-6 bg-slate-800 rounded-xl">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Globe className="text-blue-400" />
        从网站导入文档
      </h3>
      
      {/* 预设快捷按钮 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {presets.map(preset => (
          <button
            key={preset.url}
            onClick={() => setUrl(preset.url)}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
          >
            {preset.name}
          </button>
        ))}
      </div>
      
      {/* URL 输入 */}
      <div className="flex gap-2 mb-4">
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://example.com/docs"
          className="flex-1 px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg"
        />
        <button
          onClick={handleCrawl}
          disabled={!url || progress?.status === 'crawling'}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold disabled:opacity-50"
        >
          {progress?.status === 'crawling' ? (
            <Loader2 className="animate-spin" />
          ) : (
            '抓取'
          )}
        </button>
      </div>
      
      {/* 进度显示 */}
      {progress && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            {progress.status === 'crawling' && <Loader2 size={14} className="animate-spin" />}
            {progress.status === 'done' && <CheckCircle size={14} className="text-green-400" />}
            <span>已抓取 {progress.completed} 页</span>
          </div>
          <div className="text-xs text-slate-400 truncate">
            {progress.current}
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${(progress.completed / Math.max(progress.total, 1)) * 100}%` }}
            />
          </div>
        </div>
      )}
      
      {/* 错误提示 */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm mt-2">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
      
      {/* 使用说明 */}
      <div className="mt-4 text-xs text-slate-500">
        💡 输入文档网站首页，系统将自动抓取所有子页面并生成学习课程
      </div>
    </div>
  );
};
```

### 14.8 配置选项

```json
// config/crawler.config.json
{
  "enabled": true,
  "provider": "jina",
  
  "jina": {
    "baseUrl": "https://r.jina.ai",
    "timeout": 30000
  },
  
  "defaults": {
    "maxPages": 50,
    "maxDepth": 3,
    "delay": 500,
    "maxTokensPerChunk": 8000
  },
  
  "presets": [
    {
      "name": "Zeabur 文档",
      "url": "https://zeabur.com/docs/zh-CN",
      "icon": "☁️",
      "recommended": true
    },
    {
      "name": "React 官方文档",
      "url": "https://react.dev/learn",
      "icon": "⚛️"
    }
  ],
  
  "excludePatterns": [
    "\\.png$",
    "\\.jpg$",
    "\\.gif$",
    "\\.svg$",
    "\\.pdf$",
    "#.*"
  ]
}
```

---

## 15. 语音服务设计

### 14.1 语音 API 推荐

| 服务商 | TTS 音质 | STT 中英文 | 价格 | 推荐场景 |
|-------|---------|-----------|------|---------|
| **Azure Speech** | ⭐⭐⭐⭐⭐ 极佳 | ✅ 多语言 | 中等 | 最佳综合体验 |
| **Google Cloud TTS** | ⭐⭐⭐⭐ 优秀 | ✅ 多语言 | 中等 | WaveNet 音质好 |
| **ElevenLabs** | ⭐⭐⭐⭐⭐ 顶级 | ❌ 仅 TTS | 较贵 | 追求极致音质 |
| **OpenAI Whisper** | - | ⭐⭐⭐⭐⭐ 极佳 | 便宜 | STT 首选 |
| **Web Speech API** | ⭐⭐⭐ 一般 | ⭐⭐⭐ 基础 | 免费 | 预算有限 |
| **阿里云语音** | ⭐⭐⭐⭐ 优秀 | ✅ 中文优 | 便宜 | 中文场景 |

### 14.2 推荐方案

```
最佳体验方案 (推荐):
┌────────────────────────────────────────────────────────┐
│  TTS: Azure Speech (zh-CN-XiaoxiaoNeural)             │
│  - 自然度高，情感丰富，支持多种风格                      │
│  - 支持 SSML 控制语速、语调、停顿                       │
│                                                        │
│  STT: Azure Speech / OpenAI Whisper                   │
│  - 中英文混合识别效果好                                 │
│  - 实时流式识别                                        │
└────────────────────────────────────────────────────────┘

预算友好方案:
┌────────────────────────────────────────────────────────┐
│  TTS: Web Speech API (浏览器内置)                      │
│  - 免费，无需配置                                       │
│  - 音质一般，但足够使用                                 │
│                                                        │
│  STT: Web Speech API                                   │
│  - 免费，浏览器内置                                     │
│  - Chrome 支持较好                                     │
└────────────────────────────────────────────────────────┘
```

### 14.3 语音服务抽象

```typescript
// services/speech/types.ts

export interface TTSOptions {
  text: string;
  language: 'zh-CN' | 'en-US';
  voice?: string;
  rate?: number;
  pitch?: number;
  style?: 'cheerful' | 'friendly' | 'professional' | 'calm';
}

export interface STTOptions {
  languages: string[];
  continuous?: boolean;
  interimResults?: boolean;
}

export interface STTResult {
  text: string;
  confidence: number;
  isFinal: boolean;
}

export interface SpeechProvider {
  name: string;
  
  // TTS
  speak(options: TTSOptions): Promise<void>;
  stopSpeaking(): void;
  
  // STT
  startListening(options: STTOptions, callback: (result: STTResult) => void): void;
  stopListening(): void;
}
```

### 14.4 Azure Speech 实现

```typescript
// services/speech/providers/azureSpeechProvider.ts

import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { SpeechProvider, TTSOptions, STTOptions, STTResult } from '../types';
import { configService } from '../../configService';

export class AzureSpeechProvider implements SpeechProvider {
  name = 'azure';
  private synthesizer: SpeechSDK.SpeechSynthesizer | null = null;
  private recognizer: SpeechSDK.SpeechRecognizer | null = null;
  
  private getConfig(): SpeechSDK.SpeechConfig {
    const key = process.env.AZURE_SPEECH_KEY || '';
    const region = process.env.AZURE_SPEECH_REGION || 'eastasia';
    return SpeechSDK.SpeechConfig.fromSubscription(key, region);
  }
  
  async speak(options: TTSOptions): Promise<void> {
    const config = this.getConfig();
    
    // 设置语音
    const voiceMap: Record<string, string> = {
      'zh-CN': 'zh-CN-XiaoxiaoNeural',
      'en-US': 'en-US-JennyNeural'
    };
    config.speechSynthesisVoiceName = options.voice || voiceMap[options.language];
    
    // SSML 支持更丰富的控制
    const ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${options.language}">
        <voice name="${config.speechSynthesisVoiceName}">
          <prosody rate="${options.rate || 1.0}" pitch="${options.pitch || 0}%">
            ${options.style ? `<mstts:express-as style="${options.style}">` : ''}
            ${options.text}
            ${options.style ? '</mstts:express-as>' : ''}
          </prosody>
        </voice>
      </speak>
    `;
    
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    this.synthesizer = new SpeechSDK.SpeechSynthesizer(config, audioConfig);
    
    return new Promise((resolve, reject) => {
      this.synthesizer!.speakSsmlAsync(
        ssml,
        result => {
          if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
            resolve();
          } else {
            reject(new Error('Speech synthesis failed'));
          }
        },
        reject
      );
    });
  }
  
  stopSpeaking(): void {
    this.synthesizer?.close();
    this.synthesizer = null;
  }
  
  startListening(options: STTOptions, callback: (result: STTResult) => void): void {
    const config = this.getConfig();
    
    // 多语言识别
    const autoDetect = SpeechSDK.AutoDetectSourceLanguageConfig.fromLanguages(options.languages);
    
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    this.recognizer = SpeechSDK.SpeechRecognizer.FromConfig(config, autoDetect, audioConfig);
    
    // 识别回调
    this.recognizer.recognizing = (_, event) => {
      callback({
        text: event.result.text,
        confidence: 0.5,
        isFinal: false
      });
    };
    
    this.recognizer.recognized = (_, event) => {
      if (event.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        callback({
          text: event.result.text,
          confidence: 1.0,
          isFinal: true
        });
      }
    };
    
    if (options.continuous) {
      this.recognizer.startContinuousRecognitionAsync();
    } else {
      this.recognizer.recognizeOnceAsync();
    }
  }
  
  stopListening(): void {
    this.recognizer?.stopContinuousRecognitionAsync();
    this.recognizer?.close();
    this.recognizer = null;
  }
}
```

### 14.5 配置示例

```json
// config/audio.config.json (更新)

{
  "tts": {
    "provider": "azure",
    "voices": {
      "zh-CN": {
        "default": "zh-CN-XiaoxiaoNeural",
        "alternatives": [
          "zh-CN-YunxiNeural",
          "zh-CN-XiaoyiNeural"
        ]
      },
      "en-US": {
        "default": "en-US-JennyNeural",
        "alternatives": [
          "en-US-GuyNeural",
          "en-US-AriaNeural"
        ]
      }
    },
    "styles": {
      "coach_gentle": { "style": "friendly", "rate": 0.9 },
      "coach_sarcastic": { "style": "cheerful", "rate": 1.1 },
      "coach_professional": { "style": "professional", "rate": 1.0 }
    }
  },
  
  "stt": {
    "provider": "azure",
    "languages": ["zh-CN", "en-US"],
    "autoDetect": true,
    "continuous": false,
    "timeout": 10000
  }
}
```

---

## 15. 向后兼容性

### 10.1 保持 v1 功能完整

| v1 功能 | v2 状态 | 说明 |
|--------|--------|------|
| Python 题库 (A/B/C) | ✅ 保持 | 迁移为预置课程 |
| 代码编辑器 | ✅ 保持 | 无改动 |
| Vibe 教授聊天 | ✅ 保持 | 增强上下文 |
| 排行榜 | ✅ 保持 | 支持课程筛选 |
| 胜利弹窗 | ✅ 保持 | 增加复习推荐 |
| 用户切换 | ✅ 保持 | 无改动 |
| localStorage 存储 | ✅ 保持 | 平滑迁移 |

### 10.2 渐进式升级路径

```
Phase 1: 添加通用题型支持，保持 Python 为默认
Phase 2: 添加课程中心，支持选择课程
Phase 3: 添加 AI 生成功能
Phase 4: 添加艾宾浩斯复习系统
```

---

*文档完*

