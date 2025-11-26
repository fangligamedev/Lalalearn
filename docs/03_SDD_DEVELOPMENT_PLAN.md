# Lalalearn 2.0 SDD Vibe Coding 开发计划
## Specification-Driven Development Plan

> **版本**: 2.0-alpha  
> **日期**: 2025-11-26  
> **方法论**: SDD (Specification-Driven Development)  

---

## 1. SDD 开发原则

### 1.1 什么是 SDD Vibe Coding?

```
┌─────────────────────────────────────────────────────────────┐
│                    SDD WORKFLOW                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   📋 SPEC           🤖 VIBE            ✅ VERIFY            │
│   (规格说明)         (AI 编码)          (验证确认)           │
│                                                             │
│   1. 明确定义       2. AI 实现         3. 对照规格          │
│   2. 接口优先       2. 最小改动         3. 测试通过          │
│   3. 边界清晰       2. 增量迭代         3. 人工审核          │
│                                                             │
│   每个 Step 都有:                                            │
│   • Input: 前置条件和依赖                                    │
│   • Spec: 要实现的功能规格                                   │
│   • Output: 可验证的交付物                                   │
│   • Test: 验收标准                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 开发原则

1. **最小化改动** - 优先修改现有代码而非重写
2. **增量交付** - 每个 Step 独立可运行可测试
3. **向后兼容** - 不破坏现有 Python 学习功能
4. **规格驱动** - 先定义接口和类型，再实现逻辑

---

## 2. 开发阶段总览

```
┌─────────────────────────────────────────────────────────────────────┐
│                      DEVELOPMENT PHASES                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PHASE 1: 基础重构 (Foundation)                    Est: 2-3 hours  │
│  ─────────────────────────────────────                             │
│  Step 1.1: 类型系统扩展                                             │
│  Step 1.2: 课程数据结构迁移                                          │
│  Step 1.3: 存储服务重构                                             │
│                                                                     │
│  PHASE 2: 通用题型 (Universal Questions)           Est: 3-4 hours  │
│  ─────────────────────────────────────────                         │
│  Step 2.1: 选择题组件                                               │
│  Step 2.2: 填空题组件                                               │
│  Step 2.3: 配对题组件                                               │
│  Step 2.4: 题目渲染分发器                                            │
│  Step 2.5: 通用验证服务                                             │
│                                                                     │
│  PHASE 3: 课程系统 (Course System)                 Est: 3-4 hours  │
│  ─────────────────────────────────────                             │
│  Step 3.1: 课程服务                                                 │
│  Step 3.2: 课程中心 UI                                              │
│  Step 3.3: Zeabur 预置课程                                          │
│  Step 3.4: 课程进度管理                                              │
│                                                                     │
│  PHASE 4: AI 生成 (Content Generation)             Est: 2-3 hours  │
│  ─────────────────────────────────────                             │
│  Step 4.1: 内容生成服务                                              │
│  Step 4.2: 导入向导 UI                                              │
│  Step 4.3: 生成流程优化                                              │
│                                                                     │
│  PHASE 5: 复习系统 (Spaced Repetition)             Est: 3-4 hours  │
│  ─────────────────────────────────────                             │
│  Step 5.1: 艾宾浩斯算法服务                                          │
│  Step 5.2: 复习仪表盘                                                │
│  Step 5.3: 复习会话                                                  │
│  Step 5.4: 复习提醒集成                                              │
│                                                                     │
│  PHASE 6: 增强功能 (Enhancements)                  Est: 2-3 hours  │
│  ─────────────────────────────────────                             │
│  Step 6.1: 学习总结生成                                              │
│  Step 6.2: 徽章系统扩展                                              │
│  Step 6.3: 排行榜课程筛选                                            │
│                                                                     │
│  PHASE 7: 架构升级 (ECS + Config)                  Est: 4-5 hours  │
│  ─────────────────────────────────────                             │
│  Step 7.1: 配置文件系统                                              │
│  Step 7.2: System 逻辑抽取                                          │
│  Step 7.3: LLM 抽象层                                               │
│  Step 7.4: 多模型支持                                                │
│                                                                     │
│  PHASE 8: 网页爬虫系统 (Crawler)                   Est: 3-4 hours  │
│  ─────────────────────────────────────                             │
│  Step 8.1: 爬虫服务核心                                              │
│  Step 8.2: 内容分段处理                                              │
│  Step 8.3: 爬虫导入 UI                                               │
│  Step 8.4: 预设站点适配器                                            │
│                                                                     │
│  PHASE 9: 数据分析系统 (Analytics)                 Est: 4-5 hours  │
│  ─────────────────────────────────────                             │
│  Step 9.1: 埋点服务核心                                              │
│  Step 9.2: 数据存储 (IndexedDB)                                     │
│  Step 9.3: 分析引擎                                                  │
│  Step 9.4: 管理后台 UI                                               │
│                                                                     │
│  PHASE 10: 语音系统 (Speech)                       Est: 3-4 hours  │
│  ─────────────────────────────────────                             │
│  Step 10.1: 语音服务抽象层                                           │
│  Step 10.2: Azure Speech 集成                                       │
│  Step 10.3: 中英文混合识别                                           │
│                                                                     │
│                                          Total Est: 29-41 hours    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. PHASE 1: 基础重构

### Step 1.1: 类型系统扩展

**目标**: 在 `types.ts` 中添加新类型定义

**Input**:
- 现有 `types.ts` 文件
- 技术架构文档中的类型定义

**Spec**:
```typescript
// 新增到 types.ts
// 1. 题型枚举
export type QuestionType = 
  | 'single_choice' 
  | 'multiple_choice' 
  | 'true_false' 
  | 'fill_blank' 
  | 'matching'
  | 'code_completion' 
  | 'debug' 
  | 'write_code';

// 2. 难度枚举
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

// 3. 通用题目接口 (参见技术文档 Section 3.1)
export interface BaseQuestion { ... }
export interface SingleChoiceQuestion extends BaseQuestion { ... }
// ... 其他题型

// 4. 课程结构
export interface Course { ... }
export interface Module { ... }
export interface Level { ... }

// 5. 用户进度 V2
export interface UserStateV2 extends UserState { ... }
```

