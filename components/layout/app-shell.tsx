
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import React from 'react';
import {
  Brain,
  BrainCircuit,
  Gauge,
  Leaf,
  LineChart,
  MessageSquare,
  NotebookText,
  PanelLeft,
  ShieldAlert,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
  useSidebar, // Import useSidebar
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  matchSegments?: number;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Journal', icon: <NotebookText />, matchSegments: 0 },
  { href: '/mood-tracker', label: 'Mood Tracker', icon: <LineChart /> },
  { href: '/chatbot', label: 'AI Chatbot', icon: <MessageSquare /> },
  { href: '/cbt-exercises', label: 'CBT Exercises', icon: <Brain /> },
  { href: '/breathing-exercises', label: 'Breathing Exercises', icon: <Leaf /> },
  { href: '/burnout-barometer', label: 'Burnout Barometer', icon: <Gauge /> },
  { href: '/emergency-contacts', label: 'Emergency Contacts', icon: <ShieldAlert /> },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar(); // Get isMobile from useSidebar

  const isActive = (href: string, matchSegments?: number) => {
    if (matchSegments === 0 && href === '/') {
      return pathname === '/';
    }
    if (href === '/') return false;
    const currentSegments = pathname.split('/').filter(Boolean);
    const targetSegments = href.split('/').filter(Boolean);
    const segmentsToMatch = matchSegments ?? targetSegments.length;
    
    if (currentSegments.length < segmentsToMatch) return false;

    for (let i = 0; i < segmentsToMatch; i++) {
      if (currentSegments[i] !== targetSegments[i]) return false;
    }
    return true;
  };

  return (
    <>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2 group-data-[state=collapsed]/peer:justify-center">
            <BrainCircuit className="w-8 h-8 text-sidebar-primary" />
            {isMobile ? (
              <SheetTitle asChild>
                <h1 className="text-2xl font-headline font-bold group-data-[state=collapsed]/peer:hidden text-sidebar-foreground">MindFlow</h1>
              </SheetTitle>
            ) : (
              <h1 className="text-2xl font-headline font-bold group-data-[state=collapsed]/peer:hidden text-sidebar-foreground">MindFlow</h1>
            )}
          </Link>
        </SidebarHeader>
        <SidebarContent asChild>
          <ScrollArea className="h-full">
            <nav className="p-4">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => isMobile && setOpenMobile(false)}
                      className={cn(
                        "flex items-center rounded-md text-sm font-medium transition-colors",
                        "group-data-[state=expanded]/peer:gap-3 group-data-[state=expanded]/peer:px-3 group-data-[state=expanded]/peer:py-3",
                        "group-data-[state=collapsed]/peer:size-10 group-data-[state=collapsed]/peer:p-2.5 group-data-[state=collapsed]/peer:justify-center",
                        isActive(item.href, item.matchSegments)
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        "[&_svg]:size-5"
                      )}
                    >
                      {React.cloneElement(item.icon as React.ReactElement, { className: cn("flex-shrink-0", (item.icon as React.ReactElement).props.className) })}
                      <span className="group-data-[state=collapsed]/peer:hidden group-data-[state=collapsed]/peer:sr-only">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </ScrollArea>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 md:hidden">
            <SidebarTrigger asChild className="md:hidden">
                 <Button variant="ghost" size="icon" className="text-sidebar-primary hover:text-sidebar-accent">
                    <PanelLeft className="h-6 w-6" />
                    <span className="sr-only">Toggle Sidebar</span>
                </Button>
            </SidebarTrigger>
            <Link href="/" className="flex items-center gap-2 text-sidebar-primary hover:text-sidebar-accent transition-colors">
              <BrainCircuit className="w-7 h-7" />
              {/* Removed SheetTitle from here, as this header is not part of the SheetContent */}
              <h1 className="text-xl font-headline font-bold text-sidebar-foreground">MindFlow</h1>
            </Link>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </>
  );
}
