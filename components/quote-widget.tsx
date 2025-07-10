"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Camera, DollarSign, Calendar, CheckCircle, MapPin, Ruler, Leaf } from "lucide-react"

interface FormData {
  serviceType: string
  squareFootage: string
  zipCode: string
  photos: File[]
}

export function QuoteWidget() {
  const [step, setStep] = useState<"form" | "estimate">("form")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    serviceType: "",
    squareFootage: "",
    zipCode: "",
    photos: [],
  })
  const [estimate, setEstimate] = useState(0)

  const serviceTypes = [
    { value: "lawn-mowing", label: "Lawn Mowing & Maintenance", basePrice: 50 },
    { value: "landscaping", label: "Landscaping Design", basePrice: 200 },
    { value: "tree-removal", label: "Tree Removal", basePrice: 300 },
    { value: "hardscaping", label: "Hardscaping & Patios", basePrice: 400 },
    { value: "garden-design", label: "Garden Design & Planting", basePrice: 150 },
    { value: "irrigation", label: "Irrigation Systems", basePrice: 250 },
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files].slice(0, 5), // Limit to 5 photos
    }))
  }

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }))
  }

  const calculateEstimate = () => {
    const service = serviceTypes.find((s) => s.value === formData.serviceType)
    if (!service) return 0

    const sqft = Number.parseInt(formData.squareFootage) || 1000
    const basePrice = service.basePrice
    const sqftMultiplier =
      service.value === "lawn-mowing"
        ? 0.05
        : service.value === "landscaping"
          ? 0.15
          : service.value === "hardscaping"
            ? 0.25
            : 0.08

    // Add some randomization for realistic estimates
    const estimate = Math.round((basePrice + sqft * sqftMultiplier) * (0.9 + Math.random() * 0.2))
    return estimate
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const calculatedEstimate = calculateEstimate()
    setEstimate(calculatedEstimate)
    setStep("estimate")
    setIsLoading(false)
  }

  const isFormValid = formData.serviceType && formData.squareFootage && formData.zipCode && formData.photos.length > 0

  if (step === "estimate") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold">Your Instant Estimate</CardTitle>
            <p className="text-green-100">AI-powered pricing based on your project details</p>
          </CardHeader>

          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="text-5xl font-bold text-green-600 mb-2">${estimate.toLocaleString()}</div>
              <p className="text-gray-600 text-lg">Estimated project cost</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                What's Included:
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  Professional labor and expertise
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  All necessary materials and supplies
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  Equipment and tool usage
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  Cleanup and debris removal
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <p className="text-blue-800 text-center">
                <strong>Note:</strong> This is an AI-generated estimate. Final pricing will be confirmed during your
                on-site consultation.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Free On-Site Quote
              </Button>

              <Button
                variant="outline"
                className="w-full py-4 text-lg font-medium rounded-xl border-2 hover:bg-gray-50 bg-transparent"
                size="lg"
                onClick={() => setStep("form")}
              >
                Modify Project Details
              </Button>
            </div>

            <div className="text-center mt-6 text-sm text-gray-500">
              No obligation • Free consultation • Licensed & insured
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0">
        <CardHeader className="text-center bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold">Get Your Instant Quote</CardTitle>
          <p className="text-green-100">Professional landscaping services • AI-powered estimates</p>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Service Type */}
            <div className="space-y-3">
              <Label htmlFor="service-type" className="text-lg font-semibold text-gray-900 flex items-center">
                <Leaf className="w-5 h-5 mr-2 text-green-600" />
                What service do you need?
              </Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, serviceType: value }))}
              >
                <SelectTrigger className="h-14 text-lg border-2 rounded-xl hover:border-green-300 focus:border-green-500 transition-colors">
                  <SelectValue placeholder="Choose your landscaping service" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((service) => (
                    <SelectItem key={service.value} value={service.value} className="text-lg py-3">
                      {service.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Square Footage */}
            <div className="space-y-3">
              <Label htmlFor="square-footage" className="text-lg font-semibold text-gray-900 flex items-center">
                <Ruler className="w-5 h-5 mr-2 text-green-600" />
                Estimated square footage
              </Label>
              <Input
                id="square-footage"
                type="number"
                placeholder="e.g., 2500"
                value={formData.squareFootage}
                onChange={(e) => setFormData((prev) => ({ ...prev, squareFootage: e.target.value }))}
                className="h-14 text-lg border-2 rounded-xl hover:border-green-300 focus:border-green-500 transition-colors"
                min="1"
                max="50000"
              />
              <p className="text-sm text-gray-500">Don't know the exact size? Your best estimate is fine!</p>
            </div>

            {/* ZIP Code */}
            <div className="space-y-3">
              <Label htmlFor="zip-code" className="text-lg font-semibold text-gray-900 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-600" />
                ZIP code
              </Label>
              <Input
                id="zip-code"
                type="text"
                placeholder="e.g., 12345"
                value={formData.zipCode}
                onChange={(e) => setFormData((prev) => ({ ...prev, zipCode: e.target.value }))}
                className="h-14 text-lg border-2 rounded-xl hover:border-green-300 focus:border-green-500 transition-colors"
                maxLength={5}
                pattern="[0-9]{5}"
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-gray-900 flex items-center">
                <Camera className="w-5 h-5 mr-2 text-green-600" />
                Upload photos of your yard
              </Label>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-600 mb-2">Click to upload photos</p>
                  <p className="text-sm text-gray-500">Upload up to 5 photos (JPG, PNG)</p>
                </label>
              </div>

              {formData.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(photo) || "/placeholder.svg"}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Calculating Your Estimate...
                </div>
              ) : (
                <>
                  <DollarSign className="w-5 h-5 mr-2" />
                  Get My Instant Estimate
                </>
              )}
            </Button>

            <div className="text-center text-sm text-gray-500">Free estimate • No spam • Secure & private</div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
