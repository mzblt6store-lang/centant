import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in the Settings > Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export async function handleGeminiGenerate(reqBody: any) {
  const { prompt, systemInstruction, model } = reqBody;
  if (!prompt) {
    throw new Error("Prompt is required");
  }

  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: model || 'gemini-3.5-flash',
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
    },
  });

  return { text: response.text };
}
