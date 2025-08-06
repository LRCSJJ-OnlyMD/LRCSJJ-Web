'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  Menu,
  Home,
  Building,
  Users,
  Shield,
  Trophy,
  Calendar,
  UserCheck,
  LogOut,
  ChevronDown,
  ChevronRight,
  MapPin
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { LeagueLogo } from '@/components/logos/LeagueLogo'

interface SidebarProps {
  className?: string
}

interface NavItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  children?: NavItem[]
}



function SidebarNav({ className }: { className?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const navigation: NavItem[] = [
    {
      title: 'Tableau de Bord',
      href: '/admin',
      icon: Home
    },
    {
      title: 'Clubs',
      icon: Building,
      children: [
        { title: 'Tous les Clubs', href: '/admin/clubs', icon: Building }
      ]
    },
    {
      title: 'Athlètes',
      icon: Users,
      children: [
        { title: 'Tous les Athlètes', href: '/admin/athletes', icon: Users }
      ]
    },
    {
      title: 'Assurances',
      icon: Shield,
      children: [
        { title: 'Gérer les Assurances', href: '/admin/insurance', icon: Shield },
        { title: 'Statistiques', href: '/admin/insurance/stats', icon: Shield }
      ]
    },
    {
      title: 'Saisons',
      icon: Calendar,
      children: [
        { title: 'Toutes les Saisons', href: '/admin/seasons', icon: Calendar }
      ]
    },
    {
      title: 'Championnats',
      icon: Trophy,
      children: [
        { title: 'Tous les Championnats', href: '/admin/championships', icon: Trophy }
      ]
    },
    {
      title: 'Équipes de Ligue',
      icon: UserCheck,
      children: [
        { title: 'Toutes les Équipes', href: '/admin/teams', icon: UserCheck }
      ]
    },
    {
      title: 'Configuration Carte',
      href: '/admin/map-config',
      icon: MapPin
    }
  ]

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    router.push('/login')
  }

  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <LeagueLogo size="sm" showText={true} />
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isExpanded = expandedItems.includes(item.title)
            const isActive = pathname === item.href

            if (item.children) {
              return (
                <div key={item.title}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full justify-between text-left font-normal',
                      'hover:bg-accent hover:text-accent-foreground',
                      'text-foreground'
                    )}
                    onClick={() => toggleExpanded(item.title)}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link key={child.title} href={child.href!}>
                          <Button
                            variant="ghost"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              pathname === child.href
                                ? 'bg-[#d62027] text-white hover:bg-[#d62027]/90'
                                : 'hover:bg-accent hover:text-accent-foreground text-foreground'
                            )}
                          >
                            <child.icon className="mr-2 h-4 w-4" />
                            {child.title}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link key={item.title} href={item.href!}>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    isActive
                      ? 'bg-[#d62027] text-white hover:bg-[#d62027]/90'
                      : 'hover:bg-accent hover:text-accent-foreground text-foreground'
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Logout */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-left font-normal text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  )
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn('hidden border-r bg-card border-border lg:block lg:w-64', className)}>
      <SidebarNav />
    </div>
  )
}

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SidebarNav />
      </SheetContent>
    </Sheet>
  )
}
