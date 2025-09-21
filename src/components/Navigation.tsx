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
    <nav className="bg-aws_squid_ink-900 border-b border-aws_gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FileSearch className="h-8 w-8 text-aws_orange-400" />
              <span className="text-xl font-bold text-white">AuditScope AI</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2",
                  location.pathname === path
                    ? "bg-aws_orange-500 text-white shadow-md"
                    : "text-aws_gray-300 hover:text-white hover:bg-aws_blue-700"
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