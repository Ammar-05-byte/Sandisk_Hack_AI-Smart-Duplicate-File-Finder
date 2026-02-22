import React, { useState } from 'react'
import DirectoryInput from '../components/DirectoryInput'
import StatCard from '../components/StatCard'
import { FileTypePieChart } from '../components/StorageAnalyticsCharts'
import PredictionCard from '../components/PredictionCard'
import { getStorageAnalytics, getStoragePrediction } from '../api'
import { formatBytes } from '../utils'

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(false)
  const [analytics, setAnalytics] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [error, setError] = useState(null)

  const handleScan = async (path) => {
    setLoading(true)
    setError(null)
    try {
      const [ana, pred] = await Promise.all([
        getStorageAnalytics(path),
        getStoragePrediction(path),
      ])
      setAnalytics(ana)
      setPrediction(pred)
    } catch (e) {
      setError(e.response?.data?.detail || e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="font-display text-xs text-accent/60 uppercase tracking-widest mb-2">
          STORAGE ANALYTICS
        </div>
        <h1 className="text-3xl font-display font-bold text-text">
          Storage{' '}
          <span className="text-gradient-accent">Intelligence</span>
        </h1>
        <p className="text-muted mt-2 text-sm">
          Understand your storage patterns, waste, and predict future growth.
        </p>
      </div>

      {/* Input */}
      <div className="bg-panel border border-border rounded-2xl p-6 mb-8">
        <DirectoryInput onSubmit={handleScan} loading={loading} />
        {error && (
          <div className="mt-3 text-xs text-warn font-display border border-warn/20 bg-warn/5 rounded-lg px-4 py-2">
            ⚠ {error}
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-16 text-muted font-display text-sm">
          <div className="inline-block w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-4" />
          <div>ANALYZING STORAGE...</div>
        </div>
      )}

      {analytics && (
        <div className="space-y-8 animate-fadeInUp">
          {/* Top stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Storage"
              value={formatBytes(analytics.total_storage)}
              icon="◈"
              accent="info"
            />
            <StatCard
              label="Unique Storage"
              value={formatBytes(analytics.unique_storage)}
              icon="◎"
              accent="accent"
            />
            <StatCard
              label="Duplicate Waste"
              value={formatBytes(analytics.duplicate_storage)}
              icon="⚠"
              accent="warn"
            />
            <StatCard
              label="GB Recoverable"
              value={`${analytics.gb_recoverable} GB`}
              sub="from exact duplicates"
              icon="◉"
              accent="accent"
            />
          </div>

          {/* Environmental impact */}
          <div className="bg-panel border border-accent/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-accent text-lg">🌱</span>
              <div className="font-display text-sm text-accent uppercase tracking-wider">Environmental Impact</div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-xs font-display text-muted uppercase tracking-wider mb-1">CO₂ Savings Potential</div>
                <div className="text-3xl font-display text-accent">{analytics.co2_saved_kg.toFixed(3)} kg</div>
                <div className="text-xs text-muted mt-1">per year if duplicates removed</div>
              </div>
              <div>
                <div className="text-xs font-display text-muted uppercase tracking-wider mb-1">Recoverable Space</div>
                <div className="text-3xl font-display text-accent">{analytics.gb_recoverable} GB</div>
                <div className="text-xs text-muted mt-1">≈ {(analytics.gb_recoverable * 16.67).toFixed(0)} hrs of HD streaming</div>
              </div>
            </div>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie chart */}
            <div className="bg-panel border border-border rounded-2xl p-6">
              <FileTypePieChart data={analytics.file_type_distribution} />
            </div>

            {/* Top extensions table */}
            <div className="bg-panel border border-border rounded-2xl p-6">
              <div className="font-display text-xs text-muted uppercase tracking-wider mb-4">Top File Types by Size</div>
              <div className="space-y-2">
                {analytics.file_type_distribution.slice(0, 10).map((ft, i) => {
                  const pct = Math.round((ft.size / analytics.total_storage) * 100)
                  return (
                    <div key={ft.type} className="flex items-center gap-3">
                      <div className="text-xs font-display text-muted w-4 shrink-0">{i + 1}</div>
                      <div className="font-display text-xs text-text w-20 shrink-0">{ft.type || 'no ext'}</div>
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-info rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-xs font-display text-muted w-16 text-right">{formatBytes(ft.size)}</div>
                      <div className="text-xs text-muted/60 w-8 text-right">{ft.count}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Prediction */}
          {prediction && (
            <div className="bg-panel border border-border rounded-2xl p-6">
              <div className="font-display text-xs text-muted uppercase tracking-wider mb-6">
                Predictive Storage Forecast
              </div>
              <PredictionCard prediction={prediction} />
            </div>
          )}
        </div>
      )}

      {!analytics && !loading && (
        <div className="border border-dashed border-border rounded-2xl p-16 text-center">
          <div className="text-6xl mb-4 opacity-20">◈</div>
          <div className="font-display text-sm text-muted">Enter a directory path to analyze storage</div>
        </div>
      )}
    </div>
  )
}
