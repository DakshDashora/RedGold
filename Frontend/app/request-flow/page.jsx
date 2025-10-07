"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Heart,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Navigation,
  Phone,
  Loader2,
  Bell,
  Activity,
} from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockRequest = {
  id: "REQ-2024-001",
  bloodGroup: "O+",
  unitsNeeded: 2,
  urgency: "critical",
  hospital: "Springfield General Hospital",
  hospitalAddress: "123 Medical Center Dr, Springfield, IL 62701",
  reason: "Emergency surgery",
  patientAge: "45",
  contactPerson: "Dr. Sarah Johnson",
  contactPhone: "+1 (555) 987-6543",
  requestTime: "2024-01-20 14:30",
  estimatedTime: "2-4 hours",
}

const mockNearbyDonors = [
  {
    id: 1,
    name: "John Smith",
    bloodGroup: "O+",
    distance: "0.8 miles",
    lastDonation: "2023-10-15",
    totalDonations: 12,
    status: "available",
    responseTime: "5 min",
    location: "Downtown Springfield",
  },
  {
    id: 2,
    name: "Mike Davis",
    bloodGroup: "O+",
    distance: "1.2 miles",
    lastDonation: "2023-11-20",
    totalDonations: 8,
    status: "responding",
    responseTime: "2 min",
    location: "West Springfield",
  },
  {
    id: 3,
    name: "David Brown",
    bloodGroup: "O+",
    distance: "2.1 miles",
    lastDonation: "2023-12-05",
    totalDonations: 15,
    status: "confirmed",
    responseTime: "1 min",
    location: "East Springfield",
  },
]

const flowSteps = [
  { id: 1, title: "Request Submitted", description: "Blood request has been submitted", completed: true },
  { id: 2, title: "Finding Donors", description: "Searching for compatible donors nearby", completed: true },
  { id: 3, title: "Notifying Donors", description: "Sending notifications to potential donors", completed: true },
  { id: 4, title: "Awaiting Responses", description: "Waiting for donor confirmations", completed: false },
  { id: 5, title: "Coordination", description: "Coordinating with confirmed donors", completed: false },
  { id: 6, title: "Donation Complete", description: "Blood donation completed successfully", completed: false },
]

export default function RequestFlow() {
  const [currentStep, setCurrentStep] = useState(3)
  const [progress, setProgress] = useState(50)
  const [notifications, setNotifications] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate progress updates
      if (progress < 100) {
        setProgress((prev) => Math.min(prev + Math.random() * 10, 100))
      }

      // Simulate new notifications
      const newNotifications = [
        "New donor found 0.5 miles away",
        "Donor John Smith is reviewing your request",
        "Donor Mike Davis has confirmed availability",
        "Hospital has been notified of donor confirmation",
        "Donation scheduled for 3:30 PM today",
      ]

      if (Math.random() > 0.7 && notifications.length < 5) {
        const randomNotification = newNotifications[notifications.length]
        if (randomNotification) {
          setNotifications((prev) => [
            ...prev,
            {
              id: Date.now(),
              message: randomNotification,
              time: new Date().toLocaleTimeString(),
              type: "info",
            },
          ])
        }
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [progress, notifications.length])

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700"
      case "responding":
        return "bg-yellow-100 text-yellow-700"
      case "confirmed":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "critical":
        return "bg-destructive text-destructive-foreground"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-primary fill-primary" />
              <span className="text-2xl font-bold text-foreground">BloodBuddy</span>
            </Link>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              Request Flow
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Badge className={getUrgencyColor(mockRequest.urgency)}>{mockRequest.urgency}</Badge>
            <span className="text-sm font-medium">Request ID: {mockRequest.id}</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Request Overview */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Blood Request in Progress</h1>
          <p className="text-muted-foreground">
            Tracking your request for {mockRequest.unitsNeeded} units of {mockRequest.bloodGroup} blood
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Request Progress
            </CardTitle>
            <CardDescription>Real-time updates on your blood request</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              {/* Step Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {flowSteps.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center text-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                        step.completed
                          ? "bg-primary text-primary-foreground"
                          : index === currentStep
                            ? "bg-primary/20 text-primary border-2 border-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : index === currentStep ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <span className="text-sm font-bold">{step.id}</span>
                      )}
                    </div>
                    <h4 className="text-sm font-medium">{step.title}</h4>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Request Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Blood Group:</span>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {mockRequest.bloodGroup}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Units Needed:</span>
                  <span className="text-lg font-bold text-primary">{mockRequest.unitsNeeded}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Urgency:</span>
                  <Badge className={getUrgencyColor(mockRequest.urgency)}>{mockRequest.urgency}</Badge>
                </div>
                <div className="space-y-2">
                  <span className="font-medium">Hospital:</span>
                  <div className="text-sm text-muted-foreground">
                    <p>{mockRequest.hospital}</p>
                    <p className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {mockRequest.hospitalAddress}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="font-medium">Contact:</span>
                  <div className="text-sm text-muted-foreground">
                    <p>{mockRequest.contactPerson}</p>
                    <p className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {mockRequest.contactPhone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Estimated Time:</span>
                  <span className="flex items-center gap-1 text-sm">
                    <Clock className="h-4 w-4" />
                    {mockRequest.estimatedTime}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Live Updates
              </CardTitle>
              <CardDescription>Real-time notifications about your request</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Waiting for updates...</p>
                  </div>
                ) : (
                  notifications
                    .slice()
                    .reverse()
                    .map((notification) => (
                      <div key={notification.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-1 bg-primary/10 rounded-full mt-1">
                          <Bell className="h-3 w-3 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Donor Matching Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Nearby Compatible Donors
            </CardTitle>
            <CardDescription>Donors who match your blood type and location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockNearbyDonors.map((donor) => (
                <Card key={donor.id} className="border-2 hover:border-primary/20 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {donor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{donor.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {donor.distance}
                            </span>
                            <span>Last donation: {donor.lastDonation}</span>
                            <span>{donor.totalDonations} total donations</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{donor.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{donor.bloodGroup}</Badge>
                        <Badge className={getStatusColor(donor.status)}>{donor.status}</Badge>
                        {donor.status === "confirmed" && (
                          <div className="flex items-center gap-1 text-sm text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            Confirmed
                          </div>
                        )}
                      </div>
                    </div>
                    {donor.status === "confirmed" && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {donor.name} has confirmed and will donate at {mockRequest.hospital}
                          </span>
                        </div>
                        <p className="text-xs text-green-600 mt-1">Response time: {donor.responseTime}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="mt-6 h-64 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Navigation className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="text-lg font-medium mb-2">Interactive Location Map</p>
                <p className="text-muted-foreground">Real-time donor locations would be displayed here</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Integration with mapping service (Google Maps, Mapbox) needed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/receiver-dashboard">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              Back to Dashboard
            </Button>
          </Link>
          <Button className="w-full sm:w-auto">
            <Phone className="mr-2 h-4 w-4" />
            Contact Hospital
          </Button>
          <Button variant="secondary" className="w-full sm:w-auto">
            <Bell className="mr-2 h-4 w-4" />
            Enable Notifications
          </Button>
        </div>

        {/* Emergency Alert */}
        {mockRequest.urgency === "critical" && (
          <Alert className="mt-8 border-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Critical Request:</strong> This is an emergency blood request. All nearby compatible donors have
              been notified with high priority. If you need immediate assistance, please contact the hospital directly
              at {mockRequest.contactPhone}.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
