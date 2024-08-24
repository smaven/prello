'use client';

import React from 'react';
import {
  AppShell,
  Burger,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
  NavLink,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '../Logo/Logo';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 240,
        breakpoint: 'lg',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShellHeader>
        <div className="flex items-center px-3 py-3">
          <Burger opened={opened} onClick={toggle} hiddenFrom="lg" size="sm" className="mr-3" />
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </AppShellHeader>

      <AppShellNavbar p="md" className="flex flex-col justify-between">
        <div>
          <NavLink
            component={Link}
            href="/boards"
            label="Boards"
            active={pathname.startsWith('/boards')}
          />
        </div>
        <div className="flex items-center justify-center gap-3">
          <Text c="dimmed" className="text-sm">
            Toggle theme:
          </Text>
          <ColorSchemeToggle />
        </div>
      </AppShellNavbar>

      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}