**Output**:
- 更新后的 `types.ts`

**Verify**:
```bash
# TypeScript 编译无错误
npm run build
```

---

### Step 1.2: 课程数据结构迁移

**目标**: 将现有 Python 题库迁移为课程 JSON 格式

**Input**:
- `constants.ts` 中的 `LEVELS_A_ZH`, `LEVELS_B_ZH`, `LEVELS_C_ZH`
- 新的 `Course` 类型定义

**Spec**:
```
1. 创建 courses/ 目录
2. 创建 courses/python-kids.json
3. 将 LEVELS_A_ZH/B/C 转换为 Course 格式
4. constants.ts 保持不变 (向后兼容)
```

**Output**:
- `courses/python-kids.json` - 包含 A/B/C 三个模块

**文件结构**:
```json
// courses/python-kids.json
{
  "id": "python-kids-v1",
  "name": "Python 儿童编程入门",
  "type": "code",
  "difficulty": "easy",
  "modules": [
    {
      "id": "bank-A",
      "name": "标准卷 (A卷)",
      "levels": [
        {
          "id": 1,
          "title": "魔法问候 (A卷)",
          "difficulty": "easy",
          "questions": [{
            "type": "write_code",
            "language": "python",
            "task": "打印 'Hello Party' 到屏幕上。",
            ...
          }]
        }
      ]
    }
  ]
}
```

**Verify**:
- JSON 格式正确
- 可被 `import` 加载

---

### Step 1.3: 存储服务重构

**目标**: 创建统一的存储服务

**Input**:
- App.tsx 中的 localStorage 逻辑
- 新的类型定义

**Spec**:
```typescript
// services/storageService.ts

const KEYS = {
  PLAYERS: 'lalalearn_players',
  CUSTOM_COURSES: 'lalalearn_custom_courses',
  // ...
};

export const storageService = {
  // 用户
  getPlayers(): UserStateV2[] { ... },
  savePlayers(players: UserStateV2[]): void { ... },
  
  // 课程
  getCustomCourses(): Course[] { ... },
  saveCustomCourse(course: Course): void { ... },
  
  // 迁移
  migrateFromV1(): void { ... }
};
```

**Output**:
- `services/storageService.ts`

**Verify**:
- 现有用户数据无丢失
- 自动迁移 v1 数据

---

## 4. PHASE 2: 通用题型

### Step 2.1: 选择题组件

**目标**: 创建通用选择题组件 (单选/多选)

**Input**:
- `SingleChoiceQuestion` / `MultipleChoiceQuestion` 类型

**Spec**:
```typescript
// components/questions/SingleChoice.tsx

interface SingleChoiceProps {
  question: SingleChoiceQuestion;
  onAnswer: (answer: string) => void;
  showResult?: boolean;
  userAnswer?: string;
  disabled?: boolean;
}

export const SingleChoice: React.FC<SingleChoiceProps> = ({
  question,
  onAnswer,
  showResult,
  userAnswer,
  disabled
}) => {
  // 渲染选项列表
  // 选中状态管理
  // 正确/错误样式
};
```

**UI 规格**:
```
┌─────────────────────────────────────────────┐
│ Q: Zeabur 的主要优势是什么？                 │
├─────────────────────────────────────────────┤
│ ○ A. 需要手动配置 CI/CD                      │
│ ● B. 按量计费，自动识别项目  ✓ 正确         │
│ ○ C. 只支持 Node.js                         │
│ ○ D. 必须使用 Docker                         │
├─────────────────────────────────────────────┤
│ 💡 解释: Zeabur 最大优势是开箱即用...        │
└─────────────────────────────────────────────┘
```

**Output**:
- `components/questions/SingleChoice.tsx`
- `components/questions/MultipleChoice.tsx`

**Verify**:
- 可独立渲染
- 选择状态正确
- 结果显示正确

---

### Step 2.2: 填空题组件

**目标**: 创建填空题组件

**Spec**:
```typescript
// components/questions/FillBlank.tsx

interface FillBlankProps {
  question: FillBlankQuestion;
  onAnswer: (answer: string) => void;
  showResult?: boolean;
  userAnswer?: string;
  disabled?: boolean;
}

// 解析 question.question 中的 ____ 占位符
// 将占位符替换为输入框
```

**UI 规格**:
```
┌─────────────────────────────────────────────┐
│ 在 Zeabur 中添加 API 密钥，需要在           │
│ Settings → [________] 中配置。              │
│                                             │
│ [提交]                                       │
├─────────────────────────────────────────────┤
│ ✓ 正确! 答案: Environment Variables         │
└─────────────────────────────────────────────┘
```

**Output**:
- `components/questions/FillBlank.tsx`

---

### Step 2.3: 配对题组件

**目标**: 创建拖拽配对题组件

**Spec**:
```typescript
// components/questions/Matching.tsx

interface MatchingProps {
  question: MatchingQuestion;
  onAnswer: (pairs: Record<string, string>) => void;
  showResult?: boolean;
  userAnswer?: Record<string, string>;
  disabled?: boolean;
}

// 左右两列
// 拖拽或点击连线
// 简化实现：下拉选择配对
```

**UI 规格 (简化版)**:
```
┌─────────────────────────────────────────────┐
│ 将服务类型与其描述匹配：                      │
├─────────────────────────────────────────────┤
│ React 博客      →  [静态网站托管 ▼]          │
│ Express API     →  [Git Service ▼]          │
│ PostgreSQL      →  [Prebuilt 服务 ▼]        │
├─────────────────────────────────────────────┤
│ [提交]                                       │
└─────────────────────────────────────────────┘
```

**Output**:
- `components/questions/Matching.tsx`

---

### Step 2.4: 题目渲染分发器

**目标**: 创建统一的题目渲染入口

