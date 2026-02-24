import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../components/ui/sidebar';

import { Github, BookOpen, Settings, LogOut, Moon, Sun, LayoutDashboard } from 'lucide-react';

import { signOut, useSession } from '../lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

import { Link, useNavigate, useLocation } from 'react-router';
import { useTheme } from './theme-provider';

export function AppSidebar() {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const navigationItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Repository',
      href: '/dashboard/repositories',
      icon: Github,
    },
    {
      title: 'Reviews',
      href: '/dashboard/reviews',
      icon: BookOpen,
    },
    {
      title: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
    },
  ];

  const isActive = (url: string) => {
    return location.pathname === url || location.pathname.startsWith(url + '/');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!session) return null;

  const user = session.user;
  const userName = user?.name || 'GUEST';
  const userAvatar = user?.image;

  const userInitials = userName
    .split(' ')
    .map((name: string) => name.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="border-b border-border/50">
        <div className="flex items-center gap-3 px-4 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/90 to-primary text-primary-foreground shadow-md">
            <Github className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">DebugDeer</span>
            <span className="text-xs text-muted-foreground">Developer Dashboard</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarMenu className="space-y-1">
          {navigationItems.map(item => {
            const active = isActive(item.href);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={`
                    relative h-11 px-3 rounded-xl transition-all duration-200
                    ${
                      active
                        ? 'bg-primary/10 text-primary font-medium before:absolute before:left-0 before:top-1/2 before:h-5 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-primary'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                    }
                  `}
                >
                  <Link to={item.href} className="flex items-center gap-3">
                    <item.icon className={`h-5 w-5 shrink-0 ${active ? 'text-primary' : ''}`} />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-xl border-2 border-border/50">
            <AvatarImage src={userAvatar || '/placeholder.svg'} alt={userName} />
            <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email || 'Connected'}</p>
          </div>

          <div className="flex items-center gap-0.5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
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
