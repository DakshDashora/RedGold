import React from "react";
import { Button } from "./Components/ui/button"; // Adjust path if needed
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "./Context/AuthContext"; // adjust path if different

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-primary fill-primary" />
          <span className="text-2xl font-bold text-foreground">RedGold</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/donor-dashboard">
                <Button variant="ghost">Donor Dashboard</Button>
              </Link>
              <Link to="/receiver-dashboard">
                <Button variant="ghost">Receiver Dashboard</Button>
              </Link>
              <Button onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Signup</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
