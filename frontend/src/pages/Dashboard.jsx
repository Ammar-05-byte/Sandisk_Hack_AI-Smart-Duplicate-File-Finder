import React, { useState } from 'react'
import DirectoryInput from '../components/DirectoryInput'
import StatCard from '../components/StatCard'
import { scanDirectory, findExactDuplicates } from '../api'
import { formatBytes } from '../utils'

export default function Dashboard() {
  const [loading, setLoading] = useState(false)
  const [scanData, setScanData] = useState(null)
  const [dupData, setDupData] = useState(null)
  const [error, setError] = useState(null)
  const [directory, setDirectory] = useState('')

  const handleScan = async (path) => {
    setLoading(true)
    setError(null)
    setDirectory(path)
    try {
      const [scan, dups] = await Promise.all([
        scanDirectory(path),
        findExactDuplicates(path),
      ])
      setScanData(scan)
      setDupData(dups)
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Scan failed')
    } finally {
      setLoading(false)
    }
  }

  // Group files by extension
  const extGroups = scanData
    ? Object.entries(
        scanData.file_summary.reduce((acc, f) => {
          const ext = f.extension || 'other'
          acc[ext] = (acc[ext] || 0) + 1
          return acc
        }, {})
      )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
    : []

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="font-display text-xs text-accent/60 uppercase tracking-widest mb-2">
          STORAGE INTELLIGENCE SYSTEM
        </div>
        <h1 className="text-3xl font-display font-bold text-text">
          AI Duplicate{' '}
          <span className="text-gradient-accent">File Finder</span>
        </h1>
        <p className="text-muted mt-2 text-sm">
          Scan your filesystem to detect duplicates, near-matches, and reclaim wasted storage.
        </p>
      </div>

      {/* Scan Input */}
      <div className="bg-panel border border-border rounded-2xl p-6 mb-8">
        <div className="font-display text-xs text-muted uppercase tracking-wider mb-4">
          Directory Path
        </div>
        <DirectoryInput onSubmit={handleScan} loading={loading} />
        {error && (
          <div className="mt-3 text-xs text-warn font-display border border-warn/20 bg-warn/5 rounded-lg px-4 py-2">
            ⚠ {error}
          </div>
        )}
      </div>

      {/* Stats */}
      {scanData && (
        <div className="space-y-8 animate-fadeInUp">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Files"
              value={scanData.total_files.toLocaleString()}
              icon="◎"
              accent="accent"
            />
            <StatCard
              label="Total Size"
              value={formatBytes(scanData.total_size)}
              icon="◈"
              accent="info"
            />
            <StatCard
              label="Duplicate Groups"
              value={dupData?.duplicate_groups?.length || 0}
              icon="⬡"
              accent="warn"
            />
            <StatCard
              label="Recoverable"
              value={formatBytes(dupData?.recoverable_space || 0)}
              sub="from exact duplicates"
              icon="◉"
              accent="warn"
            />
          </div>

          {/* File type breakdown */}
          <div className="bg-panel border border-border rounded-2xl p-6">
            <div className="font-display text-xs text-muted uppercase tracking-wider mb-5">
              File Type Breakdown
            </div>
            <div className="space-y-3">
              {extGroups.map(([ext, count]) => {
                const pct = Math.round((count / scanData.total_files) * 100)
                return (
                  <div key={ext} className="flex items-center gap-4">
                    <div className="font-display text-xs text-muted w-16 shrink-0">{ext || 'other'}</div>
                    <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-xs font-display text-text w-8 text-right">{count}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Duplicate groups preview */}
          {dupData && dupData.duplicate_groups.length > 0 && (
            <div className="bg-panel border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="font-display text-xs text-muted uppercase tracking-wider">
                  Top Duplicate Groups
                </div>
                <a
                  href="/duplicates"
                  className="text-xs font-display text-accent hover:text-accent/80 transition-colors"
                >
                  VIEW ALL →
                </a>
              </div>
              <div className="space-y-2">
                {dupData.duplicate_groups.slice(0, 5).map((g, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-void/50 border border-border rounded-lg"
                  >
                    <div className="font-display text-xs text-text">Group #{i + 1}</div>
                    <div className="text-xs text-muted">{g.files.length} copies</div>
                    <div className="text-xs font-display text-warn">
                      {formatBytes(g.recoverable_space)} wasted
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Idle state */}
      {!scanData && !loading && (
        <div className="border border-dashed border-border rounded-2xl p-16 text-center">
          <div className="text-6xl mb-4 opacity-20">◈</div>
          <div className="font-display text-sm text-muted">Enter a directory path above to begin scanning</div>
        </div>
      )}
    </div>
  )
}
