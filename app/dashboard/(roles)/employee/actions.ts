'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabaseServer'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function checkIn() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { error: 'Not authenticated' }

  const today = new Date().toISOString().split('T')[0]
  const now = new Date().toTimeString().split(' ')[0]

  const { error } = await supabaseAdmin.from('attendance').insert({
    user_id: session.user.id,
    date: today,
    checked_in_at: now,
    status: 'present',
  })

  revalidatePath('/dashboard/employee')
  return error ? { error: error.message } : { success: true }
}