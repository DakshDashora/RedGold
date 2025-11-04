"use client"

import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "../Components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../Components/ui/cards"
import { Input } from "../Components/ui/input"
import { Label } from "../Components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/ui/select"
import { Textarea } from "../Components/ui/textarea"
import { Heart, ArrowLeft } from "lucide-react"
import { BASE_URL } from "../config"

export default function RegisterPage() {
  const navigate = useNavigate()

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
        navigate("/login") // ✅ replaces window.location.href
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
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
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
              {/* (rest of your form remains exactly the same) */}

              <Button type="submit" className="w-full">
                Create Account
              </Button>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link to="/login" className="text-primary hover:underline font-medium">
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