**Spec**:
```typescript
// components/questions/QuestionRenderer.tsx

import { Question } from '../../types';
import SingleChoice from './SingleChoice';
import MultipleChoice from './MultipleChoice';
import FillBlank from './FillBlank';
import Matching from './Matching';
import TrueFalse from './TrueFalse';

interface QuestionRendererProps {
  question: Question;
  onAnswer: (answer: unknown) => void;
  showResult?: boolean;
  userAnswer?: unknown;
  disabled?: boolean;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = (props) => {
  const { question } = props;
  
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
    
    // 代码题 - 使用现有 CodeEditor
    case 'code_completion':
    case 'debug':
    case 'write_code':
      return <CodeQuestion question={question} {...props} />;
    
    default:
      return <div>不支持的题型</div>;
  }
};
```

**Output**:
- `components/questions/QuestionRenderer.tsx`
- `components/questions/index.ts` (导出所有)

**Verify**:
- 所有题型可正确分发
- 代码题复用现有组件

---

### Step 2.5: 通用验证服务

**目标**: 扩展 geminiService 支持通用题目验证

**Spec**:
```typescript
// services/geminiService.ts (新增)

/**
 * 本地验证 (简单题型)
 */
function validateLocally(question: Question, userAnswer: unknown): ValidationResultV2 {
  switch (question.type) {
    case 'single_choice':
      const q = question as SingleChoiceQuestion;
      const correct = userAnswer === q.correctAnswer;
      return {
        correct,
        score: correct ? 100 : 0,
        feedback: correct ? '正确！' : `错误，正确答案是 ${q.correctAnswer}`,
        explanation: q.explanation
      };
    
    case 'true_false':
      // 类似逻辑
    
    case 'fill_blank':
      const fq = question as FillBlankQuestion;
      const normalizedAnswer = fq.caseSensitive 
        ? String(userAnswer).trim()
        : String(userAnswer).trim().toLowerCase();
      const isCorrect = fq.correctAnswers.some(ans => 
        fq.caseSensitive ? ans === normalizedAnswer : ans.toLowerCase() === normalizedAnswer
      );
      return { ... };
    
    case 'matching':
      // 配对验证
    
    default:
      throw new Error('需要 AI 验证');
  }
}

/**
 * 通用验证入口
 */
export async function validateAnswer(
  question: Question,
  userAnswer: unknown,
  language: Language
): Promise<ValidationResultV2> {
  // 简单题型本地验证
  if (['single_choice', 'true_false', 'fill_blank', 'matching', 'multiple_choice'].includes(question.type)) {
    return validateLocally(question, userAnswer);
  }
  
  // 代码题使用 AI
  return validateCodeWithGemini(
    String(userAnswer),
    (question as CodeQuestion).task,
    language
  );
}
```

**Output**:
- 更新后的 `services/geminiService.ts`

---

## 5. PHASE 3: 课程系统

### Step 3.1: 课程服务

**目标**: 创建课程加载与管理服务

**Spec**:
```typescript
// services/courseService.ts

export const BUILTIN_COURSES = {
  PYTHON_KIDS: 'python-kids-v1',
  ZEABUR_TRAINING: 'zeabur-training-v1',
};

export async function loadBuiltinCourse(courseId: string): Promise<Course> {
  // 动态 import JSON
}

export function loadCustomCourses(): Course[] {
  // 从 localStorage 加载
}

export function saveCustomCourse(course: Course): void {
  // 保存到 localStorage
}

export async function getAllCourses(): Promise<{
  builtin: Course[];
  custom: Course[];
}> {
  // 合并所有课程
}
```

**Output**:
- `services/courseService.ts`

---

### Step 3.2: 课程中心 UI

**目标**: 创建课程选择界面

**Spec**:
```typescript
// components/course/CourseHub.tsx

interface CourseHubProps {
  onSelectCourse: (course: Course) => void;
  onCreateCourse: () => void;
}

// UI: 网格展示所有课程
// 分类: 官方课程 / 我的课程
// 操作: 开始学习 / 创建新课程
```

**UI 规格**:
```
┌─────────────────────────────────────────────────────────────┐
│  📚 课程中心                              [+ 创建课程]     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🎓 官方课程                                                │
│  ┌───────────────┐  ┌───────────────┐                      │
│  │ 🐍 Python     │  │ ☁️ Zeabur     │                      │
│  │ 儿童编程入门   │  │ 技术文档速成   │                      │
│  │               │  │               │                      │
│  │ ⭐⭐⭐ 10关   │  │ ⭐⭐ 15关      │                      │
│  │ [开始学习]    │  │ [开始学习]     │                      │
│  └───────────────┘  └───────────────┘                      │
│                                                             │
│  ✨ 我的课程                                                │
│  ┌───────────────┐                                         │
│  │ 📝 AI概念     │  没有自定义课程？                        │
│  │ (AI生成)      │  点击右上角创建！                        │
│  └───────────────┘                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Output**:
- `components/course/CourseHub.tsx`
- `components/course/CourseCard.tsx`

---

### Step 3.3: Zeabur 预置课程

**目标**: 创建 Zeabur 技术培训课程数据

**Spec**:
```json
// courses/zeabur-training.json
{
  "id": "zeabur-training-v1",
  "name": "Zeabur 云平台速成",
  "description": "面向非技术人员的云平台核心概念培训",
  "type": "concept",
  "difficulty": "medium",
  "modules": [
    {
      "id": "basics",
      "name": "平台基础",
      "levels": [
        {
          "id": 1,
          "title": "什么是 Zeabur？",
          "difficulty": "easy",
          "questions": [
            {
              "type": "single_choice",
              "question": "Zeabur 是什么类型的平台？",
              "options": [...],
              "correctAnswer": "B"
            }
          ]
        }
      ]
    },
    {
      "id": "deployment",
      "name": "部署入门",
      "levels": [...]
    }
  ]
}
```

**内容来源**: https://zeabur.com/docs/zh-CN

**题目覆盖**:
1. 基础概念 (3关)
   - 什么是 Zeabur
   - 核心优势
   - 按量计费
2. 部署入门 (4关)
   - Git Service
   - 创建项目
   - 环境变量
   - 静态网站
3. 常见服务 (4关)
   - 数据库服务
   - 域名绑定
   - 持久存储
   - 高可用
4. 进阶概念 (4关)
   - Dockerfile
   - 一键部署按钮
   - 模板市场
   - CLI 部署

**Output**:
- `courses/zeabur-training.json` (约 15 关)

---

### Step 3.4: 课程进度管理

**目标**: 更新 App.tsx 支持多课程进度

**Spec**:
```typescript
// App.tsx 修改

