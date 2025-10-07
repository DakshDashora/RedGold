"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Clock, CheckCircle, Users, Loader2 } from "lucide-react"

interface Donor {
  id: number
  name: string
  bloodGroup: string
  distance: string
  status: "searching" | "found" | "notified" | "responding" | "confirmed" | "declined"
  responseTime?: string
  location: string
}

interface RequestMatchingProps {
  bloodGroup: string
  urgency: "critical" | "high" | "medium" | "low"
  onMatchComplete?: (confirmedDonors: Donor[]) => void
}

export default function RequestMatching({ bloodGroup, urgency, onMatchComplete }: RequestMatchingProps) {
  const [matchingStage, setMatchingStage] = useState<"searching" | "notifying" | "waiting" | "completed">("searching")
  const [donors, setDonors] = useState<Donor[]>([])
  const [progress, setProgress] = useState(0)

  // Mock donor data
  const mockDonors: Donor[] = [
    {
      id: 1,
      name: "John Smith",
      bloodGroup,
      distance: "0.8 miles",
      status: "searching",
      location: "Downtown Springfield",
    },
    {
      id: 2,
      name: "Mike Davis",
      bloodGroup,
      distance: "1.2 miles",
      status: "searching",
      location: "West Springfield",
    },
    {
      id: 3,
      name: "David Brown",
      bloodGroup,
      distance: "2.1 miles",
      status: "searching",
      location: "East Springfield",
    },
  ]

  useEffect(() => {
    // Simulate matching process
    const matchingProcess = async () => {
      // Stage 1: Searching for donors
      setProgress(20)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Stage 2: Found donors
      setDonors(mockDonors.map((donor) => ({ ...donor, status: "found" })))
      setProgress(40)
      setMatchingStage("notifying")
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Stage 3: Notifying donors
      setDonors((prev) => prev.map((donor) => ({ ...donor, status: "notified" })))
      setProgress(60)
      setMatchingStage("waiting")
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Stage 4: Simulating responses
      setProgress(80)
      const updatedDonors = mockDonors.map((donor, index) => ({
        ...donor,
        status: index === 0 ? "confirmed" : index === 1 ? "responding" : "declined",
        responseTime: index === 0 ? "2 min" : index === 1 ? "5 min" : "3 min",
      })) as Donor[]

      setDonors(updatedDonors)
      setProgress(100)
      setMatchingStage("completed")

      // Call completion callback
      const confirmedDonors = updatedDonors.filter((donor) => donor.status === "confirmed")
      onMatchComplete?.(confirmedDonors)
    }

    matchingProcess()
  }, [bloodGroup, onMatchComplete])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700"
      case "responding":
        return "bg-yellow-100 text-yellow-700"
      case "declined":
        return "bg-red-100 text-red-700"
      case "notified":
        return "bg-blue-100 text-blue-700"
      case "found":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStageTitle = () => {
    switch (matchingStage) {
      case "searching":
        return "Searching for Compatible Donors"
      case "notifying":
        return "Notifying Potential Donors"
      case "waiting":
        return "Waiting for Donor Responses"
      case "completed":
        return "Matching Complete"
      default:
        return "Processing Request"
    }
  }

  const getStageDescription = () => {
    switch (matchingStage) {
      case "searching":
        return "Finding donors with compatible blood type in your area..."
      case "notifying":
        return "Sending notifications to potential donors..."
      case "waiting":
        return "Waiting for donors to respond to your request..."
      case "completed":
        return "Donor matching process completed successfully!"
      default:
        return "Processing your blood request..."
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          {getStageTitle()}
        </CardTitle>
        <CardDescription>{getStageDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Matching Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Donor List */}
          <div className="space-y-4">
            {donors.length === 0 ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Searching for compatible donors...</p>
              </div>
            ) : (
              donors.map((donor) => (
                <div
                  key={donor.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {donor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{donor.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {donor.distance}
                        </span>
                        <span>{donor.location}</span>
                        {donor.responseTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {donor.responseTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{donor.bloodGroup}</Badge>
                    <Badge className={getStatusColor(donor.status)}>
                      {donor.status === "responding" && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                      {donor.status}
                    </Badge>
                    {donor.status === "confirmed" && <CheckCircle className="h-4 w-4 text-green-600" />}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          {matchingStage === "completed" && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Matching Successful!</span>
              </div>
              <p className="text-sm text-green-600">
                {donors.filter((d) => d.status === "confirmed").length} donor(s) confirmed for your request.
                {donors.filter((d) => d.status === "responding").length > 0 &&
                  ` ${donors.filter((d) => d.status === "responding").length} additional donor(s) still responding.`}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
