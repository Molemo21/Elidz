import AdminWrapper from './admin-wrapper'

export default async function AdminDashboardPage() {
  // Use client-side wrapper to handle session check
  // This works around the cookie sync timing issue
  return <AdminWrapper />
}
