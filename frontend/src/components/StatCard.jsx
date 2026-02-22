import React from 'react'

export default function StatCard({ label, value, sub, accent = 'accent', icon }) {
  const accentClasses = {
    accent: 'text-accent border-accent/20 bg-accent/5',
    warn: 'text-warn border-warn/20 bg-warn/5',
    info: 'text-info border-info/20 bg-info/5',
    muted: 'text-muted border-muted/20 bg-muted/5',
  }

  return (
    <div className={`border rounded-xl p-5 animate-fadeInUp ${accentClasses[accent]}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-display uppercase tracking-widest opacity-60 mb-2">{label}</div>
          <div className="text-2xl font-display font-bold">{value}</div>
          {sub && <div className="text-xs mt-1 opacity-60">{sub}</div>}
        </div>
        {icon && <span className="text-2xl opacity-40">{icon}</span>}
      </div>
    </div>
  )
}
