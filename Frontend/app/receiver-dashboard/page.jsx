"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Heart,
  Clock,
  CheckCircle,
  AlertTriangle,
  Bell,
  Plus,
  Calendar,
  LogOut,
  Edit,
  Save,
  User,
  Activity,
} from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockReceiver = {
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  phone: "+1 (555) 987-6543",
  bloodGroup: "A-",
  age: 34,
  address: "456 Oak Avenue, Springfield, IL 62702",
  emergencyContact: "Michael Johnson",
  emergencyPhone: "+1 (555) 123-9876",
  medicalConditions: "None",
}

const mockRequests = [
  {
    id: 1,
    bloodGroup: "A-",
    unitsNeeded: 2,
    urgency: "critical",
    hospital: "Springfield General Hospital",
    requestDate: "2024-01-20",
    status: "active",
    reason: "Emergency surgery",
    matchedDonors: 3,
    confirmedDonors: 1,
    estimatedTime: "2-4 hours",
    updates: [
      { time: "2024-01-20 14:30", message: "Request submitted successfully", type: "info" },
      { time: "2024-01-20 14:45", message: "3 potential donors found nearby", type: "success" },
      { time: "2024-01-20 15:00", message: "1 donor confirmed availability", type: "success" },
    ],
  },
  {
    id: 2,
    bloodGroup: "A-",
    unitsNeeded: 1,
    urgency: "high",
    hospital: "City Medical Center",
    requestDate: "2024-01-18",
    status: "completed",
    reason: "Planned surgery",
    matchedDonors: 2,
    confirmedDonors: 1,
    completedDate: "2024-01-19",
    updates: [
      { time: "2024-01-18 10:00", message: "Request submitted successfully", type: "info" },
      { time: "2024-01-18 10:30", message: "2 potential donors found", type: "success" },
      { time: "2024-01-18 11:00", message: "1 donor confirmed", type: "success" },
      { time: "2024-01-19 09:00", message: "Donation completed successfully", type: "success" },
    ],
  },
]

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const urgencyLevels = [
  { value: "critical", label: "Critical (0-2 hours)", color: "bg-destructive" },
  { value: "high", label: "High (2-12 hours)", color: "bg-orange-500" },
  { value: "medium", label: "Medium (12-24 hours)", color: "bg-yellow-500" },
  { value: "low", label: "Low (1-3 days)", color: "bg-blue-500" },
]

