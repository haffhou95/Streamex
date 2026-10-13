import { redirect } from 'next/navigation'
import { getAdminSession } from '../../lib/auth'
import AdminSidebar from '../../components/dashboard/AdminSidebar'
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')
  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <AdminSidebar />
      <div className="flex-1 lg:ml-60 p-6">{children}</div>
    </div>
  )
}
