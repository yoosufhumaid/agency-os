'use server'

import { revalidatePath } from 'next/cache'
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

  await supabaseAdmin.from('profiles').delete().eq('id', userId)
  await supabaseAdmin.auth.admin.deleteUser(userId)

  revalidatePath('/dashboard/owner/team')
}