// 新增状态
const [activeCourse, setActiveCourse] = useState<Course | null>(null);
const [showCourseHub, setShowCourseHub] = useState(true);

// 修改 levels 获取逻辑
const levels = activeCourse 
  ? getCourseLevels(activeCourse, selectedModuleId)
  : getLevels(userState.language, userState.currentBank); // 向后兼容

// 进度保存到 courseProgress
```

**Output**:
- 更新后的 `App.tsx`

---

## 6. PHASE 4: AI 内容生成

### Step 4.1: 内容生成服务

**目标**: 创建 AI 课程生成服务

**Spec**:
```typescript
// services/contentGenerator.ts

export interface GenerationOptions {
  difficulty: Difficulty;
  questionCount: number;
  questionTypes: QuestionType[];
  language: Language;
}

export async function generateCourseFromText(
  content: string,
  options: GenerationOptions
): Promise<Course> {
  // 1. 构建 Prompt
  // 2. 调用 Gemini
  // 3. 解析 JSON
  // 4. 验证结构
  // 5. 返回 Course
}

// Prompt 模板见技术文档 Section 4.2
```

**Output**:
- `services/contentGenerator.ts`

---

### Step 4.2: 导入向导 UI

**目标**: 创建课程创建/导入界面

**Spec**:
```typescript
// components/course/CourseImport.tsx

interface CourseImportProps {
  onComplete: (course: Course) => void;
  onCancel: () => void;
}

// 步骤:
// 1. 输入内容 (粘贴文本 / 输入URL提示)
// 2. 配置选项 (难度、题数、题型)
// 3. AI 生成 (显示进度)
// 4. 预览确认
// 5. 保存
```

**UI 规格**:
```
┌─────────────────────────────────────────────────────────────┐
│  ✨ 创建新课程                               [×]           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Step 1/3: 输入学习内容                                     │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 粘贴你想学习的内容...                                  │ │
│  │                                                       │ │
│  │ 支持: 文档内容、知识点列表、技术文档等                  │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  💡 提示: 对于网页内容，请复制主要文本部分粘贴于此           │
│                                                             │
│                                      [取消]  [下一步 →]    │
└─────────────────────────────────────────────────────────────┘
```

**Output**:
- `components/course/CourseImport.tsx`

---

### Step 4.3: 生成流程优化

**目标**: 添加错误处理和重试机制

**Spec**:
```typescript
// 错误处理
// - API 调用失败重试
// - JSON 解析失败提示
// - 内容过长分段处理

// 进度反馈
// - 显示生成阶段 (分析中 → 生成中 → 验证中)
// - 预估时间
```

**Output**:
- 更新后的 `contentGenerator.ts`
- 更新后的 `CourseImport.tsx`

---

## 7. PHASE 5: 复习系统

### Step 5.1: 艾宾浩斯算法服务

**目标**: 实现间隔重复算法

**Spec**:
```typescript
// services/spacedRepetition.ts

// 核心算法 (SM-2 变体)
export function calculateNextReview(
  item: ReviewItem, 
  quality: number  // 0-5
): ReviewItem { ... }

// 获取待复习项
export function getDueReviews(reviewData: ReviewData): ReviewItem[] { ... }

// 添加到复习队列
export function addToReview(
  reviewData: ReviewData,
  questionId: string,
  courseId: string,
  levelId: number
): ReviewData { ... }

// 统计
export function getReviewStats(reviewData: ReviewData): ReviewStats { ... }
```

**Output**:
- `services/spacedRepetition.ts`

---

### Step 5.2: 复习仪表盘

**目标**: 创建复习任务展示界面

**Spec**:
```typescript
// components/review/ReviewDashboard.tsx

// 显示:
// - 今日待复习数量
// - 已掌握/总数
// - 复习准确率
// - 连续复习天数

// 操作:
// - 开始复习
// - 查看错题本
```

**UI 规格**:
```
┌─────────────────────────────────────────────────────────────┐
│  🧠 记忆增强中心                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
│  │  📋 5         │  │  ✅ 23/45     │  │  🔥 7天       │   │
│  │  待复习       │  │  已掌握       │  │  连续学习      │   │
│  └───────────────┘  └───────────────┘  └───────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   [🚀 开始复习]                      │   │
│  │                                                     │   │
│  │  预计时间: 5 分钟                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  📊 复习进度                                                │
│  ████████████████████░░░░░░ 75%                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Output**:
- `components/review/ReviewDashboard.tsx`

---

### Step 5.3: 复习会话

**目标**: 创建复习答题流程

**Spec**:
```typescript
// components/review/ReviewSession.tsx

interface ReviewSessionProps {
  items: ReviewItem[];
  onComplete: (results: ReviewResult[]) => void;
}

// 流程:
// 1. 逐题展示
// 2. 用户回答
// 3. 显示结果 + 解释
// 4. 用户评分 (简单/一般/困难)
// 5. 更新复习间隔
// 6. 下一题
```

**Output**:
- `components/review/ReviewSession.tsx`

---

### Step 5.4: 复习提醒集成

**目标**: 在胜利弹窗和主界面集成复习提醒

**Spec**:
```typescript
// VictoryModal.tsx 修改
// 新增: 显示待复习数量，引导用户去复习

// App.tsx 修改
// 新增: Header 显示复习徽章/通知
```

**Output**:
- 更新后的 `VictoryModal.tsx`
- 更新后的 `App.tsx`

---

## 8. PHASE 6: 增强功能

### Step 6.1: 学习总结生成

**目标**: 完成关卡后 AI 生成学习总结

**Spec**:
```typescript
// geminiService.ts 新增

export async function generateLevelSummary(
  level: Level,
  answers: AnswerRecord[],
  language: Language
): Promise<string> {
  // Prompt: 根据关卡内容和用户表现，生成简短总结
  // 包括: 知识点回顾、薄弱点、建议
}
```

