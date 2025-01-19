import { BusinessIdea, DbResult } from '@/types/database'

export const database = {
  async getRandomIdeas(limit = 10): Promise<BusinessIdea[]> {
    return Array(limit).fill(null).map((_, index) => ({
      id: `mock-${index}`,
      title: `Business Idea ${index + 1}`,
      description: null,
      category: "Business Innovation",
      created_at: new Date().toISOString(),
      metadata: {}
    }));
  },

  async createBusinessIdea(idea: Partial<BusinessIdea>): Promise<DbResult<BusinessIdea>> {
    const mockIdea = {
      id: `mock-${Date.now()}`,
      title: idea.title || '',
      description: idea.description || null,
      category: idea.category || "Business Innovation",
      created_at: new Date().toISOString(),
      metadata: {}
    };

    return { data: mockIdea, error: null };
  }
}; 