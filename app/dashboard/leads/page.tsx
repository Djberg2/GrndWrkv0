import { DashboardLayout } from "@/components/dashboard-layout"
import { LeadsTable } from "@/components/leads-table"
import { LeadsFilters } from "@/components/leads-filters"
import { Button } from "@/components/ui/button"
import { Download, Filter } from "lucide-react"

export default function LeadsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leads & Quotes</h1>
            <p className="text-gray-600">Manage your customer inquiries and scheduled quotes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <LeadsFilters />
        <LeadsTable />
      </div>
    </DashboardLayout>
  )
}
