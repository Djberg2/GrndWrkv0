import { DashboardLayout } from "@/components/dashboard-layout"
import { PricingSettings } from "@/components/pricing-settings"
import { BusinessSettings } from "@/components/business-settings"
import { WidgetSettings } from "@/components/widget-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your business settings and pricing</p>
        </div>

        <Tabs defaultValue="pricing" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pricing">Pricing & Rates</TabsTrigger>
            <TabsTrigger value="business">Business Info</TabsTrigger>
            <TabsTrigger value="widget">Widget Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="pricing">
            <PricingSettings />
          </TabsContent>

          <TabsContent value="business">
            <BusinessSettings />
          </TabsContent>

          <TabsContent value="widget">
            <WidgetSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
