"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  Heart,
  MapPin,
  Clock,
  Calendar,
  Award,
  Activity,
  CheckCircle,
  XCircle,
  Navigation,
  LogOut,
  Edit,
  Save,
} from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockDonor = {
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "+1 (555) 123-4567",
  bloodGroup: "O+",
  age: 32,
  address: "123 Main St, Springfield, IL 62701",
  totalDonations: 12,
  nextEligibleDate: "2024-03-15",
  lastDonation: "2024-01-15",
  healthStatus: "Eligible",
}

const mockNearbyRequests = [
  {
    id: 1,
    bloodGroup: "O+",
    unitsNeeded: 2,
    urgency: "critical",
    hospital: "Springfield General Hospital",
    distance: "0.8 miles",
    requestDate: "2024-01-20",
    patientAge: "45",
    reason: "Emergency surgery",
    contactPerson: "Dr. Sarah Johnson",
    contactPhone: "+1 (555) 987-6543",
  },
  {
    id: 2,
    bloodGroup: "O+",
    unitsNeeded: 1,
    urgency: "high",
    hospital: "City Medical Center",
    distance: "1.2 miles",
    requestDate: "2024-01-19",
    patientAge: "28",
    reason: "Accident victim",
    contactPerson: "Dr. Michael Davis",
    contactPhone: "+1 (555) 456-7890",
  },
  {
    id: 3,
    bloodGroup: "O+",
    unitsNeeded: 3,
    urgency: "medium",
    hospital: "Regional Blood Bank",
    distance: "2.1 miles",
    requestDate: "2024-01-18",
    patientAge: "Unknown",
    reason: "Blood bank inventory",
    contactPerson: "Blood Bank Coordinator",
    contactPhone: "+1 (555) 234-5678",
  },
]

const mockDonationHistory = [
  {
    id: 1,
    date: "2024-01-15",
    hospital: "Springfield General Hospital",
    units: 1,
    bloodGroup: "O+",
    status: "completed",
    recipient: "Emergency patient",
  },
  {
    id: 2,
    date: "2023-10-20",
    hospital: "City Medical Center",
    units: 1,
    bloodGroup: "O+",
    status: "completed",
    recipient: "Surgery patient",
  },
  {
    id: 3,
    date: "2023-07-12",
    hospital: "Regional Blood Bank",
    units: 1,
    bloodGroup: "O+",
    status: "completed",
    recipient: "Blood bank inventory",
  },
  {
    id: 4,
    date: "2023-04-08",
    hospital: "Springfield General Hospital",
    units: 1,
    bloodGroup: "O+",
    status: "completed",
    recipient: "Cancer patient",
  },
]

