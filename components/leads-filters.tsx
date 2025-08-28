import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

type Props = {
  search: string
  status: "all" | "new" | "scheduled" | "contacted" | "quote-sent"
  service: "all" | "lawn-mowing" | "landscaping" | "tree-removal" | "hardscaping"
  createdRange: "all" | "today" | "week" | "month"
  scheduledRange: "all" | "today" | "week" | "month"
  onSearch: (v: string) => void
  onStatus: (v: Props["status"]) => void
  onService: (v: Props["service"]) => void
  onCreatedRange: (v: Props["createdRange"]) => void
  onScheduledRange: (v: Props["scheduledRange"]) => void
  onClear: () => void
}

export function LeadsFilters({ search, status, service, createdRange, scheduledRange, onSearch, onStatus, onService, onCreatedRange, onScheduledRange, onClear }: Props) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search leads..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={status} onValueChange={(v) => onStatus(v as Props["status"]) }>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="quote-sent">Quote Sent</SelectItem>
              </SelectContent>
            </Select>

            <Select value={service} onValueChange={(v) => onService(v as Props["service"]) }>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="lawn-mowing">Lawn Mowing</SelectItem>
                <SelectItem value="landscaping">Landscaping</SelectItem>
                <SelectItem value="tree-removal">Tree Removal</SelectItem>
                <SelectItem value="hardscaping">Hardscaping</SelectItem>
              </SelectContent>
            </Select>

            <Select value={createdRange} onValueChange={(v) => onCreatedRange(v as Props["createdRange"]) }>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Created" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Created Today</SelectItem>
                <SelectItem value="week">Created This Week</SelectItem>
                <SelectItem value="month">Created This Month</SelectItem>
                <SelectItem value="all">All Created</SelectItem>
              </SelectContent>
            </Select>

            <Select value={scheduledRange} onValueChange={(v) => onScheduledRange(v as Props["scheduledRange"]) }>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Scheduled" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Scheduled Today</SelectItem>
                <SelectItem value="week">Scheduled This Week</SelectItem>
                <SelectItem value="month">Scheduled This Month</SelectItem>
                <SelectItem value="all">All Scheduled</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={onClear}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
