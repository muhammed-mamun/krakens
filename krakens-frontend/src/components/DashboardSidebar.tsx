'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Globe, Key, LogOut, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      url: '/dashboard',
    },
    {
      title: 'Domains',
      icon: Globe,
      url: '/domains',
    },
    {
      title: 'API Keys',
      icon: Key,
      url: '/api-keys',
    },
  ];

  const isActive = (url: string) => {
    if (url === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(url);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-64 border-r bg-card flex flex-col">
      {/* Header */}
      <div className="border-b px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-base">Krakens</h2>
            <p className="text-xs text-muted-foreground">Analytics Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4">
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Main Menu
          </p>
          {menuItems.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group',
                isActive(item.url)
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 transition-transform group-hover:scale-110',
                  isActive(item.url) ? 'text-primary-foreground' : ''
                )}
              />
              <span className="font-medium text-sm">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-4 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/50">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.email || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">Account</p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  );
}
