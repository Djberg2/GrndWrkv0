"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Copy, Eye } from "lucide-react"

export function WidgetSettings() {
  const embedCode = `<script src="https://widget.grndwrk.com/embed.js"></script>
<div id="grndwrk-widget" data-business-id="your-business-id"></div>`

  return (
    <div className="space-y-6">
      {/* Widget Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Widget Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="widget-title">Widget Title</Label>
              <Input id="widget-title" defaultValue="Get Your Instant Estimate" />
            </div>
            <div>
              <Label htmlFor="widget-subtitle">Widget Subtitle</Label>
              <Input id="widget-subtitle" defaultValue="Powered by GrndWrk AI" />
            </div>
            <div>
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center space-x-2">
                <Input id="primary-color" defaultValue="#16a34a" className="w-24" />
                <div className="w-8 h-8 bg-green-600 rounded border" />
              </div>
            </div>
            <div>
              <Label htmlFor="button-text">Button Text</Label>
              <Input id="button-text" defaultValue="Get Quote" />
            </div>
          </div>

          <div>
            <Label htmlFor="welcome-message">Welcome Message</Label>
            <Textarea
              id="welcome-message"
              defaultValue="Get an instant AI-powered estimate for your landscaping project. Upload photos and receive pricing in seconds!"
            />
          </div>
        </CardContent>
      </Card>

      {/* Widget Behavior */}
      <Card>
        <CardHeader>
          <CardTitle>Widget Behavior</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Require Photos</Label>
              <p className="text-sm text-gray-500">Force customers to upload photos before getting estimates</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Show Instant Estimates</Label>
              <p className="text-sm text-gray-500">Display AI estimates immediately or require quote scheduling</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Scheduling</Label>
              <p className="text-sm text-gray-500">Allow customers to book quote appointments directly</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min-sqft">Minimum Square Footage</Label>
              <Input id="min-sqft" type="number" defaultValue="100" />
            </div>
            <div>
              <Label htmlFor="max-sqft">Maximum Square Footage</Label>
              <Input id="max-sqft" type="number" defaultValue="10000" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Available Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">Select which services to show in your widget</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Lawn Mowing",
              "Landscaping Design",
              "Tree Removal",
              "Hardscaping",
              "Garden Design",
              "Irrigation",
              "Lawn Care",
              "Mulching",
              "Pruning",
              "Snow Removal",
            ].map((service) => (
              <div key={service} className="flex items-center space-x-2">
                <Switch
                  defaultChecked={["Lawn Mowing", "Landscaping Design", "Tree Removal", "Hardscaping"].includes(
                    service,
                  )}
                />
                <Label className="text-sm">{service}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Website Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Embed Code</Label>
            <p className="text-sm text-gray-500 mb-2">
              Copy this code and paste it into your website where you want the widget to appear
            </p>
            <div className="relative">
              <Textarea value={embedCode} readOnly className="font-mono text-sm" rows={3} />
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 bg-transparent"
                onClick={() => navigator.clipboard.writeText(embedCode)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="secondary">Status: Active</Badge>
            <Badge variant="outline">Last Updated: 2 days ago</Badge>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview Widget
            </Button>
            <Button>Test Integration</Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-green-600 hover:bg-green-700">Save Widget Settings</Button>
      </div>
    </div>
  )
}
