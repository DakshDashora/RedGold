import React from "react";
import { Button } from "../Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../Components/ui/cards";
import { Heart, Users, MapPin, Clock, Shield, Award } from "lucide-react";
import { Link } from "react-router-dom";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
     

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-8">
            <Heart className="h-16 w-16 text-primary fill-primary mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Save Lives with <span className="text-primary">RedGold</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              Connect blood donors with those in need. Our platform makes blood donation simple, efficient, and
              life-saving through smart matching and real-time coordination.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/register?type=donor">
              <Button size="lg" className="w-full sm:w-auto">
                <Heart className="mr-2 h-5 w-5" />
                Become a Donor
              </Button>
            </Link>
            <Link to="/register?type=receiver">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                <Users className="mr-2 h-5 w-5" />
                Request Blood
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Lives Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">5,000+</div>
              <div className="text-muted-foreground">Active Donors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple steps to save lives and make a difference in your community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="text-center border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">1. Register</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Sign up as a donor or receiver. Complete your profile with medical details and location.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="text-center border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">2. Match</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Our smart system matches donors with nearby requests based on blood type and location.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="text-center border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">3. Save Lives</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Connect, coordinate, and make your donation. Track your impact and help save lives.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose RedGold?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced features designed to make blood donation more efficient and accessible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Clock />, title: "Real-time Matching", desc: "Instant notifications when blood requests match your type and location." },
              { icon: <MapPin />, title: "Location-based", desc: "Find donors and requests near you with our advanced mapping system." },
              { icon: <Shield />, title: "Secure & Private", desc: "Your medical information is protected with enterprise-grade security." },
              { icon: <Award />, title: "Track Impact", desc: "See how many lives you've helped save with detailed donation history." },
              { icon: <Users />, title: "Community Driven", desc: "Join a community of heroes making a difference in their neighborhoods." },
              { icon: <Heart />, title: "24/7 Support", desc: "Round-the-clock assistance for urgent requests and technical support." },
            ].map((feature, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow text-center">
                <CardHeader>
                  <div className="h-8 w-8 text-primary mx-auto mb-2">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-4xl">
          <Heart className="h-16 w-16 mx-auto mb-6 fill-current" />
          <h2 className="text-4xl font-bold mb-6">Ready to Save Lives?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of heroes who are making a difference. Every donation counts, every life matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?type=donor">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Start Donating Today
              </Button>
            </Link>
            <Link to="/register?type=receiver">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Request Blood Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
     
    </div>
  );
}
