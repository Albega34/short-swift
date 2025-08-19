import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, Link as LinkIcon } from "lucide-react";

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-gradient-card border-b border-border shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LinkShrink</span>
          </Link>
          
          <nav className="flex items-center space-x-2">
            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/">Shorten</Link>
            </Button>
            <Button
              variant={location.pathname === "/stats" ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/stats" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Statistics</span>
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;