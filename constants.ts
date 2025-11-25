
import { LevelData, Language, CoachPersona } from './types';

export const LEVEL_COUNT = 10;

// SFX Placeholders
export const SFX = {
  CLICK: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  WIN: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  LOSE: 'https://assets.mixkit.co/active_storage/sfx/2044/2044-preview.mp3',
  TICK: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', 
  START: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'
};

// --- QUESTION BANKS ---

// BANK A: Standard
const LEVELS_A_ZH: LevelData[] = [
  {
    id: 1,
    title: "魔法问候 (A卷)",
    description: "派对开始了！向你的对手打个招呼！",
    task: "打印 'Hello Party' 到屏幕上。",
    starterCode: "# 比赛开始！\n",
    concepts: ["print"],
    hint: "print('Hello Party')",
    timeLimit: 60,
    variants: [
      { task: "打印 'Hello Party' 到屏幕上。", starterCode: "# 比赛开始！\n", hint: "print('Hello Party')" },
      { task: "打印 'Python Is Fun' 到屏幕上。", starterCode: "# 写下代码\n", hint: "print('Python Is Fun')" },
      { task: "打印 'I Am Ready' 到屏幕上。", starterCode: "# 准备好了吗\n", hint: "print('I Am Ready')" }
    ]
  },
  {
    id: 2,
    title: "计分板 (A卷)",
    description: "我们需要一个变量来记录分数。",
    task: "创建一个变量 `score` 并赋值为 100，然后打印它。",
    starterCode: "# 创建变量\n",
    concepts: ["变量"],
    hint: "score = 100\nprint(score)",
    timeLimit: 60,
    variants: [
      { task: "创建变量 `score` 并赋值为 100，然后打印。", starterCode: "# 创建变量\n", hint: "score = 100\nprint(score)" },
      { task: "创建变量 `points` 并赋值为 500，然后打印。", starterCode: "# 记录分数\n", hint: "points = 500\nprint(points)" },
      { task: "创建变量 `gold` 并赋值为 999，然后打印。", starterCode: "# 多少金币？\n", hint: "gold = 999\nprint(gold)" }
    ]
  },
  {
    id: 3,
    title: "双倍快乐 (A卷)",
    description: "如果是派对模式，分数要翻倍！",
    task: "计算 100 * 2 并打印结果。",
    starterCode: "",
    concepts: ["数学"],
    hint: "print(100 * 2)",
    timeLimit: 45,
    variants: [
      { task: "计算 100 * 2 并打印结果。", starterCode: "", hint: "print(100 * 2)" },
      { task: "计算 50 * 4 并打印结果。", starterCode: "", hint: "print(50 * 4)" },
      { task: "计算 10 + 10 + 10 并打印结果。", starterCode: "", hint: "print(10 + 10 + 10)" }
    ]
  },
  { id: 4, title: "字符串拼接", description: "把两个单词连起来。", task: "打印 'Super' + 'Star'。", starterCode: "", concepts: ["字符串"], hint: "print('Super' + 'Star')", timeLimit: 45 },
  { id: 5, title: "年龄计算", description: "计算你的年龄的一半。", task: "打印 10 / 2。", starterCode: "", concepts: ["除法"], hint: "print(10 / 2)", timeLimit: 45 },
  { id: 6, title: "判断大小", description: "100 比 50 大吗？", task: "打印 100 > 50。", starterCode: "", concepts: ["布尔值"], hint: "print(100 > 50)", timeLimit: 45 },
  { id: 7, title: "循环三次", description: "喊三声加油。", task: "使用 for 循环打印 'Go' 3次。", starterCode: "", concepts: ["循环"], hint: "for i in range(3): print('Go')", timeLimit: 60 },
  { id: 8, title: "我的清单", description: "列出两个水果。", task: "创建列表 ['Apple', 'Banana'] 并打印。", starterCode: "", concepts: ["列表"], hint: "print(['Apple', 'Banana'])", timeLimit: 60 },
  { id: 9, title: "自定义函数", description: "定义一个函数。", task: "定义 func() 打印 'Hi'，然后调用它。", starterCode: "", concepts: ["函数"], hint: "def func(): print('Hi')\nfunc()", timeLimit: 90 },
  { id: 10, title: "最终挑战", description: "综合运用！", task: "如果 5 > 3，打印 'Win'。", starterCode: "", concepts: ["逻辑"], hint: "if 5 > 3: print('Win')", timeLimit: 90 },
];