export default function DonorDashboard() {
  const [viewMode, setViewMode] = useState<"cards" | "map">("cards")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState(mockDonor)

  const getUrgencyColor = (urgency: string) => {
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

  const handleAcceptRequest = (requestId: number) => {
    console.log("Accepting request:", requestId)
    // Handle accept logic here
    alert("Request accepted! You will be contacted with further details.")
  }

  const handleDeclineRequest = (requestId: number) => {
    console.log("Declining request:", requestId)
    // Handle decline logic here
    alert("Request declined.")
  }

  const handleSaveProfile = () => {
    setIsEditingProfile(false)
    console.log("Saving profile:", profileData)
    alert("Profile updated successfully!")
  }

  const daysUntilEligible = Math.ceil(
    (new Date(mockDonor.nextEligibleDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  )

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
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Donor Portal
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {mockDonor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{mockDonor.name}</span>
            </div>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {mockDonor.name}!</h1>
          <p className="text-muted-foreground">Thank you for being a life-saving hero in our community.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mockDonor.totalDonations}</div>
              <p className="text-xs text-muted-foreground">Lives potentially saved: {mockDonor.totalDonations * 3}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blood Group</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mockDonor.bloodGroup}</div>
              <p className="text-xs text-muted-foreground">Universal donor type</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Eligible</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{daysUntilEligible}</div>
              <p className="text-xs text-muted-foreground">days remaining</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{mockDonor.healthStatus}</div>
              <p className="text-xs text-muted-foreground">Ready to donate</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requests">Nearby Requests</TabsTrigger>
            <TabsTrigger value="history">Donation History</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
          </TabsList>

          {/* Nearby Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Blood Requests Near You</CardTitle>
                    <CardDescription>Help save lives in your community</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === "cards" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("cards")}
                    >
                      Cards
                    </Button>
                    <Button
                      variant={viewMode === "map" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("map")}
                    >
                      Map
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === "cards" ? (
                  <div className="space-y-4">
                    {mockNearbyRequests.map((request) => (
                      <Card key={request.id} className="border-2 hover:border-primary/20 transition-colors">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-lg px-3 py-1">
                                  {request.bloodGroup}
                                </Badge>
                                <Badge className={getUrgencyColor(request.urgency)}>{request.urgency}</Badge>
                              </div>
                              <h3 className="text-lg font-semibold">{request.hospital}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {request.distance}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {request.requestDate}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">{request.unitsNeeded}</div>
                              <div className="text-sm text-muted-foreground">units needed</div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Patient Age:</span> {request.patientAge}
                              </div>
                              <div>
                                <span className="font-medium">Reason:</span> {request.reason}
                              </div>
                              <div>
                                <span className="font-medium">Contact:</span> {request.contactPerson}
                              </div>
                              <div>
                                <span className="font-medium">Phone:</span> {request.contactPhone}
                              </div>
                            </div>
                            <div className="flex gap-3 pt-3">
                              <Button
                                onClick={() => handleAcceptRequest(request.id)}
                                className="flex-1"
                                disabled={daysUntilEligible > 0}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Accept Request
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleDeclineRequest(request.id)}
                                className="flex-1"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Decline
                              </Button>
                            </div>
                            {daysUntilEligible > 0 && (
                              <p className="text-sm text-muted-foreground text-center">
                                You can donate again in {daysUntilEligible} days
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="h-[600px] bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Navigation className="h-12 w-12 mx-auto mb-4 text-primary" />
                      <p className="text-lg font-medium mb-2">Interactive Map View</p>
                      <p className="text-muted-foreground">Map integration would display request locations here</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Integration with mapping service (Google Maps, Mapbox) needed
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Donation History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Donation History</CardTitle>
                <CardDescription>Track your life-saving contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDonationHistory.map((donation, index) => (
                    <div key={donation.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Heart className="h-6 w-6 text-primary fill-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{donation.hospital}</h4>
                          <Badge variant="secondary">{donation.bloodGroup}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Date: {donation.date}</p>
                          <p>Recipient: {donation.recipient}</p>
                          <p>Units donated: {donation.units}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-700">Completed</Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress to next milestone */}
                <div className="mt-8 p-6 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-4">Progress to Next Milestone</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Donations: {mockDonor.totalDonations}/15</span>
                      <span>Next reward: Gold Donor Badge</span>
                    </div>
                    <Progress value={(mockDonor.totalDonations / 15) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Profile</CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                  </div>
                  <Button
                    variant={isEditingProfile ? "default" : "outline"}
                    onClick={() => (isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true))}
                  >
                    {isEditingProfile ? (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="text-2xl">
                        {profileData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{profileData.name}</h3>
                      <p className="text-muted-foreground">Blood Type: {profileData.bloodGroup}</p>
                      <p className="text-muted-foreground">Total Donations: {profileData.totalDonations}</p>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!isEditingProfile}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={profileData.age}
                        onChange={(e) => setProfileData({ ...profileData, age: Number.parseInt(e.target.value) })}
                        disabled={!isEditingProfile}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditingProfile}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditingProfile}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      disabled={!isEditingProfile}
                    />
                  </div>

                  {/* Health Information */}
                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4">Health Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Blood Group</p>
                          <p className="text-sm text-muted-foreground">{profileData.bloodGroup}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Last Donation</p>
                          <p className="text-sm text-muted-foreground">{profileData.lastDonation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Health Status</p>
                          <p className="text-sm text-green-600">{profileData.healthStatus}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
