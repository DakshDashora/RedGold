"use client"

import React, { useState } from "react"
import { Button } from "../Components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../Components/ui/cards"
import { Input } from "../Components/ui/input"
import { Label } from "../Components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/ui/select"
import { Textarea } from "../Components/ui/textarea"
import { Heart, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { BASE_URL } from "../config";


export default function RegisterPage() {
  const [formData, setFormData] = useState({
    Name: "",
    Dob: "",
    BloodGroup: "",
    Email: "",
    PhoneNumber: "",
    password: "",
    Address: "",
    City: "",
    MedicalCondition: "",
    EmergencyContactName: "",
    EmergencyContactPhone: "",
  })

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.Email || !formData.password || !formData.Name) {
      alert("Please fill all required fields.")
      return
    }

    try {
      const res = await fetch(`${BASE_URL}auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        alert(data.message || "Registration successful!")
        window.location.href = "/login"
      } else {
        alert(data.message || "Registration failed.")
      }
    } catch (error) {
      console.error("Registration error:", error)
      alert("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-primary fill-primary" />
            <span className="text-2xl font-bold">RedGold</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Join Our Community</h1>
          <p className="text-muted-foreground">Create your account and start saving lives today</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Fill in your details to register</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & DOB */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    placeholder="Enter your full name"
                    value={formData.Name}
                    onChange={(e) => handleChange("Name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={formData.Dob}
                    onChange={(e) => handleChange("Dob", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Blood Group & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Blood Group</Label>
                  <Select
                    value={formData.BloodGroup}
                    onValueChange={(value) => handleChange("BloodGroup", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.PhoneNumber}
                    onChange={(e) => handleChange("PhoneNumber", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email & Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.Email}
                    onChange={(e) => handleChange("Email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Address & City */}
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea
                  placeholder="Enter your full address"
                  value={formData.Address}
                  onChange={(e) => handleChange("Address", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  placeholder="Enter your city"
                  value={formData.City}
                  onChange={(e) => handleChange("City", e.target.value)}
                  required
                />
              </div>

              {/* Medical Info */}
              <div className="space-y-2">
                <Label>Medical Conditions (Optional)</Label>
                <Textarea
                  placeholder="List any relevant medical conditions"
                  value={formData.MedicalCondition}
                  onChange={(e) => handleChange("MedicalCondition", e.target.value)}
                />
              </div>

              {/* Emergency Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Emergency Contact Name</Label>
                  <Input
                    placeholder="Enter contact name"
                    value={formData.EmergencyContactName}
                    onChange={(e) => handleChange("EmergencyContactName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Emergency Contact Phone</Label>
                  <Input
                    type="tel"
                    placeholder="Enter contact phone"
                    value={formData.EmergencyContactPhone}
                    onChange={(e) => handleChange("EmergencyContactPhone", e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
