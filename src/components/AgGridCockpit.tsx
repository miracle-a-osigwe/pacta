'use client';

import React, { useMemo, useState } from 'react';
import { ModuleRegistry, AllCommunityModule, ColDef, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Search, Download, RefreshCw, Shield, Zap, ExternalLink } from 'lucide-react';
import { LedgerTransaction } from '@/types';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

// Register AG Grid Community modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Seed IDs must match store.ts SEED_TX_IDS — these are the pre-loaded example rows
const SEED_IDS = new Set(['tx-seed-001', 'tx-seed-002', 'tx-seed-003', 'tx-seed-004']);

interface AgGridCockpitProps {
  transactions: LedgerTransaction[];
  onRefresh: () => void;
}

export default function AgGridCockpit({ transactions, onRefresh }: AgGridCockpitProps) {
  const [quickFilterText, setQuickFilterText] = useState('');
  const [gridApi, setGridApi] = useState<any>(null);
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'ESCROW_DEPOSIT' | 'PAYOUT_DISBURSEMENT'>('ALL');

  // Counts for the live/seed header badge
  const liveCount = useMemo(() => transactions.filter((t) => !SEED_IDS.has(t.id)).length, [transactions]);
  const seedCount = useMemo(() => transactions.filter((t) => SEED_IDS.has(t.id)).length, [transactions]);

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

  // Row-level class: live rows get a subtle green left accent via global CSS
  const getRowClass = (params: { data?: LedgerTransaction }) => {
    if (!params.data) return '';
    return SEED_IDS.has(params.data.id) ? 'ag-row-seed' : 'ag-row-live';
  };

  // Custom Column Definitions for AG Grid
  const columnDefs = useMemo<ColDef<LedgerTransaction>[]>(() => {
    return [
      {
        headerName: '',
        field: 'id',
        width: 68,
        sortable: false,
        filter: false,
        resizable: false,
        cellRenderer: (params: ICellRendererParams<LedgerTransaction>) => {
          const isSeed = SEED_IDS.has(params.value ?? '');
          if (isSeed) {
            return (
              <span title="Demo seed row — example data loaded on startup" className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-zinc-100 text-zinc-400 border border-zinc-200 uppercase tracking-wide">
                SEED
              </span>
            );
          }
          return (
            <span title="Live row — written by a real audit cycle in this session" className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-700 border border-emerald-300 uppercase tracking-wide">
              <Zap className="h-2.5 w-2.5" />
              LIVE
            </span>
          );
        },
      },
      {
        headerName: 'Timestamp',
        field: 'timestamp',
        width: 130,
        valueFormatter: (params) => {
          if (!params.value) return '';
          const d = new Date(params.value);
          return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        },
        cellClass: 'font-mono text-zinc-600 text-xs',
      },
      {
        headerName: 'Event Type',
        field: 'type',
        width: 175,
        cellRenderer: (params: ICellRendererParams<LedgerTransaction>) => {
          const type = params.value;
          if (type === 'ESCROW_DEPOSIT') {
            return (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                Escrow Deposit
              </span>
            );
          }
          if (type === 'PAYOUT_DISBURSEMENT') {
            return (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                PayPal Payout
              </span>
            );
          }
          return <span className="text-zinc-600 text-xs">{type}</span>;
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
            ? 'font-mono font-bold text-emerald-800 text-xs'
            : 'font-mono font-semibold text-zinc-900 text-xs';
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
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900">
                COMPLETED
              </span>
            );
          }
          if (status === 'HELD_IN_ESCROW') {
            return (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-900">
                LOCKED IN VAULT
              </span>
            );
          }
          return <span className="text-xs text-zinc-600">{status}</span>;
        },
      },
      {
        headerName: 'AI Judge Score',
        field: 'verificationScore',
        width: 140,
        cellRenderer: (params: ICellRendererParams<LedgerTransaction>) => {
          const score = params.value;
          if (score === undefined || score === null) {
            return <span className="text-zinc-400 text-[11px] font-mono">—</span>;
          }
          const isHigh = score >= 85;
          return (
            <div className="flex items-center gap-2">
              <div className="w-12 bg-zinc-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full ${isHigh ? 'bg-emerald-600' : 'bg-amber-600'}`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className={`text-[11px] font-mono font-bold ${isHigh ? 'text-emerald-800' : 'text-amber-800'}`}>
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
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-700 hover:text-zinc-900 transition-colors">
              <span className="truncate">{refId}</span>
              <a
                href={`https://www.sandbox.paypal.com/activity/payment/${refId}`}
                target="_blank"
                rel="noreferrer"
                title="View in PayPal Sandbox"
                className="text-zinc-400 hover:text-zinc-900 shrink-0"
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
              <p className="text-xs font-semibold text-zinc-900 truncate">{params.data?.milestoneTitle}</p>
              <p className="text-[10px] text-zinc-500 truncate">{params.data?.contractTitle}</p>
            </div>
          );
        },
      },
      {
        headerName: 'Audit Notes / Log',
        field: 'notes',
        width: 280,
        cellClass: 'text-xs text-zinc-600 truncate',
      },
    ];
  }, []);

  return (
    <div className="bg-white border border-[#E5E4DE] rounded-2xl p-6 sm:p-7 shadow-xs">
      {/* Cockpit Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-zinc-900 text-white">
              <Shield className="h-4 w-4" />
            </span>
            <h3 className="text-xl font-serif font-bold text-zinc-900">
              AG Grid Autonomous Financial Cockpit
            </h3>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5 font-mono">
            Real-time streaming ledger of autonomous agent escrow deposits and PayPal payouts.
          </p>
        </div>

        {/* Filter & Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Filter */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search ledger..."
              value={quickFilterText}
              onChange={(e) => setQuickFilterText(e.target.value)}
              className="bg-[#FAF9F6] border border-[#E5E4DE] rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex rounded-xl bg-[#EFECE6] p-1 border border-[#E5E4DE] text-xs">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                typeFilter === 'ALL' ? 'bg-zinc-900 text-white font-semibold' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              All ({transactions.length})
            </button>
            <button
              onClick={() => setTypeFilter('ESCROW_DEPOSIT')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                typeFilter === 'ESCROW_DEPOSIT'
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Deposits
            </button>
            <button
              onClick={() => setTypeFilter('PAYOUT_DISBURSEMENT')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                typeFilter === 'PAYOUT_DISBURSEMENT'
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Payouts
            </button>
          </div>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            title="Refresh Ledger"
            className="p-2 rounded-xl bg-[#FAF9F6] hover:bg-zinc-100 border border-[#E5E4DE] text-zinc-700 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* AG Grid Container (Light Institutional Theme) */}
      <div className="ag-theme-quartz h-[440px] w-full rounded-xl overflow-hidden border border-[#E5E4DE]">
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
          getRowClass={getRowClass}
        />
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-500 gap-2">
        <span className="flex items-center gap-2 flex-wrap">
          <span>Displaying {filteredData.length} transactions.</span>
          {liveCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold border border-emerald-300">
              <Zap className="h-3 w-3" />
              {liveCount} Live
            </span>
          )}
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 font-mono border border-zinc-200">
            {seedCount} Demo Seed
          </span>
        </span>
        <span className="font-mono text-zinc-600 font-medium">Powered by AG Grid v36 &amp; PayPal Developer Platform</span>
      </div>
    </div>
  );
}