**集成点**:
- VictoryModal 展示总结
- 保存到用户数据

---

### Step 6.2: 徽章系统扩展

**目标**: 添加复习相关徽章

**Spec**:
```typescript
// 新增徽章定义
const NEW_BADGES = {
  MEMORY_MASTER: {
    id: 'memory_master',
    name: '记忆大师',
    description: '连续7天完成复习',
    icon: '🧠',
    condition: (user) => user.stats.streakDays >= 7
  },
  FIRST_REVIEW: {
    id: 'first_review',
    name: '复习起步',
    description: '完成首次复习',
    icon: '🔄',
    condition: (user) => user.reviewData.stats.totalReviewed >= 1
  },
  // ...
};
```

**Output**:
- 更新 `constants.ts` 或新建 `badges.ts`

---

### Step 6.3: 排行榜课程筛选

**目标**: 排行榜支持按课程筛选

**Spec**:
```typescript
// LeaderboardModal.tsx 修改

interface LeaderboardModalProps {
  // 新增
  courseId?: string;  // 可选的课程筛选
}

// 排序逻辑:
// - 全局: 按总 XP
// - 课程: 按课程内 XP
```

**Output**:
- 更新后的 `LeaderboardModal.tsx`

---

## 9. PHASE 7: 架构升级 (ECS + Config)

### Step 7.1: 配置文件系统

**目标**: 创建 JSON 配置文件系统，所有参数可配置化

**Input**:
- 技术架构文档 Section 11

**Spec**:
```
创建目录结构:
config/
├── game.config.json        # 游戏机制配置
├── ui.config.json          # UI/UX 配置
├── ai.config.json          # AI 服务配置
├── audio.config.json       # 音效配置
└── analytics.config.json   # 埋点配置

实现 configService.ts:
- 加载所有配置
- 支持用户覆盖
- 提供 useConfig() Hook
```

**Output**:
- `config/*.json` (5个配置文件)
- `services/configService.ts`

**Verify**:
- 可通过修改 JSON 改变游戏参数
- 重启后配置生效

---

### Step 7.2: System 逻辑抽取

**目标**: 将业务逻辑抽取为独立 System (ECS 风格)

**Spec**:
```typescript
// systems/validationSystem.ts
export const ValidationSystem = {
  validate(question: Question, answer: unknown): ValidationResult { ... },
  calculateScore(result: ValidationResult, timeSpent: number, config: ScoringConfig): number { ... }
};

// systems/progressSystem.ts
export const ProgressSystem = {
  updateProgress(state: UserStateV2, levelResult: LevelResult): UserStateV2 { ... },
  checkUnlockConditions(course: Course, progress: CourseProgress): number[] { ... }
};

// systems/reviewSystem.ts
export const ReviewSystem = {
  scheduleReview(item: ReviewItem, quality: number): ReviewItem { ... },
  getDueItems(reviewData: ReviewData, now: number): ReviewItem[] { ... }
};
```

**Output**:
- `systems/validationSystem.ts`
- `systems/progressSystem.ts`
- `systems/reviewSystem.ts`

**改造成本评估**:
| 模块 | 工作量 | 说明 |
|-----|-------|------|
| 验证逻辑抽取 | 2h | 从 geminiService 迁移 |
| 进度逻辑抽取 | 2h | 从 App.tsx 迁移 |
| 复习逻辑抽取 | 1h | 已在 spacedRepetition 中 |

---

### Step 7.3: LLM 抽象层

**目标**: 创建 LLM Provider 接口，支持多模型

**Spec**:
```typescript
// services/llm/types.ts
export interface LLMProvider {
  name: string;
  isAvailable(): boolean;
  chat(request: LLMRequest): Promise<LLMResponse>;
  generateContent(prompt: string): Promise<string>;
}

// services/llm/providers/
geminiProvider.ts
openaiProvider.ts
anthropicProvider.ts
deepseekProvider.ts
```

**Output**:
- `services/llm/types.ts`
- `services/llm/providers/*.ts`
- `services/llm/llmService.ts` (管理器)

---

### Step 7.4: 多模型支持

**目标**: 实现自动 Fallback 和 Provider 切换

**Spec**:
```typescript
// services/llm/llmService.ts

class LLMService {
  // 获取最优可用 Provider (按配置优先级)
  private getAvailableProvider(): LLMProvider { ... }
  
  // 带自动 Fallback 的请求
  async chat(request: LLMRequest): Promise<LLMResponse> { ... }
  
  // 获取当前 Provider 信息
  getCurrentProvider(): { name: string; model: string } { ... }
}
```

**集成点**:
- 修改 geminiService.ts 使用 llmService
- UI 显示当前使用的模型

**Output**:
- 更新后的 `geminiService.ts`
- AI 设置面板支持切换模型

---

## 10. PHASE 8: 网页爬虫系统 (Crawler)

### Step 8.1: 爬虫服务核心

**目标**: 创建网页内容抓取服务

**技术方案**: 使用 [Jina Reader API](https://jina.ai/reader/) 绕过 CORS 限制，免费且返回干净的 Markdown

**Spec**:
```typescript
// services/crawler/crawlerService.ts

class CrawlerService {
  /**
   * 使用 Jina Reader 抓取单页
   * URL 前加 https://r.jina.ai/ 即可返回 Markdown
   */
  async fetchPage(url: string): Promise<CrawlResult> {
    const readerUrl = `https://r.jina.ai/${url}`;
    const response = await fetch(readerUrl);
    const markdown = await response.text();
    
    return {
      url,
      title: extractTitle(markdown),
      content: markdown,
      links: extractLinks(markdown, url)
    };
  }
  
  /**
   * 递归抓取整个站点
   */
  async crawlSite(
    startUrl: string,
    options: CrawlOptions,
    onProgress?: (progress: CrawlProgress) => void
  ): Promise<CrawlResult[]> {
    // BFS 遍历所有页面
    // 去重、深度限制、并发控制
  }
  
  /**
   * 合并抓取结果
   */
  mergeResults(results: CrawlResult[]): string {
    // 合并为单一文档，保留来源标记
  }
}
```

**Output**:
- `services/crawler/types.ts`
- `services/crawler/crawlerService.ts`

---

### Step 8.2: 内容分段处理

**目标**: 处理超长内容，分段送给 LLM

**Spec**:
```typescript
// services/crawler/contentSplitter.ts

