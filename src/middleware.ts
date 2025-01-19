import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    // Refresh session if it exists
    if (session) {
      const { data: { session: refreshedSession }, error: refreshError } = 
        await supabase.auth.refreshSession();
      
      if (refreshError) {
        // If refresh fails, clear the session
        await supabase.auth.signOut();
      }
    }
  } catch (error) {
    console.error('Middleware auth error:', error);
    // Don't throw, let the request continue
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    '/auth/error'
  ],
}; 