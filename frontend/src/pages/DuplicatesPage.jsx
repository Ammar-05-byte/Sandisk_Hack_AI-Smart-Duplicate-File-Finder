import React, { useState } from 'react'
import DirectoryInput from '../components/DirectoryInput'
import DuplicateTable from '../components/DuplicateTable'
import { DuplicateBarChart } from '../components/StorageAnalyticsCharts'
import { findExactDuplicates, findImageDuplicates, findTextDuplicates } from '../api'
import { formatBytes } from '../utils'

const TABS = [
  { key: 'exact', label: 'Exact Duplicates', icon: '◎' },
  { key: 'image', label: 'Image Near-Dupes', icon: '⬡' },
  { key: 'text', label: 'Text Similarity', icon: '◈' },
]

export default function DuplicatesPage() {
  const [tab, setTab] = useState('exact')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState({ exact: null, image: null, text: null })
  const [error, setError] = useState(null)

  const handleScan = async (path) => {
    setLoading(true)
    setError(null)
    try {
      const [exact, image, text] = await Promise.allSettled([
        findExactDuplicates(path),
        findImageDuplicates(path),
        findTextDuplicates(path),
      ])
      setResults({
        exact: exact.status === 'fulfilled' ? exact.value : null,
        image: image.status === 'fulfilled' ? image.value : null,
        text: text.status === 'fulfilled' ? text.value : null,
      })
    } catch (e) {
      setError(e.response?.data?.detail || e.message)
    } finally {
      setLoading(false)
    }
  }

  const currentData = results[tab]
  const groups =
    tab === 'exact'
      ? currentData?.duplicate_groups
      : currentData?.duplicate_groups

  const recoverable = currentData?.recoverable_space || 0

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="font-display text-xs text-accent/60 uppercase tracking-widest mb-2">
          DUPLICATE DETECTION
        </div>
        <h1 className="text-3xl font-display font-bold text-text">
          Find &amp; Eliminate{' '}
          <span className="text-gradient-accent">Duplicates</span>
        </h1>
        <p className="text-muted mt-2 text-sm">
          Exact hash matching, perceptual image similarity, and AI text deduplication.
        </p>
      </div>

      {/* Input */}
      <div className="bg-panel border border-border rounded-2xl p-6 mb-6">
        <DirectoryInput onSubmit={handleScan} loading={loading} />
        {error && (
          <div className="mt-3 text-xs text-warn font-display border border-warn/20 bg-warn/5 rounded-lg px-4 py-2">
            ⚠ {error}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map((t) => {
          const count = results[t.key]?.duplicate_groups?.length || 0
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-display text-xs transition-all border ${
                tab === t.key
                  ? 'bg-accent/10 text-accent border-accent/30'
                  : 'text-muted hover:text-text border-border hover:border-muted/30'
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
              {results[t.key] && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    tab === t.key ? 'bg-accent/20 text-accent' : 'bg-border text-muted'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Summary bar */}
      {currentData && (
        <div className="flex items-center gap-6 mb-6 p-4 bg-panel border border-border rounded-xl">
          <div>
            <div className="text-xs font-display text-muted uppercase tracking-wider">Groups Found</div>
            <div className="text-xl font-display text-text">{groups?.length || 0}</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <div className="text-xs font-display text-muted uppercase tracking-wider">Recoverable Space</div>
            <div className="text-xl font-display text-warn">{formatBytes(recoverable)}</div>
          </div>
          {tab === 'exact' && currentData.total_duplicate_files !== undefined && (
            <>
              <div className="h-8 w-px bg-border" />
              <div>
                <div className="text-xs font-display text-muted uppercase tracking-wider">Extra Copies</div>
                <div className="text-xl font-display text-info">{currentData.total_duplicate_files}</div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Bar chart for duplicate groups */}
      {groups && groups.length > 0 && (
        <div className="bg-panel border border-border rounded-2xl p-6 mb-6">
          <DuplicateBarChart groups={groups} />
        </div>
      )}

      {/* Duplicate table */}
      <div className="bg-panel border border-border rounded-2xl p-6">
        {loading ? (
          <div className="text-center py-16 text-muted font-display text-sm">
            <div className="inline-block w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-4" />
            <div>SCANNING — This may take a moment for large directories...</div>
          </div>
        ) : currentData ? (
          <DuplicateTable groups={groups} type={tab} />
        ) : (
          <div className="text-center py-12 text-muted font-display text-sm">
            Run a scan to see results
          </div>
        )}
      </div>
    </div>
  )
}