/**
 * 按 Token 限制分割内容
 */
export function splitContent(
  results: CrawlResult[],
  maxTokensPerChunk: number = 8000
): ContentChunk[] {
  // 估算 Token 数
  // 按页面边界分割
  // 返回多个内容块
}

/**
 * 分块生成课程
 */
export async function generateCourseFromChunks(
  chunks: ContentChunk[],
  options: GenerationOptions
): Promise<Course> {
  // 每个分块独立生成
  // 合并所有关卡
  // 重新编号和排序
}
```

**Output**:
- `services/crawler/contentSplitter.ts`

---

### Step 8.3: 爬虫导入 UI

**目标**: 创建用户友好的爬虫导入界面

**Spec**:
```typescript
// components/course/CrawlerImport.tsx

// 功能:
// 1. URL 输入框
// 2. 预设站点快捷按钮 (Zeabur、React、Vite...)
// 3. 实时抓取进度显示
// 4. 错误处理和重试
```

**UI 规格**:
```
┌─────────────────────────────────────────────────────────────┐
│  🌐 从网站导入文档                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  快捷选择:                                                   │
│  [☁️ Zeabur 文档] [⚛️ React 文档] [⚡ Vite 文档]           │
│                                                             │
│  ┌───────────────────────────────────────────┐ [🔍 抓取]   │
│  │ https://zeabur.com/docs/zh-CN             │             │
│  └───────────────────────────────────────────┘             │
│                                                             │
│  📊 抓取进度: 12/25 页                                      │
│  ████████████░░░░░░░░░░ 48%                                │
│  当前: /docs/zh-CN/deploy/environment-variables            │
│                                                             │
│  💡 输入文档网站首页，系统将自动抓取所有子页面               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Output**:
- `components/course/CrawlerImport.tsx`

---

### Step 8.4: 预设站点适配器

**目标**: 为常用文档站点创建优化适配器

**Spec**:
```typescript
// services/crawler/adapters/zeaburAdapter.ts

/**
 * Zeabur 文档专用适配器
 * 优化抓取策略，知道哪些页面重要
 */
export class ZeaburDocsAdapter {
  // 快速模式：只抓取核心页面
  async quickCrawl(): Promise<CrawlResult[]> {
    const keyPages = [
      '/deploy/create-project',
      '/deploy/environment-variables',
      '/deploy/dockerfile',
      '/networking/public',
      // ...
    ];
  }
  
  // 完整模式：按章节分组抓取
  async crawlBySection(sections: string[]): Promise<CrawlResult[]>;
}
```

**预设站点配置**:
```json
{
  "presets": [
    {
      "name": "Zeabur 文档",
      "url": "https://zeabur.com/docs/zh-CN",
      "adapter": "zeabur",
      "icon": "☁️"
    },
    {
      "name": "React 文档",
      "url": "https://react.dev/learn",
      "icon": "⚛️"
    }
  ]
}
```

**Output**:
- `services/crawler/adapters/zeaburAdapter.ts`
- `config/crawler.config.json`

---

## 11. PHASE 9: 数据分析系统 (Analytics)

### Step 9.1: 埋点服务核心

**目标**: 创建事件收集服务

**Spec**:
```typescript
// services/analytics/analyticsService.ts

class AnalyticsService {
  track(action: string, metadata?: Record<string, unknown>, category?: EventCategory): void;
  trackPageView(page: string): void;
  trackLearning(action: string, data: LearningEventData): void;
  trackError(error: Error, context?: Record<string, unknown>): void;
}

// 预定义事件常量
export const EVENTS = {
  PAGE_VIEW: 'page_view',
  LEVEL_ENTER: 'level_enter',
  ANSWER_SUBMIT: 'answer_submit',
  ANSWER_CORRECT: 'answer_correct',
  ANSWER_WRONG: 'answer_wrong',
  HINT_REQUEST: 'hint_request',
  LEVEL_COMPLETE: 'level_complete',
  LEVEL_ABANDON: 'level_abandon',
  // ...
};
```

**Output**:
- `services/analytics/types.ts`
- `services/analytics/analyticsService.ts`

---

### Step 9.2: 数据存储 (IndexedDB)

**目标**: 使用 IndexedDB 持久化分析数据

**Spec**:
```typescript
// 数据库结构
const DB_SCHEMA = {
  events: {        // 事件存储
    keyPath: 'id',
    indexes: ['timestamp', 'userId', 'category', 'action']
  },
  sessions: {      // 会话存储
    keyPath: 'sessionId',
    indexes: ['userId', 'startTime']
  },
  aggregates: {    // 聚合数据
    keyPath: 'id'
  }
};

// 批量写入 (5秒间隔)
// 页面关闭前强制写入
```

**Output**:
- 更新后的 `analyticsService.ts` (含 IndexedDB)

---

### Step 9.3: 分析引擎

**目标**: 实现数据分析计算

**Spec**:
```typescript
// services/analytics/analyzer.ts

export class AnalyticsAnalyzer {
  // 生成综合报告
  async generateReport(startTime: number, endTime: number): Promise<AnalyticsReport>;
  
  // 卡点分析 (重点!)
  private analyzePainPoints(events: AnalyticsEvent[]): PainPoint[];
  
  // 功能使用热度
  private analyzeFeatureUsage(events: AnalyticsEvent[]): FeatureUsage[];
  
  // 留存分析
  private analyzeRetention(events: AnalyticsEvent[]): RetentionData;
  
  // 学习效果
  private analyzeLearning(events: AnalyticsEvent[]): LearningMetrics;
}
```

**输出报告结构**:
```typescript
interface AnalyticsReport {
  period: { start: number; end: number };
  users: { total, active, new };
  retention: { day1, day7, day30 };
  featureUsage: { feature, count, uniqueUsers }[];
  painPoints: { levelId, courseId, failRate, avgAttempts, dropOffRate }[];
  learningMetrics: { avgCompletionRate, avgCorrectRate, avgTimePerLevel };
  aiUsage: { chatCount, hintCount, avgChatLength };
}
```

