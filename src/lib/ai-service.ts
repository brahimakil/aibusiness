import { gemini } from './gemini';

export const aiService = {
  async generateAndStoreIdeas(prompt: string): Promise<BusinessIdea[]> {
    try {
      const titles = await gemini.generateBusinessIdeas(prompt);
      
      const ideas = await Promise.all(
        titles.map(async (title) => {
          const description = await gemini.generateBusinessDescription(title);
          return {
            id: `idea-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title,
            description,
            category: prompt,
            created_at: new Date().toISOString()
          };
        })
      );

      return ideas;
    } catch (error) {
      console.error('Failed to generate ideas:', error);
      return [];
    }
  }
}; 