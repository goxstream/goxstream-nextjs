"use client";

import type { Table } from "@tanstack/react-table";
import { Settings2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchColumnId?: string;
  searchPlaceholder?: string;
  facetedFilters?: {
    id: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
}

export function DataTableToolbar<TData>({
  table,
  searchColumnId,
  searchPlaceholder = "Search...",
  facetedFilters = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    !!table.getState().globalFilter;

  // Find search value (either from column filter or global filter)
  const searchValue = searchColumnId
    ? (table.getColumn(searchColumnId)?.getFilterValue() as string) ?? ""
    : (table.getState().globalFilter as string) ?? "";

  const handleSearchChange = (value: string) => {
    if (searchColumnId) {
      table.getColumn(searchColumnId)?.setFilterValue(value);
    } else {
      table.setGlobalFilter(value);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => handleSearchChange(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {facetedFilters.map(
          (filter) =>
            table.getColumn(filter.id) && (
              <DataTableFacetedFilter
                key={filter.id}
                column={table.getColumn(filter.id)}
                title={filter.title}
                options={filter.options}
              />
            )
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter(undefined);
            }}
            className="h-8 px-2 lg:px-3 cursor-pointer text-muted-foreground hover:text-foreground"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex cursor-pointer"
          >
            <Settings2 className="mr-2 h-4 w-4" />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize cursor-pointer"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
