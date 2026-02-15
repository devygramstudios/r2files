
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect('/login')
}
