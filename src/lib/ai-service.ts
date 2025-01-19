import { gemini } from './gemini';
import { database } from './database';
import type { BusinessIdea } from '@/types/database';

export const aiService = {
  async generateAndStoreIdeas(prompt: string): Promise<BusinessIdea[]> {
    try {
      // Get ideas from Gemini
      const titles = await gemini.generateBusinessIdeas(prompt);
      
      // Store each idea and get descriptions
      const storedIdeas = await Promise.all(
        titles.map(async (title) => {
          const description = await gemini.generateBusinessDescription(title);
          const result = await database.createBusinessIdea({
            title,
            description,
            category: prompt
          });
          
          if (result.error) throw result.error;
          return result.data;
        })
      );

      return storedIdeas.filter((idea): idea is BusinessIdea => idea !== null);
    } catch (error) {
      console.error('Failed to generate ideas:', error);
      return [];
    }
  }
}; 