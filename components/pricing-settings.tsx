"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2 } from "lucide-react"

export function PricingSettings() {
  const [services, setServices] = useState([
    { id: 1, name: "Lawn Mowing", basePrice: 50, pricePerSqft: 0.05, markup: 20 },
    { id: 2, name: "Landscaping Design", basePrice: 200, pricePerSqft: 0.15, markup: 30 },
    { id: 3, name: "Tree Removal", basePrice: 150, pricePerSqft: 0.08, markup: 25 },
    { id: 4, name: "Hardscaping", basePrice: 300, pricePerSqft: 0.25, markup: 35 },
  ])

  const addService = () => {
    const newService = {
      id: Date.now(),
      name: "",
      basePrice: 0,
      pricePerSqft: 0,
      markup: 20,
    }
    setServices([...services, newService])
  }

  const removeService = (id: number) => {
    setServices(services.filter((service) => service.id !== id))
  }

  const updateService = (id: number, field: string, value: string | number) => {
    setServices(services.map((service) => (service.id === id ? { ...service, [field]: value } : service)))
  }

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Pricing Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="labor-rate">Hourly Labor Rate</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input id="labor-rate" placeholder="45" className="pl-8" defaultValue="45" />
              </div>
            </div>
            <div>
              <Label htmlFor="travel-fee">Travel Fee (per mile)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input id="travel-fee" placeholder="2.50" className="pl-8" defaultValue="2.50" />
              </div>
            </div>
            <div>
              <Label htmlFor="min-charge">Minimum Charge</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input id="min-charge" placeholder="75" className="pl-8" defaultValue="75" />
              </div>
            </div>
            <div>
              <Label htmlFor="emergency-rate">Emergency Rate Multiplier</Label>
              <Select defaultValue="1.5">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.25">1.25x</SelectItem>
                  <SelectItem value="1.5">1.5x</SelectItem>
                  <SelectItem value="2">2x</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service-Specific Pricing */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Service-Specific Pricing</CardTitle>
          <Button onClick={addService} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {services.map((service, index) => (
              <div key={service.id}>
                {index > 0 && <Separator className="my-6" />}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Service {index + 1}</h4>
                    {services.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeService(service.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label>Service Name</Label>
                      <Input
                        value={service.name}
                        onChange={(e) => updateService(service.id, "name", e.target.value)}
                        placeholder="e.g., Lawn Mowing"
                      />
                    </div>
                    <div>
                      <Label>Base Price</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          value={service.basePrice}
                          onChange={(e) => updateService(service.id, "basePrice", Number(e.target.value))}
                          className="pl-8"
                          type="number"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Price per Sq Ft</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          value={service.pricePerSqft}
                          onChange={(e) => updateService(service.id, "pricePerSqft", Number(e.target.value))}
                          className="pl-8"
                          type="number"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Markup (%)</Label>
                      <div className="relative">
                        <Input
                          value={service.markup}
                          onChange={(e) => updateService(service.id, "markup", Number(e.target.value))}
                          className="pr-8"
                          type="number"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-green-600 hover:bg-green-700">Save Pricing Settings</Button>
      </div>
    </div>
  )
}
