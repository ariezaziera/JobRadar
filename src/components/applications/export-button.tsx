'use client'

import { useState, useRef, useEffect } from 'react'
import { exportToCSV, exportToPDF } from '@/lib/export'
import {
  Download, FileText, FileSpreadsheet,
  ChevronDown, Loader2
} from 'lucide-react'
import type { Application } from '@/types'

interface Props {
  applications: Application[]
  profileName?: string | null
}

export function ExportButton({ applications, profileName }: Props) {
  const [open, setOpen] = useState(false)
  const [exporting, setExporting] = useState<'csv' | 'pdf' | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function handleCSV() {
    setExporting('csv')
    setOpen(false)
    await new Promise(r => setTimeout(r, 100))
    exportToCSV(applications)
    setExporting(null)
  }

  async function handlePDF() {
    setExporting('pdf')
    setOpen(false)
    await new Promise(r => setTimeout(r, 100))
    exportToPDF(applications, profileName ?? null)
    setExporting(null)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        disabled={!!exporting || applications.length === 0}
        className="flex items-center gap-2 px-4 py-2.5 border border-border hover:border-primary/40 text-sm text-muted hover:text-foreground rounded-xl transition-colors disabled:opacity-50"
      >
        {exporting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Download size={16} />
        )}
        {exporting === 'csv' ? 'Exporting CSV…'
          : exporting === 'pdf' ? 'Building PDF…'
          : 'Export'}
        {!exporting && <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden">
          <div className="p-2 space-y-1">

            <button
              onClick={handleCSV}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-sm text-left transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet size={15} className="text-emerald-400" />
              </div>
              <div>
                <p className="font-medium text-foreground">Export CSV</p>
                <p className="text-xs text-muted">Open in Excel / Sheets</p>
              </div>
            </button>

            <button
              onClick={handlePDF}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-sm text-left transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0">
                <FileText size={15} className="text-red-400" />
              </div>
              <div>
                <p className="font-medium text-foreground">Export PDF</p>
                <p className="text-xs text-muted">3-page report with charts</p>
              </div>
            </button>

          </div>

          <div className="px-4 py-2.5 border-t border-border">
            <p className="text-xs text-muted">
              {applications.length} application{applications.length !== 1 ? 's' : ''} will be exported
            </p>
          </div>
        </div>
      )}
    </div>
  )
}