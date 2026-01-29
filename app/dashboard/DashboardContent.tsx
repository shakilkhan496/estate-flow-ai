"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  TrendingUp, 
  LogOut, 
  Users, 
  FileText, 
  Settings, 
  BarChart3,
  Briefcase,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TokenPayload } from "@/lib/auth";

interface DashboardContentProps {
  user: TokenPayload;
}

export default function DashboardContent({ user }: DashboardContentProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "manager":
        return "bg-purple-100 text-purple-800";
      case "broker":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", active: true },
    { icon: Briefcase, label: "Deals", href: "/dashboard/deals" },
    { icon: FileText, label: "Documents", href: "/dashboard/documents" },
    { icon: BarChart3, label: "Offers", href: "/dashboard/offers" },
    { icon: Users, label: "Team", href: "/dashboard/team", roles: ["admin", "manager"] },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MCA Pilot</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <Badge className={getRoleBadgeColor(user.role)}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          <main className="flex-1">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.name.split(" ")[0]}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here&apos;s an overview of your MCA pipeline
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Active Deals"
                value="12"
                description="In progress"
                icon={<Briefcase className="w-5 h-5" />}
              />
              <StatCard
                title="Pending Offers"
                value="8"
                description="Awaiting response"
                icon={<FileText className="w-5 h-5" />}
              />
              <StatCard
                title="Funded This Month"
                value="$245K"
                description="Total funded"
                icon={<TrendingUp className="w-5 h-5" />}
              />
              <StatCard
                title="Team Members"
                value="6"
                description="Active users"
                icon={<Users className="w-5 h-5" />}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Deals</CardTitle>
                  <CardDescription>Your latest deal activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No deals yet. Create your first deal to get started.</p>
                    <Button className="mt-4" variant="outline">
                      Create Deal
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Offers Pipeline</CardTitle>
                  <CardDescription>Active offers by status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No active offers. Submit deals to lenders to see offers here.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  description, 
  icon 
}: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
