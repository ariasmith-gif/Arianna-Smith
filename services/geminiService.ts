
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateScriptImprovement = async (currentScript: string, instruction: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Current Script Content:\n${currentScript}\n\nInstruction: ${instruction}\n\nPlease rewrite or improve the script based on the instruction. Return only the new script content in professional screenplay format.`,
    config: {
      temperature: 0.7,
      thinkingConfig: { thinkingBudget: 2000 }
    }
  });
  return response.text || '';
};

export const generateStoryboardImage = async (prompt: string): Promise<string> => {
  const ai = getAI();
  const fullPrompt = `Cinematic storyboard frame, high quality, movie concept art, professional lighting, film grain, ${prompt}`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: fullPrompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image data received");
};

export const startVideoGeneration = async (prompt: string): Promise<string> => {
  const ai = getAI();
  const operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `Cinematic movie scene: ${prompt}. High production value, realistic, 4k.`,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });
  return operation.name || ''; // Return operation name for polling
};

export const pollVideoOperation = async (operationName: string): Promise<{ done: boolean; url?: string }> => {
  const ai = getAI();
  const operation = await ai.operations.getVideosOperation({ operation: { name: operationName } });
  
  if (operation.done) {
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
      const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await videoResponse.blob();
      return { done: true, url: URL.createObjectURL(blob) };
    }
    return { done: true };
  }
  return { done: false };
};

export const getCinematicAdvice = async (history: { role: string; text: string }[], message: string) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are a world-class film director and cinematic consultant. Help the user with plot development, camera angles, lighting setups, and directing actors. Be creative, practical, and inspiring.",
    },
  });

  // Simple history conversion for this example
  const response = await chat.sendMessage({ message });
  return response.text;
};
