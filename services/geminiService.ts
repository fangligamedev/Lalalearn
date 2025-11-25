
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MessageRole, ValidationResult, ChatMessage, Language, AIContext, CoachPersona } from '../types';
import { COACH_PERSONAS } from '../constants';

const apiKey = process.env.API_KEY || ''; 
const MODEL_NAME = 'gemini-2.5-flash';

// Zeabur AI Hub configuration
const modelParams = {
  model: MODEL_NAME,
};

const requestOptions = {
  baseUrl: 'https://hnd1.aihub.zeabur.ai/gemini',
};

// 1. Validator Service
export const validateCodeWithGemini = async (code: string, levelTask: string, language: Language): Promise<ValidationResult> => {
  if (!apiKey) {
    return {
      success: false,
      output: "Error: API Key Missing",
      feedback: language === 'zh' ? "API Key 丢失！请找家长帮忙。" : "API Key is missing! Ask a parent to help."
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // @ts-ignore - The types for getGenerativeModel might not perfectly match if using older versions or different params, but this is per Zeabur docs
    const model = genAI.getGenerativeModel(modelParams, requestOptions);
    
    const prompt = `
      Language: ${language === 'zh' ? 'Chinese' : 'English'}
      Task: ${levelTask}
      
      User's Python Code:
      \`\`\`python
      ${code}
      \`\`\`
      
      Act as a strict Python Interpreter.
      
      1. If the code has syntax errors or runtime errors (e.g., missing quotes, undefined variables, indentation errors):
         - Set 'success' to FALSE.
         - In 'output', generate a REALISTIC Python Traceback (e.g., "File 'magic_script.py', line 1... SyntaxError: ...").
         - In 'feedback', explain the error simply in ${language === 'zh' ? 'Chinese' : 'English'}.

      2. If the code runs but fails to complete the logic of the task:
         - Set 'success' to FALSE.
         - In 'output', show what the code actually prints (simulated).
         - In 'feedback', explain why it is wrong.

      3. If the code is correct and completes the task:
         - Set 'success' to TRUE.
         - In 'output', show the simulated output.
         - In 'feedback', give praise.
         
      Respond in JSON format: { "success": boolean, "output": string, "feedback": string }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    if (!text) throw new Error("No response from AI");
    
    // Clean up markdown code blocks if present
    const cleanText = text.replace(/```json\n|\n```/g, '').trim();
    
    return JSON.parse(cleanText) as ValidationResult;

  } catch (error) {
    console.error("Validation error:", error);
    return {
      success: false,
      output: "Runtime Error: Connection Lost\n" + error,
      feedback: language === 'zh' ? "网络出错了..." : "Network error..."
    };
  }
};

// 2. Chat/Tutor Service
export const sendChatMessage = async (
  history: ChatMessage[], 
  newMessage: string, 
  language: Language,
  persona: CoachPersona,
  context?: AIContext
): Promise<string> => {
  if (!apiKey) return language === 'zh' ? "请配置 API Key。" : "Please configure API Key.";

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // @ts-ignore
    const model = genAI.getGenerativeModel(modelParams, requestOptions);
    
    // Inject Persona Instruction
    const personaInstruction = COACH_PERSONAS[persona] || COACH_PERSONAS['gentle'];

    let systemInstruction = `
    You are Sparky. 
    Personality: ${personaInstruction}
    Language: ${language === 'zh' ? 'Chinese' : 'English'}.
    `;
    
    if (context) {
      systemInstruction += `
      [Game Context]
      Level: ${context.currentLevel}
      Task: ${context.levelTask}
      User XP: ${context.userXp}
      Code:
      \`\`\`python
      ${context.currentCode}
      \`\`\`
      `;
    }

    // Convert history to Gemini format
    const chatHistory = history.map(msg => ({
      role: msg.role === MessageRole.USER ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Start chat with history and system instruction
    // Note: systemInstruction needs to be passed to getGenerativeModel in newer versions or simulated in history
    // For @google/generative-ai, systemInstruction is supported in getGenerativeModel
    
    // Re-initialize model with system instruction for chat
    const chatModel = genAI.getGenerativeModel({
        ...modelParams,
        systemInstruction: systemInstruction
    }, requestOptions);

    const chat = chatModel.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(newMessage);
    return result.response.text() || "...";

  } catch (error) {
    console.error("Chat error:", error);
    return "...";
  }
};
