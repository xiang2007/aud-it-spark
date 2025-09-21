import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FileSearch, Upload, BarChart3 } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home", icon: FileSearch },
    { path: "/upload", label: "Upload Logs", icon: Upload },
    { path: "/results", label: "Analysis", icon: BarChart3 },
  ];

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FileSearch className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">AuditScope AI</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2",
                  location.pathname === path
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;