**Output**:
- `services/analytics/analyzer.ts`

---

### Step 9.4: 管理后台 UI

**目标**: 创建数据分析可视化界面

**Spec**:
```typescript
// components/admin/AnalyticsDashboard.tsx

// 功能:
// 1. 时间范围选择器
// 2. 概览卡片 (活跃用户、完成率、正确率、AI对话)
// 3. 卡点关卡表格 (高亮高失败率关卡)
// 4. 功能使用热度条形图
// 5. 留存曲线折线图
// 6. 数据导出按钮
```

**UI 要点**:
- 卡点关卡失败率 > 50% 用红色高亮
- 支持导出 Excel/JSON
- 响应式设计

**Output**:
- `components/admin/AnalyticsDashboard.tsx`
- `components/admin/StatCard.tsx`

**访问方式**:
- 通过 URL hash: `/#/admin`
- 或设置中隐藏入口

---

## 12. PHASE 10: 语音系统 (Speech)

### Step 10.1: 语音服务抽象层

**目标**: 创建语音服务接口

**Spec**:
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

export interface STTResult {
  text: string;
  confidence: number;
  isFinal: boolean;
}

export interface SpeechProvider {
  name: string;
  speak(options: TTSOptions): Promise<void>;
  stopSpeaking(): void;
  startListening(options: STTOptions, callback: (result: STTResult) => void): void;
  stopListening(): void;
}
```

**Output**:
- `services/speech/types.ts`
- `services/speech/speechService.ts` (管理器)

---

### Step 10.2: Azure Speech 集成

**目标**: 实现 Azure Speech Provider (推荐方案)

**为什么选择 Azure Speech**:
| 特性 | Azure | Web API | Google |
|-----|-------|---------|--------|
| TTS 音质 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 中文自然度 | 极佳 | 一般 | 优秀 |
| 情感/风格 | ✅ 支持 | ❌ | 部分 |
| STT 中英混合 | ✅ 自动 | ⚠️ 需切换 | ⚠️ 需切换 |
| 价格 | 中等 | 免费 | 中等 |

**Spec**:
```typescript
// services/speech/providers/azureSpeechProvider.ts

export class AzureSpeechProvider implements SpeechProvider {
  // TTS: 使用 SSML 控制语音风格
  async speak(options: TTSOptions): Promise<void> {
    const ssml = buildSSML(options);
    // 使用 azure-speech-sdk
  }
  
  // STT: 多语言自动检测
  startListening(options: STTOptions, callback: (result: STTResult) => void): void {
    // 配置 AutoDetectSourceLanguageConfig
    // 支持 zh-CN + en-US 混合识别
  }
}
```

**推荐语音**:
- 中文: `zh-CN-XiaoxiaoNeural` (女声，活泼)
- 英文: `en-US-JennyNeural` (女声，友好)

**Output**:
- `services/speech/providers/azureSpeechProvider.ts`

**环境变量**:
```bash
AZURE_SPEECH_KEY=xxx
AZURE_SPEECH_REGION=eastasia
```

---

### Step 10.3: 中英文混合识别

**目标**: 优化语音输入体验

**Spec**:
```typescript
// 配置 Azure 自动语言检测
const autoDetect = SpeechSDK.AutoDetectSourceLanguageConfig.fromLanguages([
  'zh-CN',
  'en-US'
]);

// 识别回调处理
recognizer.recognized = (_, event) => {
  const text = event.result.text;
  const language = event.result.language; // 自动检测到的语言
  callback({ text, language, isFinal: true });
};
```

**集成点**:
- CoachChat 语音输入按钮
- 显示识别中状态
- 支持取消

**Output**:
- 更新后的 `CoachChat.tsx`

**备选方案 (免费)**:
如果不使用 Azure，可使用 Web Speech API:
```typescript
// services/speech/providers/webSpeechProvider.ts
// 免费但音质一般，不支持混合语言自动识别
```

---

## 13. 验收清单

### 核心功能验收

| 功能 | 验收标准 | 状态 |
|-----|---------|------|
| 现有 Python 课程正常运行 | A/B/C 题库可选择可答题 | ⬜ |
| 课程中心显示 | 展示预置课程和自定义课程 | ⬜ |
| Zeabur 课程可学习 | 15 关全部可答题 | ⬜ |
| 概念题可答题 | 单选/多选/判断/填空/配对 | ⬜ |
| AI 生成课程 | 粘贴内容可生成课程 | ⬜ |
| 复习系统运行 | 错题自动加入复习队列 | ⬜ |
| 复习提醒显示 | 待复习数量可见 | ⬜ |
| 排行榜课程筛选 | 可切换全局/课程排行 | ⬜ |

### 网页爬虫验收 (Phase 8) ⭐ 新增

| 功能 | 验收标准 | 状态 |
|-----|---------|------|
| 单页抓取 | 输入 URL 可获取 Markdown 内容 | ⬜ |
| 递归抓取 | 自动发现并抓取子页面 | ⬜ |
| 进度显示 | 实时显示抓取进度和当前页面 | ⬜ |
| 内容分段 | 超长内容自动分段处理 | ⬜ |
| Zeabur 适配 | 预设 Zeabur 文档快捷抓取 | ⬜ |
| 错误处理 | 单页失败不影响整体 | ⬜ |

### 架构升级验收 (Phase 7)

| 功能 | 验收标准 | 状态 |
|-----|---------|------|
| 配置文件系统 | 修改 JSON 可改变游戏参数 | ⬜ |
| System 逻辑分离 | 业务逻辑在 systems/ 目录 | ⬜ |
| LLM 抽象层 | Provider 接口定义完整 | ⬜ |
| 多模型支持 | 可切换 Gemini/OpenAI/Claude | ⬜ |
| 自动 Fallback | API 失败自动切换备用 | ⬜ |

### 数据分析验收 (Phase 9)

| 功能 | 验收标准 | 状态 |
|-----|---------|------|
| 埋点服务 | 关键事件自动记录 | ⬜ |
| 数据存储 | IndexedDB 持久化 | ⬜ |
| 卡点分析 | 高失败率关卡可识别 | ⬜ |
| 功能热度 | 使用次数可统计 | ⬜ |
| 管理后台 | 可视化图表展示 | ⬜ |
| 数据导出 | 支持导出 Excel/JSON | ⬜ |

### 语音系统验收 (Phase 10)

| 功能 | 验收标准 | 状态 |
|-----|---------|------|
| TTS 朗读 | Vibe教授语音反馈自然流畅 | ⬜ |
| STT 输入 | 语音转文字准确 | ⬜ |
| 中英混合 | 自动识别中英文 | ⬜ |
| 语音配置 | 可选择不同语音风格 | ⬜ |

### 兼容性验收

| 项目 | 验收标准 | 状态 |
|-----|---------|------|
| v1 数据迁移 | 旧用户进度自动迁移 | ⬜ |
| 代码编辑器 | Python 代码题正常运行 | ⬜ |
| Vibe 教授 | 聊天功能正常 | ⬜ |
| 音效系统 | 所有音效正常播放 | ⬜ |
| 移动端适配 | 响应式布局正常 | ⬜ |

---

## 10. 附录

### A. 命令速查

```bash
# 开发
npm run dev

