import React, { useState } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import DuplicatesPage from './pages/DuplicatesPage'
import AnalyticsPage from './pages/AnalyticsPage'

const NavItem = ({ to, label, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 rounded-lg font-display text-sm transition-all duration-200 ${
        isActive
          ? 'bg-accent/10 text-accent border border-accent/30'
          : 'text-muted hover:text-text hover:bg-panel'
      }`
    }
  >
    <span className="text-lg">{icon}</span>
    {label}
  </NavLink>
)

export default function App() {
  return (
    <div className="flex min-h-screen bg-void">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col bg-panel/50">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-lg">
              ◈
            </div>
            <div>
              <div className="font-display text-sm text-accent">AI DUPEFINDER</div>
              <div className="text-xs text-muted">Storage Intelligence</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          <NavItem to="/" label="Dashboard" icon="⬡" />
          <NavItem to="/duplicates" label="Duplicates" icon="◎" />
          <NavItem to="/analytics" label="Analytics" icon="◈" />
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted font-display">
            <div>v1.0.0 — PRODUCTION</div>
            <div className="text-accent/60 mt-1">AI-Powered</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/duplicates" element={<DuplicatesPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </main>
    </div>
  )
}