// BANK B: Speed (Math Focus)
const LEVELS_B_ZH: LevelData[] = [
  {
    id: 1,
    title: "极速问候 (B卷)",
    description: "只有最快的手速才能获胜！",
    task: "打印 'Go Go Go' 到屏幕上。",
    starterCode: "# 快！\n",
    concepts: ["print"],
    hint: "print('Go Go Go')",
    timeLimit: 30
  },
  {
    id: 2,
    title: "队伍名称 (B卷)",
    description: "给你的队伍起个名字。",
    task: "创建变量 `team` 赋值为 'Tigers'，并打印。",
    starterCode: "",
    concepts: ["变量"],
    hint: "team = 'Tigers'\nprint(team)",
    timeLimit: 45
  },
  {
    id: 3,
    title: "混合运算 (B卷)",
    description: "你需要计算 50 加 50 再减去 10。",
    task: "计算 50 + 50 - 10 并打印。",
    starterCode: "",
    concepts: ["混合运算"],
    hint: "print(50 + 50 - 10)",
    timeLimit: 45
  },
  { id: 4, title: "乘法挑战", description: "计算 12 乘以 12。", task: "打印 12 * 12。", starterCode: "", concepts: ["乘法"], hint: "print(12 * 12)", timeLimit: 30 },
  { id: 5, title: "取余数", description: "10 除以 3 的余数是多少？", task: "打印 10 % 3。", starterCode: "", concepts: ["取模"], hint: "print(10 % 3)", timeLimit: 45 },
  { id: 6, title: "等于判断", description: "1 加 1 等于 2 吗？", task: "打印 1 + 1 == 2。", starterCode: "", concepts: ["比较"], hint: "print(1 + 1 == 2)", timeLimit: 45 },
  { id: 7, title: "倒计时循环", description: "从0打印到4。", task: "使用 for i in range(5) 打印 i。", starterCode: "", concepts: ["循环"], hint: "for i in range(5): print(i)", timeLimit: 60 },
  { id: 8, title: "数字列表", description: "创建一个包含 1, 2, 3 的列表。", task: "创建列表 [1, 2, 3] 并打印。", starterCode: "", concepts: ["列表"], hint: "print([1, 2, 3])", timeLimit: 60 },
  { id: 9, title: "加法函数", description: "定义函数 add(a, b) 返回和。", task: "定义 add(a, b) 返回 a+b，并打印 add(1, 2)。", starterCode: "", concepts: ["函数"], hint: "def add(a,b): return a+b\nprint(add(1,2))", timeLimit: 90 },
  { id: 10, title: "终极算术", description: "计算 (10+10)*5。", task: "计算并打印 (10+10)*5。", starterCode: "", concepts: ["运算"], hint: "print((10+10)*5)", timeLimit: 60 },
];

