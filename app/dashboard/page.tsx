import { DashboardLayout } from "@/components/dashboard-layout"
import { OverviewStats } from "@/components/overview-stats"
import { RecentLeads } from "@/components/recent-leads"
import { RevenueChart } from "@/components/revenue-chart"
import { QuickActions } from "@/components/quick-actions"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
        </div>

        <OverviewStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>

        <RecentLeads />
      </div>
    </DashboardLayout>
  )
}
