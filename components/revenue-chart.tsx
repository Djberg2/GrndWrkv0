"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function RevenueChart() {
  // Mock data for the chart
  const data = [
    { month: "Jan", revenue: 8400, leads: 45 },
    { month: "Feb", revenue: 9200, leads: 52 },
    { month: "Mar", revenue: 11800, leads: 68 },
    { month: "Apr", revenue: 10500, leads: 58 },
    { month: "May", revenue: 12450, leads: 72 },
    { month: "Jun", revenue: 13200, leads: 78 },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Revenue & Leads</CardTitle>
        <Select defaultValue="6months">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="1month">Last month</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={item.month} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium text-gray-600">{item.month}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 bg-gray-200 rounded-full flex-1 max-w-48">
                      <div
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: `${(item.revenue / 15000) * 100}%` }}
                      />
                    </div>
                    <div className="text-sm font-semibold text-gray-900">${item.revenue.toLocaleString()}</div>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="h-1 bg-gray-200 rounded-full flex-1 max-w-48">
                      <div className="h-1 bg-blue-400 rounded-full" style={{ width: `${(item.leads / 100) * 100}%` }} />
                    </div>
                    <div className="text-xs text-gray-500">{item.leads} leads</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-sm text-gray-600">Revenue</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full" />
            <span className="text-sm text-gray-600">Leads</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
