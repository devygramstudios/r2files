
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import FileManager from '@/components/files/FileManager'

export const runtime = 'edge'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  return (
    <DashboardLayout userEmail={user.email}>
      <FileManager />
    </DashboardLayout>
  )
}
