import React from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="py-12 px-4 bg-muted/30 border-t">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-primary fill-primary" />
              <span className="text-lg font-bold">RedGold</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Connecting hearts, saving lives through the power of community-driven blood donation.
            </p>
          </div>

          {/* Donor section */}
          <div>
            <h4 className="font-semibold mb-4">For Donors</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/register?type=donor" className="hover:text-primary">
                  Become a Donor
                </Link>
              </li>
              <li>
                <Link to="/donor-dashboard" className="hover:text-primary">
                  Donor Dashboard
                </Link>
              </li>
              <li>
                <Link to="/donation-history" className="hover:text-primary">
                  Donation History
                </Link>
              </li>
            </ul>
          </div>

          {/* Receiver section */}
          <div>
            <h4 className="font-semibold mb-4">For Receivers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/register?type=receiver" className="hover:text-primary">
                  Request Blood
                </Link>
              </li>
              <li>
                <Link to="/receiver-dashboard" className="hover:text-primary">
                  Track Requests
                </Link>
              </li>
              <li>
                <Link to="/blood-centers" className="hover:text-primary">
                  Find Centers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support section */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/help" className="hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="hover:text-primary">
                  Emergency
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RedGold. All rights reserved. Saving lives, one donation at a time.</p>
        </div>
      </div>
    </footer>
  );
}
