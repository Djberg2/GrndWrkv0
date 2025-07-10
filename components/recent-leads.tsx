import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Eye, Calendar, Phone } from "lucide-react"

export function RecentLeads() {
  const leads = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@email.com",
      service: "Landscaping Design",
      estimate: "$2,450",
      status: "New",
      date: "2 hours ago",
      photos: 3,
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike@email.com",
      service: "Lawn Mowing",
      estimate: "$85",
      status: "Scheduled",
      date: "4 hours ago",
      photos: 2,
    },
    {
      id: 3,
      name: "Emily Davis",
      email: "emily@email.com",
      service: "Tree Removal",
      estimate: "$1,200",
      status: "Contacted",
      date: "1 day ago",
      photos: 4,
    },
    {
      id: 4,
      name: "Robert Wilson",
      email: "robert@email.com",
      service: "Hardscaping",
      estimate: "$3,800",
      status: "Quote Sent",
      date: "2 days ago",
      photos: 6,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800"
      case "Scheduled":
        return "bg-green-100 text-green-800"
      case "Contacted":
        return "bg-yellow-100 text-yellow-800"
      case "Quote Sent":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Leads</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leads.map((lead) => (
            <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>
                    {lead.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-gray-900">{lead.name}</div>
                  <div className="text-sm text-gray-500">{lead.email}</div>
                  <div className="text-sm text-gray-600">{lead.service}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{lead.estimate}</div>
                  <div className="text-sm text-gray-500">{lead.photos} photos</div>
                </div>
                <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Calendar className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
