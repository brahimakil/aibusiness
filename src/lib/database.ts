import { BusinessIdea, AiPrompt, DbResult } from '@/types/database'

export const database = {
  async getRandomIdeas(limit = 10): Promise<BusinessIdea[]> {
    // Return mock data instead of DB query
    return Array(limit).fill(null).map((_, index) => ({
      id: `mock-${index}`,
      title: `Business Idea ${index + 1}`,
      description: null,
      category: "Business Innovation",
      ai_generated: true,
      created_at: new Date().toISOString(),
      popularity_score: 0,
      metadata: {},
      user_id: null
    }));
  },

  async createBusinessIdea(idea: Partial<BusinessIdea>): Promise<DbResult<BusinessIdea>> {
    const mockIdea = {
      id: `mock-${Date.now()}`,
      title: idea.title || '',
      description: idea.description,
      category: idea.category || "Business Innovation",
      ai_generated: true,
      created_at: new Date().toISOString(),
      popularity_score: 0,
      metadata: {},
      user_id: null
    };

    return { data: mockIdea, error: null };
  }
}; 