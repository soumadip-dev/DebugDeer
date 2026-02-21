import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../components/ui/sidebar";

import { Github, BookOpen, Settings, LogOut, Moon, Sun } from "lucide-react";

import { signOut, useSession } from "../lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

import { Link, useNavigate, useLocation } from "react-router";
import { useTheme } from "./theme-provider";

export function AppSidebar() {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: BookOpen,
    },
    {
      title: "Repository",
      href: "/dashboard/repositories",
      icon: Github,
    },
    {
      title: "Reviews",
      href: "/dashboard/reviews",
      icon: BookOpen,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const isActive = (url: string) => {
    return location.pathname.startsWith(url);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!session) return null;

  const user = session.user;
  const userName = user?.name || "GUEST";
  const userAvatar = user?.image;

  const userInitials = userName
    .split(" ")
    .map((name: string) => name.charAt(0).toUpperCase())
    .join("");

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="border-b">
        <div className="flex flex-col gap-4 px-2 py-6">
          <div className="flex items-center gap-4 px-3 py-4 rounded-lg bg-sidebar-accent/50 hover:bg-sidebar-accent/70 transition-colors">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground flex-shrink-0">
              <Github className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-sidebar-foreground tracking-wide">
                Connected Account
              </p>
              <p className="text-sm font-medium text-sidebar-foreground/90">
                @{userName}
              </p>
            </div>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-3 py-6">
        <SidebarMenu className="gap-2">
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={`h-11 px-4 rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    : "hover:bg-sidebar-accent/60 text-sidebar-foreground"
                }`}
              >
                <Link to={item.href} className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer with User Info and Action Icons */}
      <SidebarFooter className="border-t px-3 py-4">
        <div className="flex items-center justify-between gap-2">
          {/* User Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-9 w-9 rounded-lg flex-shrink-0">
              <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
              <AvatarFallback className="rounded-lg bg-primary/10">
                {userInitials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                View profile
              </p>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors text-sidebar-foreground/70 hover:text-sidebar-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors text-sidebar-foreground/70 hover:text-destructive"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}