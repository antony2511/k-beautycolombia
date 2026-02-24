'use client';

import { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  searchKey?: string;
  searchPlaceholder?: string;
  onRowClick?: (row: TData) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function DataTable<TData>({
  data,
  columns,
  searchKey,
  searchPlaceholder = 'Buscar...',
  onRowClick,
  isLoading = false,
  emptyMessage = 'No hay datos disponibles',
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleSearch = (value: string) => {
    if (searchKey) {
      table.getColumn(searchKey)?.setFilterValue(value);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <span className="material-icons text-5xl text-accent animate-spin">
            refresh
          </span>
          <p className="text-accent">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-accent-light/30">
      {/* Search bar */}
      {searchKey && (
        <div className="p-4 border-b border-accent-light/30">
          <div className="relative max-w-sm">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-accent">
              search
            </span>
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-accent-light rounded-lg focus:border-secondary focus:outline-none transition-colors"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-accent-light/20">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-bold text-primary"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'flex items-center gap-2 cursor-pointer select-none hover:text-secondary transition-colors'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <span className="material-icons text-sm">
                            {header.column.getIsSorted() === 'asc'
                              ? 'arrow_upward'
                              : header.column.getIsSorted() === 'desc'
                              ? 'arrow_downward'
                              : 'unfold_more'}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-accent"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="material-icons text-5xl">inbox</span>
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={`border-t border-accent-light/30 hover:bg-accent-light/10 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 text-sm text-accent">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-accent-light/30">
          {/* Page size selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-accent">Mostrar:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="px-3 py-1 border border-accent-light rounded-lg focus:border-secondary focus:outline-none text-sm"
            >
              {[10, 25, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            <span className="text-sm text-accent">
              Total: {table.getFilteredRowModel().rows.length}
            </span>
          </div>

          {/* Pagination buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-lg hover:bg-accent-light/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-icons">first_page</span>
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-lg hover:bg-accent-light/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-icons">chevron_left</span>
            </button>

            <span className="text-sm text-accent px-4">
              Página {table.getState().pagination.pageIndex + 1} de{' '}
              {table.getPageCount()}
            </span>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-lg hover:bg-accent-light/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-icons">chevron_right</span>
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-lg hover:bg-accent-light/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-icons">last_page</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
