import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

export default function PredictionCard({ prediction }) {
  if (!prediction) return null

  const { days_until_full, growth_rate_gb_per_day, predicted_sizes, confidence } = prediction

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="border border-warn/20 bg-warn/5 rounded-xl p-4">
          <div className="font-display text-xs text-warn/60 uppercase tracking-wider mb-1">Days Until Full</div>
          <div className="text-2xl font-display text-warn">
            {days_until_full != null ? days_until_full : '∞'}
          </div>
          <div className="text-xs text-muted mt-1">estimated</div>
        </div>
        <div className="border border-accent/20 bg-accent/5 rounded-xl p-4">
          <div className="font-display text-xs text-accent/60 uppercase tracking-wider mb-1">Growth Rate</div>
          <div className="text-2xl font-display text-accent">
            {growth_rate_gb_per_day.toFixed(3)}
          </div>
          <div className="text-xs text-muted mt-1">GB / day</div>
        </div>
        <div className="border border-info/20 bg-info/5 rounded-xl p-4">
          <div className="font-display text-xs text-info/60 uppercase tracking-wider mb-1">Model Confidence</div>
          <div className="text-2xl font-display text-info">
            {Math.round(confidence * 100)}%
          </div>
          <div className="text-xs text-muted mt-1">R² score</div>
        </div>
      </div>

      {/* Chart */}
      <div>
        <div className="font-display text-xs text-muted uppercase tracking-wider mb-4">90-Day Storage Forecast</div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={predicted_sizes}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A2535" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#3D5066', fontSize: 10, fontFamily: 'Space Mono' }}
              interval={2}
            />
            <YAxis
              dataKey="size_gb"
              tick={{ fill: '#3D5066', fontSize: 10, fontFamily: 'Space Mono' }}
              tickFormatter={(v) => `${v}GB`}
            />
            <Tooltip
              contentStyle={{ background: '#0E1520', border: '1px solid #1A2535', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#C8D6E5', fontFamily: 'Space Mono' }}
              formatter={(v) => [`${v} GB`, 'Predicted Size']}
            />
            <Line
              type="monotone"
              dataKey="size_gb"
              stroke="#4D9EFF"
              strokeWidth={2}
              dot={false}
              strokeDasharray="4 2"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