# 构建
npm run build

# 类型检查
npx tsc --noEmit
```

### B. 文件创建清单

```
# Phase 1-6: 核心功能
[ ] types.ts (更新)
[ ] courses/python-kids.json (新建)
[ ] courses/zeabur-training.json (新建)
[ ] services/storageService.ts (新建)
[ ] services/courseService.ts (新建)
[ ] services/contentGenerator.ts (新建)
[ ] services/spacedRepetition.ts (新建)
[ ] services/geminiService.ts (更新)
[ ] components/questions/SingleChoice.tsx (新建)
[ ] components/questions/MultipleChoice.tsx (新建)
[ ] components/questions/TrueFalse.tsx (新建)
[ ] components/questions/FillBlank.tsx (新建)
[ ] components/questions/Matching.tsx (新建)
[ ] components/questions/QuestionRenderer.tsx (新建)
[ ] components/questions/index.ts (新建)
[ ] components/course/CourseHub.tsx (新建)
[ ] components/course/CourseCard.tsx (新建)
[ ] components/course/CourseImport.tsx (新建)
[ ] components/review/ReviewDashboard.tsx (新建)
[ ] components/review/ReviewSession.tsx (新建)
[ ] App.tsx (更新)
[ ] VictoryModal.tsx (更新)
[ ] LeaderboardModal.tsx (更新)
[ ] constants.ts (更新)

# Phase 7: 架构升级
[ ] config/game.config.json (新建)
[ ] config/ui.config.json (新建)
[ ] config/ai.config.json (新建)
[ ] config/audio.config.json (新建)
[ ] config/analytics.config.json (新建)
[ ] services/configService.ts (新建)
[ ] systems/validationSystem.ts (新建)
[ ] systems/progressSystem.ts (新建)
[ ] systems/reviewSystem.ts (新建)
[ ] services/llm/types.ts (新建)
[ ] services/llm/llmService.ts (新建)
[ ] services/llm/providers/geminiProvider.ts (新建)
[ ] services/llm/providers/openaiProvider.ts (新建)
[ ] services/llm/providers/anthropicProvider.ts (新建)

# Phase 8: 网页爬虫
[ ] services/crawler/types.ts (新建)
[ ] services/crawler/crawlerService.ts (新建)
[ ] services/crawler/contentSplitter.ts (新建)
[ ] services/crawler/adapters/zeaburAdapter.ts (新建)
[ ] components/course/CrawlerImport.tsx (新建)
[ ] config/crawler.config.json (新建)

# Phase 9: 数据分析
[ ] services/analytics/types.ts (新建)
[ ] services/analytics/analyticsService.ts (新建)
[ ] services/analytics/analyzer.ts (新建)
[ ] components/admin/AnalyticsDashboard.tsx (新建)
[ ] components/admin/StatCard.tsx (新建)

# Phase 10: 语音系统
[ ] services/speech/types.ts (新建)
[ ] services/speech/speechService.ts (新建)
[ ] services/speech/providers/azureSpeechProvider.ts (新建)
[ ] services/speech/providers/webSpeechProvider.ts (新建)
[ ] CoachChat.tsx (更新 - 语音功能)
```

### C. 开发优先级建议

**MVP (最小可行产品)**:
1. Phase 1 (基础) - 必须
2. Phase 2 (题型) - 必须
3. Phase 3.1-3.3 (课程加载) - 必须
4. Phase 3.4 (进度管理) - 必须

**V1.1 迭代**:
5. Phase 4 (AI 生成) - 高优
6. Phase 5 (复习系统) - 高优
7. Phase 7.1 (配置系统) - 高优 ⭐ 新增

**V1.2 迭代**:
8. Phase 6 (增强) - 中优
9. Phase 7.2-7.4 (ECS+LLM) - 中优
10. Phase 8 (网页爬虫) - 高优 ⭐ 新增
11. Phase 9 (数据分析) - 中优

**V1.3 迭代**:
12. Phase 10 (语音系统) - 可选

### D. 技术选型建议

**LLM API 优先级**:
1. Gemini (Zeabur AI Hub) - 默认，已集成
2. OpenAI (GPT-4o-mini) - 备选，生态成熟
3. Claude (Sonnet) - 备选，代码能力强
4. DeepSeek - 备选，性价比高

**语音 API 推荐**:
| 方案 | TTS | STT | 成本 | 推荐场景 |
|-----|-----|-----|------|---------|
| Azure Speech | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 中 | 最佳体验 |
| Web Speech API | ⭐⭐⭐ | ⭐⭐⭐ | 免费 | 预算有限 |
| ElevenLabs | ⭐⭐⭐⭐⭐ | - | 高 | 极致音质 |
| 阿里云语音 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 低 | 中文优先 |

---

*开发计划完*

