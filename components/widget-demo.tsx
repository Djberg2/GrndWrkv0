"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Camera, DollarSign, Calendar, CheckCircle } from "lucide-react"

export function WidgetDemo() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    service: "",
    sqft: "",
    photos: [] as string[],
    estimate: 0,
  })

  const handleNext = () => {
    if (step === 2) {
      // Simulate AI estimate calculation
      const basePrice = formData.service === "lawn-mowing" ? 50 : formData.service === "landscaping" ? 200 : 150
      const sqftMultiplier = Number.parseInt(formData.sqft) || 1000
      const estimate = Math.round((basePrice + sqftMultiplier * 0.05) * (0.8 + Math.random() * 0.4))
      setFormData((prev) => ({ ...prev, estimate }))
    }
    setStep(step + 1)
  }

  const handleFileUpload = () => {
    // Simulate photo upload
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, "/placeholder.svg?height=100&width=100"],
    }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Widget Header */}
        <div className="bg-green-600 text-white p-4">
          <h3 className="text-lg font-semibold">Get Your Instant Estimate</h3>
          <p className="text-green-100 text-sm">Powered by GrndWrk AI</p>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="service">Service Type</Label>
                <Select
                  value={formData.service}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, service: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lawn-mowing">Lawn Mowing</SelectItem>
                    <SelectItem value="landscaping">Landscaping Design</SelectItem>
                    <SelectItem value="tree-removal">Tree Removal</SelectItem>
                    <SelectItem value="hardscaping">Hardscaping</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sqft">Estimated Square Footage</Label>
                <Input
                  id="sqft"
                  placeholder="e.g., 2500"
                  value={formData.sqft}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sqft: e.target.value }))}
                />
              </div>

              <div>
                <Label>Additional Details</Label>
                <Textarea placeholder="Any specific requirements or notes..." />
              </div>

              <Button
                onClick={handleNext}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!formData.service || !formData.sqft}
              >
                Continue to Photos
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Label>Upload Photos of Your Project Area</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Upload photos to help our AI provide accurate estimates</p>
                  <Button variant="outline" onClick={handleFileUpload}>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Photos
                  </Button>
                </div>

                {formData.photos.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {formData.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo || "/placeholder.svg"}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={handleNext}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={formData.photos.length === 0}
              >
                Get AI Estimate
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="bg-green-50 rounded-lg p-6">
                <DollarSign className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Instant Estimate</h3>
                <div className="text-4xl font-bold text-green-600 mb-2">${formData.estimate}</div>
                <p className="text-gray-600">Based on AI analysis of your photos and project details</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <h4 className="font-semibold mb-2">Estimate includes:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Labor and materials
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Equipment usage
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Cleanup and disposal
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent">
                  Save Estimate
                </Button>
                <Button onClick={handleNext} className="flex-1 bg-green-600 hover:bg-green-700">
                  Schedule Quote
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center space-y-6">
              <Calendar className="w-16 h-16 text-green-600 mx-auto" />
              <h3 className="text-2xl font-bold text-gray-900">Schedule Your Quote</h3>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <Label>Available Times</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tomorrow-9am">Tomorrow 9:00 AM</SelectItem>
                      <SelectItem value="tomorrow-2pm">Tomorrow 2:00 PM</SelectItem>
                      <SelectItem value="friday-10am">Friday 10:00 AM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Duration</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="30 minutes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30min">30 minutes</SelectItem>
                      <SelectItem value="60min">60 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 text-left">
                <div>
                  <Label>Full Name</Label>
                  <Input placeholder="John Smith" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input placeholder="john@example.com" />
                </div>
                <div>
                  <Label>Property Address</Label>
                  <Input placeholder="123 Main St, City, State" />
                </div>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">Confirm Quote Appointment</Button>
            </div>
          )}
        </div>
      </div>

      {/* Demo Note */}
      <div className="text-center mt-6">
        <p className="text-gray-500 text-sm">↑ Interactive demo - try clicking through the process</p>
      </div>
    </div>
  )
}
