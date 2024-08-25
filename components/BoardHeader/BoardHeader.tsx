'use client';

import { Button, Input, Select } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDebouncedCallback, useDisclosure } from '@mantine/hooks';
import { TaskPriority } from '@prisma/client';
import { IconFilter, IconFilterFilled, IconSearch } from '@tabler/icons-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { dayjs } from '@/lib/dayjs';

export interface BoardHeaderProps {
  title: React.ReactNode;
}

export default function BoardHeader({ title }: BoardHeaderProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [filtersShown, { toggle }] = useDisclosure();
  const filters: Record<string, any> = {
    query: searchParams.get('query')?.toString(),
    priority: searchParams.get('priority')?.toString(),
    dueDate: searchParams.get('dueDate') ? new Date(searchParams.get('dueDate')!) : null,
  };

  const hasActiveFilters = Object.keys(filters)
    .filter((k) => k !== 'query')
    .map((k) => filters[k])
    .some((v) => Boolean(v));

  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback(
    (term: string) => handleFilterChange('query', term),
    500
  );

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        {title}
        <div className="flex gap-2">
          <Input
            defaultValue={filters.query}
            placeholder="Search tasks..."
            onChange={(event) => handleSearch(event.target.value)}
            leftSection={<IconSearch size={20} />}
          />
          <Button
            leftSection={
              hasActiveFilters ? <IconFilterFilled size={20} /> : <IconFilter size={20} />
            }
            variant={filtersShown ? 'light' : 'default'}
            onClick={toggle}
            className="flex-shrink-0"
          >
            Filters
          </Button>
        </div>
      </div>

      {filtersShown ? (
        <div className="mt-4 flex flex-col justify-end gap-4 sm:flex-row">
          <Select
            clearable
            label="Priority"
            defaultValue={filters.priority}
            placeholder="Select priority"
            data={Object.values(TaskPriority).map((p) => ({
              value: p,
              label: p.toLowerCase().replace(/^\w/, (c) => c.toUpperCase()),
            }))}
            onChange={(value) => handleFilterChange('priority', value)}
          />
          <DateInput
            clearable
            defaultValue={filters.dueDate}
            label="Due date"
            placeholder="Filter by due date"
            onChange={(value) =>
              handleFilterChange('dueDate', value ? dayjs(value).format('YYYY-MM-DD') : null)
            }
          />
        </div>
      ) : null}
    </div>
  );
}
