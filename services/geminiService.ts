
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateStoryPlot = async (prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Suggest a book plot and chapter structure based on the following idea. Please provide the response in the same language as the input. Idea: ${prompt}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          plotSummary: { type: Type.STRING },
          chapters: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                objective: { type: Type.STRING }
              },
              required: ['title', 'objective']
            }
          }
        },
        required: ['title', 'plotSummary', 'chapters']
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const refineChapter = async (content: string, instruction: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Refine the following text based on this instruction: "${instruction}". \n\nText: ${content}`,
  });
  return response.text;
};

export const getMuseSuggestion = async (content: string, genre: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a professional editor. Analyze this text for a "${genre}" book and provide a short, inspiring suggestion (max 20 words) to improve the narrative, tone, or rhythm. \n\nText: ${content}`,
  });
  return response.text;
};

export const suggestLayout = async (genre: string, description: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Suggest professional book layout parameters for a "${genre}" book. Description: ${description}. 
    Consider typography, margins, and readability. Return a JSON object for styling a web-based book preview.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          paperSize: { type: Type.STRING, description: "Standard paper size name (e.g., A5, US Trade)" },
          fontScale: { type: Type.NUMBER, description: "Multiplier for base font size (e.g., 1.1)" },
          margins: { type: Type.STRING, description: "CSS margin value (e.g., '15% 10%')" },
          columns: { type: Type.INTEGER, description: "Number of text columns (usually 1 or 2)" },
          lineHeight: { type: Type.NUMBER, description: "CSS line-height value (e.g., 1.6)" },
          styleName: { type: Type.STRING, description: "A catchy name for this layout style" }
        },
        required: ['paperSize', 'fontScale', 'margins', 'columns', 'lineHeight', 'styleName']
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const suggestCoverStyle = async (title: string, genre: string, description: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Suggest cover style parameters for a book titled "${title}" in the genre "${genre}". Description: ${description}. Return a JSON object.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          typography: { type: Type.STRING, enum: ['serif', 'sans', 'script'] },
          filter: { type: Type.STRING, enum: ['none', 'sepia', 'vintage', 'noir', 'warm', 'cold', 'high-contrast', 'dreamy'] },
          overlayOpacity: { type: Type.NUMBER, description: "Value between 0 and 0.8" },
          visualPrompt: { type: Type.STRING, description: "A detailed visual description for image generation" }
        },
        required: ['typography', 'filter', 'overlayOpacity', 'visualPrompt']
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateBookCover = async (title: string, author: string, style: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `Professional book cover for a book titled "${title}" by ${author}. Style: ${style}. High resolution, artistic, cinematic lighting.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "3:4"
      }
    }
  });

  let imageUrl = '';
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }
  return imageUrl;
};
