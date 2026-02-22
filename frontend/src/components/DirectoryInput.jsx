import React, { useState } from 'react'

export default function DirectoryInput({ onSubmit, loading, placeholder = '/path/to/directory' }) {
  const [path, setPath] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (path.trim()) onSubmit(path.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="flex-1 relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-display text-sm">$</span>
        <input
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder={placeholder}
          disabled={loading}
          className="w-full bg-panel border border-border rounded-lg pl-8 pr-4 py-3 font-display text-sm text-text placeholder-muted focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all disabled:opacity-50"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !path.trim()}
        className="px-6 py-3 bg-accent/10 border border-accent/40 text-accent font-display text-sm rounded-lg hover:bg-accent/20 hover:border-accent/70 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            SCANNING
          </span>
        ) : (
          'SCAN →'
        )}
      </button>
    </form>
  )
}
