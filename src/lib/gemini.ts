import { GoogleGenerativeAI } from '@google/generative-ai';
import { sleep } from '@/utils/helpers';
import { requestQueue } from '@/utils/requestQueue';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'dummy-key');
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

export const gemini = {
  async generateWithRetry(prompt: string, retries = 0): Promise<string> {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return 'API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables.';
    }

    return requestQueue.add(async () => {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (error: any) {
        if (error.message?.includes('429') && retries < MAX_RETRIES) {
          await sleep(RETRY_DELAY * (retries + 1));
          return this.generateWithRetry(prompt, retries + 1);
        }
        return 'Failed to generate content. Please try again later.';
      }
    });
  },

  async generateBusinessIdeas(prompt: string): Promise<string[]> {
    const text = await this.generateWithRetry(`
      Generate 10 innovative business ideas related to: ${prompt}
      Rules:
      1. Each idea should be a short, catchy title
      2. Make them realistic and implementable
      3. Focus on modern trends and technology
      4. Keep each title under 60 characters
      
      Format the response as plain text with one idea per line.
      Do not include numbers or special characters.
    `);
    
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 10);
  },

  async generateBusinessDescription(title: string): Promise<string> {
    return this.generateWithRetry(`
      Create a detailed business plan for: "${title}"
      
      Include these sections:
      1. Business Overview
      2. Target Market
      3. Revenue Model
      4. Key Features
      5. Implementation Steps
      6. Potential Challenges
      
      Make it concise but informative. Use markdown formatting.
    `);
  },

  async generatePromptCategories(): Promise<string[]> {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent(`
      Generate 5 trending business categories for 2024.
      Rules:
      1. Make them modern and innovative
      2. Keep each category short and clear
      3. Focus on emerging markets
      
      Format the response as plain text with one category per line.
      Do not include numbers or special characters.
    `);
    
    const response = await result.response;
    return response.text()
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 5);
  }
}; 