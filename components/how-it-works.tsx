import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Upload, Brain, Calendar, CheckCircle } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "Customer Uploads Project Details",
      description:
        "Customers select service type, square footage, and upload photos of their project area directly on your website.",
      badge: "Customer Experience",
    },
    {
      icon: Brain,
      title: "AI Generates Instant Estimate",
      description:
        "Our AI analyzes photos, project details, and your custom pricing to provide an accurate estimate in seconds.",
      badge: "AI Processing",
    },
    {
      icon: Calendar,
      title: "Automated Quote Scheduling",
      description: "Interested customers can immediately book a quote appointment with real-time calendar integration.",
      badge: "Automation",
    },
    {
      icon: CheckCircle,
      title: "You Get Qualified Leads",
      description: "Receive pre-qualified appointments with complete project context, photos, and customer commitment.",
      badge: "Business Value",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {step.badge}
                  </Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>

            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-6 h-6 text-green-600" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Business Flow */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mt-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">What Happens Behind the Scenes</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">For Your Business:</h4>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Appointment automatically added to your calendar</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Complete project brief with photos and measurements</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Customer contact information and property address</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Pre-qualified lead who's already seen pricing</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">For Your Customer:</h4>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Instant price transparency - no waiting for callbacks</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Convenient online booking with available time slots</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Professional experience that builds trust</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Clear expectations before the quote appointment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
