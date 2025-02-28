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

  async generateBusinessIdeas(prompt: string): Promise<Array<{title: string, category: string}>> {
    const text = await this.generateWithRetry(`
      Generate 10 simple but descriptive business ideas.
      Each response should be in format: Title | Category
      
      Rules:
      1. Use simple words but be specific
      2. Keep titles 3-4 words max
      3. Make the value clear in the title
      4. Mix different business types
      5. Focus on in-demand services
      
      Good examples:
      Quick Wedding Photo App | Photography
      Local Food Delivery Hub | Food Service
      Pet Memory Photo Books | Pet Services
      Remote Work Setup Kit | Office Solutions
      Kids Birthday Party Box | Event Planning
      Handmade Soap Workshop | Craft Business
      Quick Website Builder App | Web Services
      Virtual Fitness Coach | Health Tech
      Emergency Tech Support | IT Service
      Custom Gift Box Service | E-commerce
      
      Bad examples (too vague):
      ❌ Photography Business
      ❌ Online Shop
      ❌ Food Delivery
      
      Return exactly 10 ideas, one per line, using the Title | Category format.
      Make each idea specific and solve a clear need in the market.
    `);
    
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        const [title, category] = line.split('|').map(s => s.trim());
        return { title, category: category || 'Business Innovation' };
      })
      .slice(0, 10);
  },

  async generateBusinessDescription(title: string): Promise<string> {
    return this.generateWithRetry(`
      Create a detailed business plan for: "${title}"
      
      Write a clear and structured analysis using these sections.
      Include relevant emojis at the start of each section.
      Format each section header in plain text followed by a colon, then the content.
      Do not use any special characters, asterisks, or markdown symbols.
      
      Format like this:
      🎯 Quick Overview:
      Write 2-3 sentences about core concept and value proposition here.
      Write 2-3 sentences about key differentiators here.
      
      💰 Expected Earnings:
      Write 3 bullet points about revenue potential:
      - First 3 months projection
      - After 6 months projection
      - Year 1 potential
      
      👥 Perfect For:
      Write 4-5 bullet points about ideal customer segments:
      - Customer type 1 with specific needs
      - Customer type 2 with specific needs
      
      🚀 Step-by-Step Launch Plan:
      List 5 numbered steps for implementation:
      1. First step details
      2. Second step details
      
      💡 Success Strategies:
      Write 4 bullet points about key success factors
      
      💰 Required Investment:
      - Minimum starting budget
      - Recommended budget
      - Optional extras
      
      ⚠️ Common Challenges & Solutions:
      List 3 challenges with solutions:
      1. Challenge: Description
         Solution: Approach
      
      Keep paragraphs concise and clear. Use natural language without any special formatting.
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