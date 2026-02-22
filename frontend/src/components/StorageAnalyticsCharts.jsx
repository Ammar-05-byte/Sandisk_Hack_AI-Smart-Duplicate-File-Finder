import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts'
import { formatBytes, getExtColor } from '../utils'

const COLORS = ['#00F5C4', '#4D9EFF', '#FF6B2B', '#C44DFF', '#FFD24D', '#FF4D88', '#3D5066', '#00C9A7']

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-panel border border-border rounded-lg p-3 text-xs font-display shadow-xl">
        <div className="text-text">{payload[0].name || payload[0].payload?.type}</div>
        <div className="text-accent">{formatBytes(payload[0].value)}</div>
        <div className="text-muted">{payload[0].payload?.count} files</div>
      </div>
    )
  }
  return null
}

export function FileTypePieChart({ data }) {
  if (!data || data.length === 0) return null
  const top = data.slice(0, 8)

  return (
    <div>
      <div className="font-display text-xs text-muted uppercase tracking-wider mb-4">File Type Distribution</div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={top}
            dataKey="size"
            nameKey="type"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={50}
            paddingAngle={2}
          >
            {top.map((entry, index) => (
              <Cell key={entry.type} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-1 mt-2">
        {top.map((entry, index) => (
          <div key={entry.type} className="flex items-center gap-2 text-xs text-muted">
            <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: COLORS[index % COLORS.length] }} />
            <span className="truncate">{entry.type || 'no ext'}</span>
            <span className="ml-auto text-muted/60">{entry.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DuplicateBarChart({ groups }) {
  if (!groups || groups.length === 0) return null

  const data = groups.slice(0, 10).map((g, i) => ({
    name: `#${i + 1}`,
    files: g.files.length,
    size: Math.round(g.recoverable_space / 1024 / 1024),
  }))

  return (
    <div>
      <div className="font-display text-xs text-muted uppercase tracking-wider mb-4">Duplicate Group Sizes (MB)</div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1A2535" />
          <XAxis dataKey="name" tick={{ fill: '#3D5066', fontSize: 11, fontFamily: 'Space Mono' }} />
          <YAxis tick={{ fill: '#3D5066', fontSize: 11, fontFamily: 'Space Mono' }} />
          <Tooltip
            contentStyle={{ background: '#0E1520', border: '1px solid #1A2535', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#C8D6E5', fontFamily: 'Space Mono' }}
            itemStyle={{ color: '#00F5C4' }}
          />
          <Bar dataKey="size" fill="#00F5C4" radius={[4, 4, 0, 0]} name="MB recoverable" />
          <Bar dataKey="files" fill="#4D9EFF" radius={[4, 4, 0, 0]} name="File count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
