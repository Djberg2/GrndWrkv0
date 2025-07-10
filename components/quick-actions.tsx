import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Calendar, BarChart3, Download } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "Schedule Quote",
      description: "Add a new appointment",
      icon: Calendar,
      action: "schedule",
    },
    {
      title: "Update Pricing",
      description: "Modify service rates",
      icon: Settings,
      action: "pricing",
    },
    {
      title: "View Analytics",
      description: "Check performance",
      icon: BarChart3,
      action: "analytics",
    },
    {
      title: "Export Data",
      description: "Download reports",
      icon: Download,
      action: "export",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Button key={action.action} variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
            <action.icon className="w-5 h-5 mr-3 text-gray-500" />
            <div className="text-left">
              <div className="font-medium">{action.title}</div>
              <div className="text-sm text-gray-500">{action.description}</div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
