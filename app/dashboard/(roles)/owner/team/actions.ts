'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function inviteTeamMember(formData: FormData) {
  const full_name = formData.get('full_name') as string
  const email = formData.get('email') as string
  const role = formData.get('role') as string

  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    data: { full_name, role },
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
  })

  if (error) return { error: error.message }
  if (!data?.user?.id) return { error: 'No user returned from invite' }

  await supabaseAdmin
    .from('profiles')
    .upsert({
      id: data.user.id,
      email,
      full_name,
      role,
    }, { onConflict: 'id' })

  revalidatePath('/dashboard/owner/team')
}

export async function removeTeamMember(formData: FormData) {
  const userId = formData.get('userId') as string
  if (!userId) return

  // Delete related records first to avoid foreign key issues
  await supabaseAdmin.from('tasks').update({ assigned_to: null }).eq('assigned_to', userId)
  await supabaseAdmin.from('messages').delete().eq('sender_id', userId)
  await supabaseAdmin.from('messages').delete().eq('receiver_id', userId)
  await supabaseAdmin.from('attendance').delete().eq('user_id', userId)

  // Then delete profile and auth user
  await supabaseAdmin.from('profiles').delete().eq('id', userId)
  await supabaseAdmin.auth.admin.deleteUser(userId)

  revalidatePath('/dashboard/owner/team')
  redirect('/dashboard/owner/team')
}