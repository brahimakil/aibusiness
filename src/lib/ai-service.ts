import { gemini } from './gemini';

type Idea = {
  id: string
  title: string
  description: string | null
  category: string
  created_at: string
}

export const aiService = {
  async generateIdeas(prompt: string): Promise<Idea[]> {
    try {
      const titles = await gemini.generateBusinessIdeas(prompt);
      
      const ideas = await Promise.all(
        titles.map(async (title) => {
          const description = await gemini.generateBusinessDescription(title);
          return {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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