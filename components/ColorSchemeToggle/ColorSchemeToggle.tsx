'use client';

import {
  ActionIcon,
  Group,
  MantineColorScheme,
  Skeleton,
  useMantineColorScheme,
} from '@mantine/core';
import { IconDeviceDesktop, IconMoonFilled, IconProps, IconSunFilled } from '@tabler/icons-react';
import { JSX, cloneElement, useCallback, useMemo } from 'react';
import { useIsClient } from '@/hooks/use-is-client';

const iconByScheme: Map<MantineColorScheme, { iconEl: JSX.Element; label: string }> = new Map([
  ['light', { iconEl: <IconSunFilled />, label: 'Light' }],
  ['dark', { iconEl: <IconMoonFilled />, label: 'Dark' }],
  ['auto', { iconEl: <IconDeviceDesktop />, label: 'Auto' }],
]);

export function ColorSchemeToggle() {
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const isClient = useIsClient();
  const { iconEl, label } = useMemo(() => iconByScheme.get(colorScheme)!, [colorScheme]);

  const toggleColorScheme = useCallback(() => {
    const colorSchemes = Array.from(iconByScheme.keys());
    const currentIndex = colorSchemes.indexOf(colorScheme);
    const nextIndex = (currentIndex + 1) % colorSchemes.length;
    setColorScheme(colorSchemes[nextIndex]);
  }, [colorScheme, setColorScheme]);

  return (
    <Group justify="center">
      {isClient ? (
        <ActionIcon size={40} variant="default" onClick={toggleColorScheme} aria-label={label}>
          {cloneElement<IconProps>(iconEl, { className: 'h-5 w-5' })}
        </ActionIcon>
      ) : (
        <Skeleton className="h-10 w-10" />
      )}
    </Group>
  );
}
