import { DashboardLayout } from "@/components/dashboard-layout"
import CalendarView from "@/components/calendar-view"
import { AvailabilitySettings } from "@/components/availability-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CalendarPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar & Scheduling</h1>
          <p className="text-gray-600">Manage your appointments and availability</p>
        </div>

        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="availability">Availability Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <CalendarView />
          </TabsContent>

          <TabsContent value="availability">
            <AvailabilitySettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