export default function ReceiverDashboard() {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState(mockReceiver)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestForm, setRequestForm] = useState({
    bloodGroup: "",
    unitsNeeded: "",
    urgency: "",
    hospital: "",
    reason: "",
    doctorName: "",
    doctorPhone: "",
    additionalNotes: "",
    isEmergency: false,
  })

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-destructive text-destructive-foreground"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
        return "bg-blue-500 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-500 text-white"
      case "completed":
        return "bg-green-500 text-white"
      case "cancelled":
        return "bg-gray-500 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting request:", requestForm)
    alert("Blood request submitted successfully! You will receive updates on donor responses.")
    setShowRequestForm(false)
    // Reset form
    setRequestForm({
      bloodGroup: "",
      unitsNeeded: "",
      urgency: "",
      hospital: "",
      reason: "",
      doctorName: "",
      doctorPhone: "",
      additionalNotes: "",
      isEmergency: false,
    })
  }

  const handleSaveProfile = () => {
    setIsEditingProfile(false)
    console.log("Saving profile:", profileData)
    alert("Profile updated successfully!")
  }

  const activeRequests = mockRequests.filter((req) => req.status === "active")
  const completedRequests = mockRequests.filter((req) => req.status === "completed")

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
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Receiver Portal
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {mockReceiver.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{mockReceiver.name}</span>
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome, {mockReceiver.name}</h1>
          <p className="text-muted-foreground">Manage your blood requests and track donor responses.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card
            className="border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer"
            onClick={() => setShowRequestForm(true)}
          >
            <CardHeader className="text-center">
              <Plus className="h-12 w-12 text-primary mx-auto mb-2" />
              <CardTitle className="text-primary">New Blood Request</CardTitle>
              <CardDescription>Submit a new request for blood donation</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{activeRequests.length}</div>
              <p className="text-xs text-muted-foreground">Currently being processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mockRequests.length}</div>
              <p className="text-xs text-muted-foreground">All time requests</p>
            </CardContent>
          </Card>
        </div>

        {/* New Request Form Modal */}
        {showRequestForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Submit Blood Request</CardTitle>
                <CardDescription>Fill out the form below to request blood donation</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitRequest} className="space-y-6">
                  {/* Emergency Alert */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="emergency"
                      checked={requestForm.isEmergency}
                      onCheckedChange={(checked) => setRequestForm({ ...requestForm, isEmergency: checked as boolean })}
                    />
                    <Label htmlFor="emergency" className="text-sm font-medium">
                      This is an emergency request
                    </Label>
                  </div>

                  {requestForm.isEmergency && (
                    <Alert className="border-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Emergency requests are prioritized and will be immediately visible to all nearby donors.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">Blood Group Needed</Label>
                      <Select
                        value={requestForm.bloodGroup}
                        onValueChange={(value) => setRequestForm({ ...requestForm, bloodGroup: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          {bloodGroups.map((group) => (
                            <SelectItem key={group} value={group}>
                              {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unitsNeeded">Units Needed</Label>
                      <Input
                        id="unitsNeeded"
                        type="number"
                        min="1"
                        max="10"
                        placeholder="Number of units"
                        value={requestForm.unitsNeeded}
                        onChange={(e) => setRequestForm({ ...requestForm, unitsNeeded: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <Select
                      value={requestForm.urgency}
                      onValueChange={(value) => setRequestForm({ ...requestForm, urgency: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency level" />
                      </SelectTrigger>
                      <SelectContent>
                        {urgencyLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hospital">Hospital/Medical Facility</Label>
                    <Input
                      id="hospital"
                      placeholder="Enter hospital name"
                      value={requestForm.hospital}
                      onChange={(e) => setRequestForm({ ...requestForm, hospital: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Request</Label>
                    <Textarea
                      id="reason"
                      placeholder="Brief description of why blood is needed"
                      value={requestForm.reason}
                      onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctorName">Doctor/Contact Person</Label>
                      <Input
                        id="doctorName"
                        placeholder="Doctor's name"
                        value={requestForm.doctorName}
                        onChange={(e) => setRequestForm({ ...requestForm, doctorName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="doctorPhone">Contact Phone</Label>
                      <Input
                        id="doctorPhone"
                        type="tel"
                        placeholder="Contact phone number"
                        value={requestForm.doctorPhone}
                        onChange={(e) => setRequestForm({ ...requestForm, doctorPhone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="additionalNotes"
                      placeholder="Any additional information for donors"
                      value={requestForm.additionalNotes}
                      onChange={(e) => setRequestForm({ ...requestForm, additionalNotes: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                      Submit Request
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowRequestForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requests">My Requests</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
          </TabsList>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            {/* Active Requests */}
            {activeRequests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Active Requests
                  </CardTitle>
                  <CardDescription>Currently processing blood requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeRequests.map((request) => (
                      <Card key={request.id} className="border-2 border-primary/20">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-lg px-3 py-1">
                                  {request.bloodGroup}
                                </Badge>
                                <Badge className={getUrgencyColor(request.urgency)}>{request.urgency}</Badge>
                                <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                              </div>
                              <h3 className="text-lg font-semibold">{request.hospital}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {request.requestDate}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  ETA: {request.estimatedTime}
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
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Reason:</span> {request.reason}
                              </div>
                              <div>
                                <span className="font-medium">Matched Donors:</span> {request.matchedDonors}
                              </div>
                              <div>
                                <span className="font-medium">Confirmed:</span> {request.confirmedDonors}
                              </div>
                            </div>

                            {/* Recent Updates */}
                            <div className="border-t pt-4">
                              <h4 className="font-medium mb-2">Recent Updates</h4>
                              <div className="space-y-2">
                                {request.updates.slice(0, 2).map((update, index) => (
                                  <div key={index} className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-primary rounded-full" />
                                    <span className="text-muted-foreground">{update.time}</span>
                                    <span>{update.message}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Completed Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Request History
                </CardTitle>
                <CardDescription>Previously completed blood requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedRequests.map((request) => (
                    <div key={request.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{request.hospital}</h4>
                          <Badge variant="secondary">{request.bloodGroup}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Requested: {request.requestDate}</p>
                          <p>Completed: {request.completedDate}</p>
                          <p>Units: {request.unitsNeeded}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Completed</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notifications
                </CardTitle>
                <CardDescription>Updates on your blood requests and donor responses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRequests
                    .flatMap((request) => request.updates)
                    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                    .slice(0, 10)
                    .map((update, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div
                          className={`p-2 rounded-full ${update.type === "success" ? "bg-green-100" : "bg-blue-100"}`}
                        >
                          {update.type === "success" ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Bell className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{update.message}</p>
                          <p className="text-xs text-muted-foreground">{update.time}</p>
                        </div>
                      </div>
                    ))}
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
                      <p className="text-muted-foreground">Total Requests: {mockRequests.length}</p>
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

                  {/* Emergency Contact */}
                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4">Emergency Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Contact Name</Label>
                        <Input
                          id="emergencyContact"
                          value={profileData.emergencyContact}
                          onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                          disabled={!isEditingProfile}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone">Contact Phone</Label>
                        <Input
                          id="emergencyPhone"
                          value={profileData.emergencyPhone}
                          onChange={(e) => setProfileData({ ...profileData, emergencyPhone: e.target.value })}
                          disabled={!isEditingProfile}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4">Medical Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Blood Group</p>
                          <p className="text-sm text-muted-foreground">{profileData.bloodGroup}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Age</p>
                          <p className="text-sm text-muted-foreground">{profileData.age} years</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="medicalConditions">Medical Conditions</Label>
                      <Textarea
                        id="medicalConditions"
                        value={profileData.medicalConditions}
                        onChange={(e) => setProfileData({ ...profileData, medicalConditions: e.target.value })}
                        disabled={!isEditingProfile}
                        placeholder="List any relevant medical conditions"
                      />
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
