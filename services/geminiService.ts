import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ConversionFormat } from "../types";

const GEMINI_API_KEY = process.env.API_KEY || '';

// Helper to convert File to Base64
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the Data URI prefix (e.g. "data:application/pdf;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const convertDocument = async (
  file: File,
  format: ConversionFormat,
  customInstructions?: string
): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error("API Key is missing. Please configure it in your environment.");
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const modelId = 'gemini-2.5-flash'; // Optimized for speed and multimodal tasks

  try {
    const filePart = await fileToGenerativePart(file);

    let prompt = `You are an intelligent document conversion engine. 
    Analyze the attached file accurately.
    Your task is to convert the content of this document into valid ${format}.
    
    Format Rules:
    - If JSON: Return a clean JSON object representing the document structure (headers, paragraphs, tables).
    - If CSV: Extract tabular data. If multiple tables exist, separate them with a blank line or focus on the main table.
    - If Markdown: Use proper headers, lists, and bolding to match the document layout.
    - If HTML: Generate semantic HTML5 content (body tags only, no head/html tags).
    - If Summary: Provide a concise, bulleted executive summary of the document.
    
    IMPORTANT: Return ONLY the converted content. Do not include markdown code blocks (like \`\`\`json ... \`\`\`) unless requested as part of the content itself. Do not add conversational text.`;

    if (customInstructions) {
      prompt += `\n\nAdditional User Instructions: ${customInstructions}`;
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [filePart, { text: prompt }],
      },
    });

    let text = response.text || "No content generated.";
    
    // Clean up code blocks if the model adds them despite instructions
    text = text.replace(/^```[a-z]*\n/i, '').replace(/\n```$/, '');

    return text.trim();
  } catch (error) {
    console.error("Gemini Conversion Error:", error);
    throw new Error("Failed to convert document. Please ensure the file is a valid PDF or Image.");
  }
};