// BANK C: Creative
const LEVELS_C_ZH: LevelData[] = [
  {
    id: 1,
    title: "神秘代码 (C卷)",
    description: "让我们像黑客一样开始。",
    task: "打印数字 007。",
    starterCode: "",
    concepts: ["print", "数字"],
    hint: "print(7)",
    timeLimit: 60
  },
  {
    id: 2,
    title: "我的名字 (C卷)",
    description: "告诉裁判你是谁。",
    task: "创建变量 `me` 存储你的名字(字符串)，并打印。",
    starterCode: "",
    concepts: ["变量"],
    hint: "me = 'Alice'\nprint(me)",
    timeLimit: 60
  },
   {
    id: 3,
    title: "倒计时 (C卷)",
    description: "还剩3秒！",
    task: "使用 print 打印 3，然后下一行打印 2，再下一行打印 1。",
    starterCode: "",
    concepts: ["多行打印"],
    hint: "print(3)\nprint(2)\nprint(1)",
    timeLimit: 50
  },
  { id: 4, title: "大写转换", description: "把 'abc' 变成大写。", task: "打印 'abc'.upper()。", starterCode: "", concepts: ["字符串方法"], hint: "print('abc'.upper())", timeLimit: 45 },
  { id: 5, title: "字符串长度", description: "单词 'Python' 有几个字母？", task: "打印 len('Python')。", starterCode: "", concepts: ["len"], hint: "print(len('Python'))", timeLimit: 45 },
  { id: 6, title: "如果不等于", description: "如果 1 不等于 2。", task: "打印 1 != 2。", starterCode: "", concepts: ["比较"], hint: "print(1 != 2)", timeLimit: 45 },
  { id: 7, title: "while循环", description: "无限循环太危险，只打印一次。", task: "i=1; while i<2: print(i); i=i+1", starterCode: "", concepts: ["while"], hint: "i=1\nwhile i<2:\n print(i)\n i+=1", timeLimit: 90 },
  { id: 8, title: "混合列表", description: "列表包含数字和字符串。", task: "打印 [1, 'a']。", starterCode: "", concepts: ["列表"], hint: "print([1, 'a'])", timeLimit: 60 },
  { id: 9, title: "问候函数", description: "定义 greet(name)。", task: "定义 greet(name) 打印 name，调用 greet('Hi')。", starterCode: "", concepts: ["函数"], hint: "def greet(n): print(n)\ngreet('Hi')", timeLimit: 90 },
  { id: 10, title: "密码检查", description: "如果 pw 是 '123' 打印 OK。", task: "pw='123'; if pw=='123': print('OK')", starterCode: "", concepts: ["逻辑"], hint: "pw='123'\nif pw=='123': print('OK')", timeLimit: 90 },
];

// Helper to ensure banks exist for other languages (fallback to ZH for demo if EN missing)
const fillLevels = (base: LevelData[]) => base;

export const QUESTION_BANKS = {
  zh: {
    A: fillLevels(LEVELS_A_ZH),
    B: fillLevels(LEVELS_B_ZH),
    C: fillLevels(LEVELS_C_ZH),
  },
  en: {
    A: fillLevels(LEVELS_A_ZH), 
    B: fillLevels(LEVELS_B_ZH),
    C: fillLevels(LEVELS_C_ZH),
  }
};

export const getLevels = (lang: Language, bank: 'A'|'B'|'C' = 'A') => {
  return QUESTION_BANKS[lang][bank];
};

export const COACH_PERSONAS: Record<CoachPersona, string> = {
  gentle: "You are a very gentle, patient, and sweet Nanny-like tutor. Use lots of hearts and soft language.",
  sarcastic: "You are a funny, slightly sarcastic robot. You tease the user playfully about their code but still help them.",
  professional: "You are a serious, professional computer science professor. Be precise, concise, and academic.",
  concise: "You are extremely efficient. Give shortest possible hints. No fluff.",
  stepbystep: "You are a methodical guide. Always break down instructions into Step 1, Step 2, Step 3."
};

