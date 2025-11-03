// src/Pages/DonorDashboard.jsx
import React, { useEffect, useState } from "react";
import { Button } from "../Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../Components/ui/cards";
import { Input } from "../Components/ui/input";
import { Label } from "../Components/ui/label";
import { Badge } from "../Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Components/ui/tabs";
import { Avatar, AvatarFallback } from "../Components/ui/avatar";
import { Textarea } from "../Components/ui/textarea";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import { BASE_URL } from "../config";

export default function DonorDashboard() {
  const [profile, setProfile] = useState(null); // UserOutSchema
  const [nearbyRequests, setNearbyRequests] = useState([]); // NearbyRequestResponse[]
  const [history, setHistory] = useState([]); // DonationHistoryResponse[]
  const [eligibility, setEligibility] = useState({ eligible: true, next_eligible_date: null });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingEligibility, setLoadingEligibility] = useState(true);
  const [errorProfile, setErrorProfile] = useState(null);
  const [errorRequests, setErrorRequests] = useState(null);
  const [errorHistory, setErrorHistory] = useState(null);
  const [errorEligibility, setErrorEligibility] = useState(null);
  const [viewMode, setViewMode] = useState("cards");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // helper to build headers
  const authHeaders = () => {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  // ---------- fetch profile ----------
  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      setLoadingProfile(true);
      setErrorProfile(null);
      try {
        const res = await fetch(`${BASE_URL}auth/me`, { headers: authHeaders() });
        if (!res.ok) throw new Error(`Profile fetch failed (${res.status})`);
        const data = await res.json();
        console.log(data);
        
        if (mounted) setProfile(data);
      } catch (err) {
        if (mounted) setErrorProfile(err.message);
      } finally {
        console.log(profile);
        
        if (mounted) setLoadingProfile(false);
      }
    };
    fetchProfile();
    return () => {
      mounted = false;
    };
  }, [token]);

  // ---------- fetch nearby requests ----------
  useEffect(() => {
    let mounted = true;
    const fetchNearby = async () => {
      setLoadingRequests(true);
      setErrorRequests(null);
      try {
        const res = await fetch(`${BASE_URL}donor/nearby-requests`, { headers: authHeaders() });
        if (!res.ok) {
          // handle 401/403 etc gracefully
          const txt = await res.text();
          throw new Error(`Nearby requests fetch failed (${res.status}): ${txt}`);
        }
        const data = await res.json();
        if (mounted) setNearbyRequests(data || []);
      } catch (err) {
        if (mounted) setErrorRequests(err.message);
      } finally {
        console.log("nearby requests"+nearbyRequests);
        
        if (mounted) setLoadingRequests(false);
      }
    };
    fetchNearby();
    return () => {
      mounted = false;
    };
  }, [token]);

  // ---------- fetch donation history ----------
  useEffect(() => {
    let mounted = true;
    const fetchHistory = async () => {
      setLoadingHistory(true);
      setErrorHistory(null);
      try {
        const res = await fetch(`${BASE_URL}donor/history`, { headers: authHeaders() });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`History fetch failed (${res.status}): ${txt}`);
        }
        const data = await res.json();
        if (mounted) setHistory(data || []);
      } catch (err) {
        if (mounted) setErrorHistory(err.message);
      } finally {
        if (mounted) setLoadingHistory(false);
      }
    };
    fetchHistory();
    return () => {
      mounted = false;
    };
  }, [token]);

  // ---------- fetch eligibility ----------
  useEffect(() => {
    let mounted = true;
    const fetchEligibility = async () => {
      setLoadingEligibility(true);
      setErrorEligibility(null);
      try {
        const res = await fetch(`${BASE_URL}donor/eligibility`, { headers: authHeaders() });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Eligibility fetch failed (${res.status}): ${txt}`);
        }
        const data = await res.json();
        if (mounted) setEligibility(data || { eligible: true, next_eligible_date: null });
      } catch (err) {
        if (mounted) setErrorEligibility(err.message);
      } finally {
        if (mounted) setLoadingEligibility(false);
      }
    };
    fetchEligibility();
    return () => {
      mounted = false;
    };
  }, [token]);

  // ---------- accept request ----------
  const handleAccept = async (requestId) => {
    if (!token) return alert("You must be logged in");
    try {
      const res = await fetch(`${BASE_URL}donor/accept/${requestId}`, { method: "POST", headers: authHeaders() });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Accept failed (${res.status}): ${txt}`);
      }
      const data = await res.json();
      alert(data.message || "Request accepted");
      // refresh lists: remove from nearby, refresh history & eligibility
      setNearbyRequests((prev) => prev.filter((r) => String(r.id) !== String(requestId)));
      // re-fetch history & eligibility separately
      reFetchHistory();
      reFetchEligibility();
    } catch (err) {
      alert(`Error accepting request: ${err.message}`);
    }
  };

  // ---------- cancel request ----------
  const handleCancel = async (requestId) => {
    if (!token) return alert("You must be logged in");
    try {
      const res = await fetch(`${BASE_URL}donor/cancel/${requestId}`, { method: "POST", headers: authHeaders() });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Cancel failed (${res.status}): ${txt}`);
      }
      const data = await res.json();
      alert(data.message || "Request cancelled");
      // refresh nearby & history & eligibility
      reFetchNearby();
      reFetchHistory();
      reFetchEligibility();
    } catch (err) {
      alert(`Error cancelling request: ${err.message}`);
    }
  };

  // ---------- individual re-fetch helpers ----------
  const reFetchNearby = async () => {
    setLoadingRequests(true);
    setErrorRequests(null);
    try {
      const res = await fetch(`${BASE_URL}donor/nearby-requests`, { headers: authHeaders() });
      if (!res.ok) throw new Error(`Nearby requests re-fetch failed (${res.status})`);
      const data = await res.json();
      setNearbyRequests(data || []);
    } catch (err) {
      setErrorRequests(err.message);
    } finally {
      setLoadingRequests(false);
    }
  };

  const reFetchHistory = async () => {
    setLoadingHistory(true);
    setErrorHistory(null);
    try {
      const res = await fetch(`${BASE_URL}donor/history`, { headers: authHeaders() });
      if (!res.ok) throw new Error(`History re-fetch failed (${res.status})`);
      const data = await res.json();
      setHistory(data || []);
    } catch (err) {
      setErrorHistory(err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  const reFetchEligibility = async () => {
    setLoadingEligibility(true);
    setErrorEligibility(null);
    try {
      const res = await fetch(`${BASE_URL}donor/eligibility`, { headers: authHeaders() });
      if (!res.ok) throw new Error(`Eligibility re-fetch failed (${res.status})`);
      const data = await res.json();
      setEligibility(data || { eligible: true, next_eligible_date: null });
    } catch (err) {
      setErrorEligibility(err.message);
    } finally {
      setLoadingEligibility(false);
    }
  };

  // ---------- small UI helpers ----------
  const getUrgencyColor = (urgency) => {
    if (!urgency) return "bg-muted text-muted-foreground";
    const u = (urgency + "").toLowerCase();
    if (u.includes("critical")) return "bg-destructive text-destructive-foreground";
    if (u.includes("high")) return "bg-orange-500 text-white";
    if (u.includes("medium")) return "bg-yellow-500 text-white";
    return "bg-muted text-muted-foreground";
  };

  if (loadingProfile || !profile) {
    return <p className="text-center mt-20">Loading donor dashboard...</p>;
  }

  // compute days to next eligible
  const daysUntilEligible = eligibility && eligibility.next_eligible_date
    ? Math.ceil((new Date(eligibility.next_eligible_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            
            <Badge variant="secondary" className="bg-green-100 text-green-700">Donor Portal</Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {profile.Name ? profile.Name.split(" ").map(n => n[0]).join("") : "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{profile.Name}</span>
            </div>
           
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {profile.Name}!</h1>
        <p className="text-muted-foreground mb-8">Thank you for being a life-saving hero in our community.</p>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{history.length}</div>
              <p className="text-xs text-muted-foreground">Lives potentially saved: {history.length * 3}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blood Group</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{profile.BloodGroup}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Eligible</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {eligibility.eligible ? "Now" : `${daysUntilEligible} days`}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{eligibility.eligible ? "Eligible" : "Waiting"}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requests">Nearby Requests</TabsTrigger>
            <TabsTrigger value="history">Donation History</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
          </TabsList>

          {/* Nearby Requests */}
          <TabsContent value="requests" className="space-y-6">
            {loadingRequests ? (
              <p className="text-center mt-6">Loading nearby requests...</p>
            ) : errorRequests ? (
              <p className="text-center mt-6 text-red-500">Error: {errorRequests}</p>
            ) : nearbyRequests.length === 0 ? (
              <p className="text-center text-muted-foreground mt-4">No nearby requests available right now.</p>
            ) : (
              nearbyRequests.map((req) => (
                <Card key={req.id} className="border-2 hover:border-primary/20 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{req.hospital_name || req.hospital}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {req.additional_info || ""}</div>
                          <div className="flex items-center gap-1"><Clock className="h-4 w-4" /> {req.created_at ? new Date(req.created_at).toLocaleDateString() : ""}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{req.units}</div>
                        <div className="text-sm text-muted-foreground">units needed</div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">{req.description || req.additional_info}</p>

                      <div className="flex gap-3 pt-3">
                        <Button onClick={() => handleAccept(req.id)} disabled={!eligibility.eligible}>
                          <CheckCircle className="mr-2 h-4 w-4" /> Accept
                        </Button>
                        <Button variant="outline" onClick={() => handleCancel(req.id)}>
                          <XCircle className="mr-2 h-4 w-4" /> Decline
                        </Button>
                      </div>

                      {!eligibility.eligible && (
                        <p className="text-sm text-muted-foreground text-center">
                          You can donate again in {daysUntilEligible} days
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Donation History */}
          <TabsContent value="history" className="space-y-6">
            {loadingHistory ? (
              <p className="text-center mt-6">Loading donation history...</p>
            ) : errorHistory ? (
              <p className="text-center mt-6 text-red-500">Error: {errorHistory}</p>
            ) : history.length === 0 ? (
              <p className="text-center text-muted-foreground mt-4">No donation history yet.</p>
            ) : (
              history.map((d) => (
                <Card key={d.request_id}>
                  <CardHeader>
                    <h3 className="font-medium">{d.hospital_name}</h3>
                    <CardDescription>{d.status}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Date: {new Date(d.donated_at).toDateString()}</p>
                    <p className="text-sm">Units: {d.units}</p>
                    <p className="text-sm">Blood group: {d.blood_group}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>My Profile</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </div>
                <Button variant={isEditingProfile ? "default" : "outline"} onClick={() => setIsEditingProfile((s) => !s)}>
                  {isEditingProfile ? <><Save className="mr-2 h-4 w-4" /> Save</> : <><Edit className="mr-2 h-4 w-4" /> Edit</>}
                </Button>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <Label>Full Name</Label>
                  <Input value={profile.Name} disabled={!isEditingProfile} onChange={(e) => setProfile({ ...profile, Name: e.target.value })} />

                  <Label>Address</Label>
                  <Textarea value={profile.Address || ""} disabled={!isEditingProfile} onChange={(e) => setProfile({ ...profile, Address: e.target.value })} />

                  <Label>City</Label>
                  <Input value={profile.City || ""} disabled={!isEditingProfile} onChange={(e) => setProfile({ ...profile, City: e.target.value })} />

                  <Label>Score</Label>
                  <Input value={profile.Score || ""} disabled />
                  </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
