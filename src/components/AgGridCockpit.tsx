'use client';

import React, { useMemo, useState, useRef } from 'react';
import { ModuleRegistry, AllCommunityModule, ColDef, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Search, Download, RefreshCw, Shield, ExternalLink, ArrowRight } from 'lucide-react';
import { LedgerTransaction } from '@/types';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

// Register AG Grid Community modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface AgGridCockpitProps {
  transactions: LedgerTransaction[];
  onRefresh: () => void;
}

export default function AgGridCockpit({ transactions, onRefresh }: AgGridCockpitProps) {
  const [quickFilterText, setQuickFilterText] = useState('');
  const [gridApi, setGridApi] = useState<any>(null);
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'ESCROW_DEPOSIT' | 'PAYOUT_DISBURSEMENT'>('ALL');

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  };

  const handleExportCsv = () => {
    if (gridApi) {
      gridApi.exportDataAsCsv({
        fileName: `pacta-financial-ledger-${new Date().toISOString().slice(0, 10)}.csv`,
      });
    }
  };

  const filteredData = useMemo(() => {
    if (typeFilter === 'ALL') return transactions;
    return transactions.filter((t) => t.type === typeFilter);
  }, [transactions, typeFilter]);

  // Custom Column Definitions for AG Grid
  const columnDefs = useMemo<ColDef<LedgerTransaction>[]>(() => {
    return [
      {
        headerName: 'Timestamp',
        field: 'timestamp',
        width: 140,
        valueFormatter: (params) => {
          if (!params.value) return '';
          const d = new Date(params.value);
          return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        },
        cellClass: 'font-mono text-zinc-400 text-xs',
      },
      {
        headerName: 'Event Type',
        field: 'type',
        width: 175,
        cellRenderer: (params: ICellRendererParams<LedgerTransaction>) => {
          const type = params.value;
          if (type === 'ESCROW_DEPOSIT') {
            return (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Escrow Deposit
              </span>
            );
          }
          if (type === 'PAYOUT_DISBURSEMENT') {
            return (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                PayPal Payout
              </span>
            );
          }
          return <span className="text-zinc-400 text-xs">{type}</span>;
        },
      },
      {
        headerName: 'Amount',
        field: 'amount',
        width: 130,
        valueFormatter: (params) => {
          return `$${Number(params.value).toFixed(2)} USD`;
        },
        cellClass: (params) => {
          return params.data?.type === 'PAYOUT_DISBURSEMENT'
            ? 'font-mono font-bold text-emerald-400 text-xs'
            : 'font-mono font-semibold text-blue-300 text-xs';
        },
      },
      {
        headerName: 'Status',
        field: 'status',
        width: 145,
        cellRenderer: (params: ICellRendererParams<LedgerTransaction>) => {
          const status = params.value;
          if (status === 'SUCCESS') {
            return (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                COMPLETED
              </span>
            );
          }
          if (status === 'HELD_IN_ESCROW') {
            return (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-300">
                LOCKED IN VAULT
              </span>
            );
          }
          return <span className="text-xs text-zinc-400">{status}</span>;
        },
      },
      {
        headerName: 'AI Judge Score',
        field: 'verificationScore',
        width: 140,
        cellRenderer: (params: ICellRendererParams<LedgerTransaction>) => {
          const score = params.value;
          if (score === undefined || score === null) {
            return <span className="text-zinc-600 text-[11px] font-mono">—</span>;
          }
          const isHigh = score >= 85;
          return (
            <div className="flex items-center gap-2">
              <div className="w-12 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full ${isHigh ? 'bg-emerald-400' : 'bg-amber-400'}`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className={`text-[11px] font-mono font-bold ${isHigh ? 'text-emerald-400' : 'text-amber-400'}`}>
                {score}%
              </span>
            </div>
          );
        },
      },
      {
        headerName: 'PayPal Reference ID',
        field: 'paypalReferenceId',
        width: 210,
        cellRenderer: (params: ICellRendererParams<LedgerTransaction>) => {
          const refId = params.value || '';
          return (
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-300 hover:text-cyan-400 transition-colors">
              <span className="truncate">{refId}</span>
              <a
                href={`https://www.sandbox.paypal.com/activity/payment/${refId}`}
                target="_blank"
                rel="noreferrer"
                title="View in PayPal Sandbox"
                className="text-zinc-500 hover:text-cyan-400 shrink-0"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          );
        },
      },
      {
        headerName: 'Mission & Milestone',
        field: 'milestoneTitle',
        width: 240,
        cellRenderer: (params: ICellRendererParams<LedgerTransaction>) => {
          return (
            <div className="leading-tight py-1">
              <p className="text-xs font-medium text-zinc-200 truncate">{params.data?.milestoneTitle}</p>
              <p className="text-[10px] text-zinc-500 truncate">{params.data?.contractTitle}</p>
            </div>
          );
        },
      },
      {
        headerName: 'Audit Notes / Log',
        field: 'notes',
        width: 280,
        cellClass: 'text-xs text-zinc-400 truncate',
      },
    ];
  }, []);

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
      {/* Cockpit Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Shield className="h-4 w-4" />
            </span>
            <h3 className="text-lg font-semibold text-zinc-100">
              AG Grid Autonomous Financial Cockpit
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time streaming ledger of autonomous agent escrow deposits and PayPal payouts.
          </p>
        </div>

        {/* Filter & Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Filter */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search ledger..."
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex rounded-xl bg-zinc-950 p-1 border border-zinc-800 text-xs">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                typeFilter === 'ALL' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All ({transactions.length})
            </button>
            <button
              onClick={() => setTypeFilter('ESCROW_DEPOSIT')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                typeFilter === 'ESCROW_DEPOSIT'
                  ? 'bg-blue-600/30 text-blue-300 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Deposits
            </button>
            <button
              onClick={() => setTypeFilter('PAYOUT_DISBURSEMENT')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                typeFilter === 'PAYOUT_DISBURSEMENT'
                  ? 'bg-emerald-600/30 text-emerald-300 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Payouts
            </button>
          </div>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            title="Refresh Ledger"
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* AG Grid Container */}
      <div className="ag-theme-quartz-dark h-[440px] w-full rounded-2xl overflow-hidden border border-zinc-800">
        <AgGridReact
          rowData={filteredData}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50]}
          quickFilterText={quickFilterText}
          onGridReady={onGridReady}
          animateRows={true}
        />
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-500 gap-2">
        <span>Displaying {filteredData.length} autonomous economic transactions verified on-chain and via PayPal Sandbox.</span>
        <span className="font-mono text-zinc-400">Powered by AG Grid v36 & PayPal Developer Platform</span>
      </div>
    </div>
  );
}
