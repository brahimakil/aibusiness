import { supabase } from './supabase'
import type { BusinessIdea, AiPrompt, DbResult } from '@/types/database'

export const database = {
  // Business Ideas
  async getRandomIdeas(limit = 10): Promise<BusinessIdea[]> {
    const { data, error } = await supabase
      .from('business_ideas')
      .select('*')
      .limit(limit)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createBusinessIdea(idea: Partial<BusinessIdea>): Promise<DbResult<BusinessIdea>> {
    const { data, error } = await supabase
      .from('business_ideas')
      .insert([{
        title: idea.title,
        description: idea.description,
        category: idea.category,
        ai_generated: true,
        popularity_score: 0,
        metadata: {},
        user_id: null
      }])
      .select()
      .single();

    return { data, error };
  },

  async createAiPrompt(prompt: Partial<AiPrompt>): Promise<DbResult<AiPrompt>> {
    const { data, error } = await supabase
      .from('ai_prompts')
      .insert([{
        prompt_text: prompt.prompt_text,
        icon_name: prompt.icon_name,
        usage_count: 0
      }])
      .select()
      .single()

    return { data, error }
  },

  async saveIdea(ideaId: string, userId: string): Promise<DbResult<any>> {
    const { data, error } = await supabase
      .from('saved_ideas')
      .insert([{
        user_id: userId,
        idea_id: ideaId,
        saved_at: new Date().toISOString()
      }])
      .select()
      .single();

    return { data, error };
  },

  async unsaveIdea(ideaId: string, userId: string): Promise<DbResult<any>> {
    const { data, error } = await supabase
      .from('saved_ideas')
      .delete()
      .match({ user_id: userId, idea_id: ideaId });

    return { data, error };
  },

  async getUserSavedIdeas(userId: string): Promise<BusinessIdea[]> {
    const { data, error } = await supabase
      .from('saved_ideas')
      .select(`
        idea_id,
        business_ideas (*)
      `)
      .eq('user_id', userId)
      .order('saved_at', { ascending: false });

    if (error) throw error;
    return data?.map(item => item.business_ideas) || [];
  },

  async isIdeaSaved(ideaId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('saved_ideas')
      .select('id')
      .match({ user_id: userId, idea_id: ideaId })
      .single();

    return !error && data !== null;
  }
} 