export const UI_STRINGS = {
  en: {
    appTitle: "PySparky Party",
    xp: "XP",
    mapBtn: "Map",
    resetBtn: "Reset",
    runBtn: "Run",
    casting: "Compiling...",
    outputTitle: "Terminal Output",
    success: "Success",
    tryAgain: "Runtime Error",
    placeholder: "# Type your code here...",
    mission: "Mission",
    coachTitle: "Sparky AI",
    coachSubtitle: "Virtual Coach",
    thinking: "Thinking...",
    chatPlaceholder: "Ask for help...",
    welcomeChat: "Ready for the competition? The clock is ticking! ⏱️",
    backToMap: "Back to Map",
    running: "Executing...",
    playNow: "START",
    locked: "LOCKED",
    completed: "DONE",
    mapTitle: "Tournament Map",
    microphoneError: "Voice input not supported.",
    tapToSpeak: "Speak",
    listening: "Listening...",
    settings: "Settings",
    voice: "Voice",
    testVoice: "Test",
    persona: "Coach Style",
    personas: {
      gentle: "Gentle",
      sarcastic: "Sarcastic",
      professional: "Pro",
      concise: "Concise",
      stepbystep: "Step-by-Step"
    },
    tutorial: {
      welcome: "Welcome to PySparky Party Mode! 🏆 It's time to compete!",
      map: "Select a level. Be fast! Time affects your score.",
      editor: "Write code here.",
      run: "Run to score points.",
      chat: "Ask for help (but it takes time!).",
      next: "Next",
      finish: "Let's Party!"
    },
    victory: {
      title: "STAGE CLEARED!",
      subtitle: "Amazing performance!",
      nextLevel: "Map",
      replay: "Replay",
      stars: "Rating",
      score: "TOTAL SCORE",
      timeBonus: "Time Bonus",
      baseScore: "Base Score"
    },
    bankSelector: "Question Bank",
    leaderboard: "Leaderboard",
    switchUser: "Switch Player",
    newUser: "New Player",
    selectUser: "Who is playing?",
    create: "Create",
    rank: "Rank",
    player: "Player",
    totalScore: "Total Score"
  },
  zh: {
    appTitle: "PySparky 派对竞技版",
    xp: "总分",
    mapBtn: "地图",
    resetBtn: "重置",
    runBtn: "提交运行",
    casting: "编译中...",
    outputTitle: "裁判终端 (Terminal)",
    success: "运行成功",
    tryAgain: "运行失败",
    placeholder: "# 比赛倒计时中...输入代码...",
    mission: "本关任务",
    coachTitle: "Sparky 智能裁判",
    coachSubtitle: "AI 导师",
    thinking: "裁判判定中...",
    chatPlaceholder: "请求提示 (不扣分)...",
    welcomeChat: "准备好比赛了吗？时间紧迫，只有最快的程序员才能获胜！⏱️",
    backToMap: "返回大厅",
    running: "执行中...",
    playNow: "挑战",
    locked: "锁定",
    completed: "已完成",
    mapTitle: "竞技场地图",
    microphoneError: "不支持语音。",
    tapToSpeak: "点击说话",
    listening: "正在听...",
    settings: "设置",
    voice: "裁判音色",
    testVoice: "试听",
    persona: "裁判风格",
    personas: {
      gentle: "温柔鼓励型",
      sarcastic: "毒舌压力型",
      professional: "专业严谨型",
      concise: "极速效率型",
      stepbystep: "新手引导型"
    },
    tutorial: {
      welcome: "欢迎来到 PySparky 派对模式！🏆 这是一个拼速度和准确率的游戏！",
      map: "这是比赛地图。每关都有时间限制，越快分数越高！",
      editor: "在这里编写你的胜利用代码！",
      run: "点击运行来提交答案，争取一次过！",
      chat: "如果卡住了可以问我，但我可能会嘲讽你哦。",
      next: "下一步",
      finish: "开始比赛！"
    },
    victory: {
      title: "挑战成功！",
      subtitle: "表现太棒了！",
      nextLevel: "返回地图",
      replay: "重试刷分",
      stars: "评级",
      score: "本局得分",
      timeBonus: "时间奖励",
      baseScore: "基础得分"
    },
    bankSelector: "当前题库",
    leaderboard: "排行榜",
    switchUser: "切换选手",
    newUser: "新选手",
    selectUser: "谁在挑战？",
    create: "创建",
    rank: "排名",
    player: "选手",
    totalScore: "总积分"
  }
};
