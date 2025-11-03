// src/Pages/ReceiverDashboard.jsx
import React, { useEffect, useState } from "react"
import { Button } from "../Components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../Components/ui/cards"
import { Input } from "../Components/ui/input"
import { Label } from "../Components/ui/label"
import { Badge } from "../Components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Components/ui/tabs"
import { Avatar, AvatarFallback } from "../Components/ui/avatar"
import { Textarea } from "../Components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/ui/select"
import { Checkbox } from "../Components/ui/checkbox"
import { Alert, AlertDescription } from "../Components/ui/alert"
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
import { Link } from "react-router-dom"
import { BASE_URL } from "../config"

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const urgencyLevels = [
  { value: "critical", label: "Critical (0-2 hours)" },
  { value: "high", label: "High (2-12 hours)" },
  { value: "medium", label: "Medium (12-24 hours)" },
  { value: "low", label: "Low (1-3 days)" },
]

export default function ReceiverDashboard() {
  const [profile, setProfile] = useState(null)
  const [groupedRequests, setGroupedRequests] = useState({
    Pending: [],
    Accepted: [],
    Completed: [],
    Cancelled: [],
    Dead: [],
  })
  const [loading, setLoading] = useState(true)

  // new request UI state
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestForm, setRequestForm] = useState({
    blood_group: "",
    units: 1,
    urgency_level: "",
    hospital_name: "",
    description: "",
    doctor_name: "",
    contact_number: "",
    additional_info: "",
    is_emergency: false,
  })
  const [notifications, setNotifications] = useState([]) // use for simple local notifications
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  // ---------- API calls (each separate) ----------
  const API_BASE = BASE_URL + "blood-request"

  // 1) fetch profile (auth/me)
  const fetchProfile = async () => {
    if (!token) return
    try {
      const res = await fetch(`${BASE_URL}auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to fetch profile")
      const data = await res.json()
      setProfile(data)
    } catch (err) {
      console.error("fetchProfile:", err)
    }
  }

  // 2) fetch my requests grouped
  const fetchMyRequests = async () => {
    try {
      const res = await fetch(`${API_BASE}/my-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to fetch requests")
      const data = await res.json()
      // backend returns a mapping (MyRequestsByStatus)
      setGroupedRequests({
        Pending: data.Pending || [],
        Accepted: data.Accepted || [],
        Completed: data.Completed || [],
        Cancelled: data.Cancelled || [],
        Dead: data.Dead || [],
      })
    } catch (err) {
      console.error("fetchMyRequests:", err)
    }
  }

  // 3) create a new request
  const createRequest = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || "Failed to create request")
      }
      const data = await res.json()
      setNotifications((n) => [{ time: new Date().toISOString(), message: data.message }, ...n])
      // refresh list
      await fetchMyRequests()
      return data
    } catch (err) {
      console.error("createRequest:", err)
      throw err
    }
  }

  // 4) cancel request
  const cancelRequest = async (requestId) => {
    try {
      const res = await fetch(`${API_BASE}/cancel/${requestId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || "Failed to cancel")
      }
      const data = await res.json()
      setNotifications((n) => [{ time: new Date().toISOString(), message: data.message }, ...n])
      await fetchMyRequests()
      return data
    } catch (err) {
      console.error("cancelRequest:", err)
      throw err
    }
  }

  // 5) update request status (PATCH /)
  const updateRequestStatus = async ({ request_id, status }) => {
    try {
      const res = await fetch(`${API_BASE}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ request_id, status }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || "Failed to update status")
      }
      const data = await res.json()
      // refresh
      await fetchMyRequests()
      return data
    } catch (err) {
      console.error("updateRequestStatus:", err)
      throw err
    }
  }

  // 6) fetch request history
  const fetchRequestHistory = async (requestId) => {
    try {
      const res = await fetch(`${API_BASE}/history/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to fetch history")
      return await res.json()
    } catch (err) {
      console.error("fetchRequestHistory:", err)
      return []
    }
  }

  // ---------- lifecycle ----------
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await Promise.allSettled([fetchProfile(), fetchMyRequests()])
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---------- UI helpers ----------
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-blue-500 text-white"
      case "Accepted":
        return "bg-yellow-500 text-white"
      case "Completed":
        return "bg-green-500 text-white"
      case "Cancelled":
        return "bg-gray-500 text-white"
      case "Dead":
        return "bg-gray-700 text-white"
      default:
        return "bg-muted text-muted-foreground"
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
      case "low":
        return "bg-blue-500 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  // handlers for the create form submit
  const handleSubmitRequest = async (e) => {
    e.preventDefault()
    // map UI form names to backend schema
    const payload = {
      blood_group: requestForm.blood_group,
      units: Number(requestForm.units) || 1,
      urgency_level: requestForm.urgency_level,
      hospital_name: requestForm.hospital_name,
      description: requestForm.description || null,
      doctor_name: requestForm.doctor_name || null,
      contact_number: requestForm.contact_number || "",
      additional_info: requestForm.additional_info || null,
    }

    try {
      await createRequest(payload)
      alert("Request submitted successfully")
      setShowRequestForm(false)
      // reset
      setRequestForm({
        blood_group: "",
        units: 1,
        urgency_level: "",
        hospital_name: "",
        description: "",
        doctor_name: "",
        contact_number: "",
        additional_info: "",
        is_emergency: false,
      })
    } catch (err) {
      alert("Error creating request: " + err.message)
    }
  }

  if (loading) return <p className="text-center mt-20">Loading receiver dashboard...</p>

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Receiver Portal
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {profile?.Name
                    ? profile.Name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{profile?.Name || "Unknown"}</span>
            </div>
            
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{profile?.Name ? `Welcome, ${profile.Name}` : "Welcome"}</h1>
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
              <div className="text-2xl font-bold text-primary">{groupedRequests.Pending.length + groupedRequests.Accepted.length}</div>
              <p className="text-xs text-muted-foreground">Currently being processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {groupedRequests.Pending.length +
                  groupedRequests.Accepted.length +
                  groupedRequests.Completed.length +
                  groupedRequests.Cancelled.length +
                  groupedRequests.Dead.length}
              </div>
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
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="emergency"
                      checked={requestForm.is_emergency}
                      onCheckedChange={(checked) => setRequestForm({ ...requestForm, is_emergency: !!checked })}
                    />
                    <Label htmlFor="emergency" className="text-sm font-medium">
                      This is an emergency request
                    </Label>
                  </div>

                  {requestForm.is_emergency && (
                    <Alert className="border-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Emergency requests are prioritized and will be immediately visible to nearby donors.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="blood_group">Blood Group Needed</Label>
                      <Select value={requestForm.blood_group} onValueChange={(val) => setRequestForm({ ...requestForm, blood_group: val })} required>
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
                      <Label htmlFor="units">Units Needed</Label>
                      <Input
                        id="units"
                        type="number"
                        min="1"
                        max="20"
                        value={requestForm.units}
                        onChange={(e) => setRequestForm({ ...requestForm, units: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <Select value={requestForm.urgency_level} onValueChange={(val) => setRequestForm({ ...requestForm, urgency_level: val })} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        {urgencyLevels.map((u) => (
                          <SelectItem key={u.value} value={u.value}>
                            {u.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hospital_name">Hospital/Medical Facility</Label>
                    <Input
                      id="hospital_name"
                      value={requestForm.hospital_name}
                      onChange={(e) => setRequestForm({ ...requestForm, hospital_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Reason for Request</Label>
                    <Textarea
                      id="description"
                      value={requestForm.description}
                      onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="doctor_name">Doctor/Contact Person</Label>
                      <Input id="doctor_name" value={requestForm.doctor_name} onChange={(e) => setRequestForm({ ...requestForm, doctor_name: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="contact_number">Contact Phone</Label>
                      <Input id="contact_number" value={requestForm.contact_number} onChange={(e) => setRequestForm({ ...requestForm, contact_number: e.target.value })} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additional_info">Additional Notes (Optional)</Label>
                    <Textarea id="additional_info" value={requestForm.additional_info} onChange={(e) => setRequestForm({ ...requestForm, additional_info: e.target.value })} />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                      Submit Request
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowRequestForm(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content: My Requests + Profile (tabs) */}
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requests">My Requests</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-6">
            {/* Render grouped requests by status */}
            {["Pending", "Accepted", "Completed", "Cancelled", "Dead"].map((status) => (
              <div key={status} className="space-y-4">
                <h3 className="text-lg font-semibold">{status} ({(groupedRequests[status]||[]).length})</h3>
                {(groupedRequests[status] || []).length === 0 ? (
                  <p className="text-muted-foreground">No {status.toLowerCase()} requests</p>
                ) : (
                  (groupedRequests[status] || []).map((r) => (
                    <Card key={r.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{r.hospital_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Units: {r.units} • Blood: {r.blood_group} • Urgency: <span className={getUrgencyColor(r.urgency_level)}>{r.urgency_level}</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(r.status)}>{r.status}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm">{r.description}</p>
                            <p className="text-xs text-muted-foreground mt-2">Created: {new Date(r.created_at).toLocaleString()}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-sm text-muted-foreground">Contact: {r.contact_number}</div>

                            {/* Action buttons per status */}
                            <div className="flex gap-2">
                              {r.status === "Pending" && (
                                <>
                                  <Button
                                    onClick={() => {
                                      // user can cancel pending
                                      if (confirm("Cancel this request?")) cancelRequest(r.id)
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                 
                                </>
                              )}

                              {r.status === "Accepted" && (
                                <>
                                  <Button
                                    onClick={async () => {
                                      // allow cancel accepted
                                      if (confirm("Cancel accepted request?")) await cancelRequest(r.id)
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                
                                </>
                              )}

                              {r.status === "Completed" && (
                                <Button
                                  onClick={async () => {
                                    const hist = await fetchRequestHistory(r.id)
                                    alert("History items: " + (hist.length || 0))
                                  }}
                                >
                                  View History
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notifications
                </CardTitle>
                <CardDescription>Updates on your requests and donor responses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <p className="text-muted-foreground">No notifications yet.</p>
                  ) : (
                    notifications.map((n, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Bell className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{n.message}</p>
                          <p className="text-xs text-muted-foreground">{new Date(n.time).toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>View account info</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input value={profile?.Name || ""} disabled />
                  </div>
                  <div>
                    <Label>Blood Group</Label>
                    <Input value={profile?.BloodGroup || ""} disabled />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input value={profile?.City || ""} disabled />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={profile?.PhoneNumber || ""} disabled />
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
