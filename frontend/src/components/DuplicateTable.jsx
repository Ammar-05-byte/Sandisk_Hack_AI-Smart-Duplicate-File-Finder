import React, { useState } from 'react'
import { formatBytes, formatDate, truncatePath } from '../utils'
import RecommendationCard from './RecommendationCard'

function FileRow({ file, isRecommended, onSelect, selected }) {
  return (
    <div
      onClick={() => onSelect(file)}
      className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all border ${
        isRecommended
          ? 'border-accent/40 bg-accent/5'
          : selected
          ? 'border-info/40 bg-info/5'
          : 'border-transparent hover:border-border hover:bg-panel/50'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="font-display text-xs text-text truncate" title={file.path}>
          {truncatePath(file.path)}
        </div>
        <div className="text-xs text-muted mt-0.5 flex gap-3">
          <span>{formatBytes(file.size)}</span>
          <span>Modified: {formatDate(file.last_modified)}</span>
          <span className="uppercase">{file.extension || 'N/A'}</span>
        </div>
      </div>
      {isRecommended && (
        <span className="text-xs font-display text-accent border border-accent/40 px-2 py-0.5 rounded whitespace-nowrap">
          KEEP
        </span>
      )}
    </div>
  )
}

export default function DuplicateTable({ groups, type = 'exact' }) {
  const [expanded, setExpanded] = useState({})
  const [recommendations, setRecommendations] = useState({})
  const [loadingRec, setLoadingRec] = useState({})

  const toggle = (idx) => setExpanded((e) => ({ ...e, [idx]: !e[idx] }))

  const getFiles = (group) => {
    if (type === 'exact') return group.files
    return group.files
  }

  const getRecoverable = (group) => group.recoverable_space || 0

  if (!groups || groups.length === 0) {
    return (
      <div className="text-center py-12 text-muted font-display text-sm">
        No duplicates found in this category.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {groups.map((group, idx) => {
        const files = getFiles(group)
        const recoverable = getRecoverable(group)
        const isOpen = expanded[idx]
        const rec = recommendations[idx]

        return (
          <div key={idx} className="border border-border rounded-xl overflow-hidden animate-fadeInUp">
            {/* Group Header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-panel/50 transition-colors"
              onClick={() => toggle(idx)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    group.has_faces ? 'bg-warn animate-pulse' : 'bg-accent'
                  }`}
                />
                <span className="font-display text-sm text-text">
                  Group #{idx + 1} — {files.length} files
                </span>
                {group.has_faces && (
                  <span className="text-xs font-display text-warn border border-warn/40 px-2 py-0.5 rounded">
                    ❤ EMOTIONAL
                  </span>
                )}
                {group.similarity_score && (
                  <span className="text-xs text-muted">
                    {Math.round(group.similarity_score * 100)}% similar
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-display text-warn">
                  {formatBytes(recoverable)} recoverable
                </span>
                <span className="text-muted text-sm">{isOpen ? '▲' : '▼'}</span>
              </div>
            </div>

            {/* Expanded */}
            {isOpen && (
              <div className="border-t border-border bg-void/50 p-4 space-y-2">
                {files.map((file, fidx) => (
                  <FileRow
                    key={fidx}
                    file={file}
                    isRecommended={rec && rec.recommended_file?.path === file.path}
                    onSelect={() => {}}
                    selected={false}
                  />
                ))}

                {rec && (
                  <div className="mt-4">
                    <RecommendationCard recommendation={rec} />
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <button
                    disabled={loadingRec[idx]}
                    onClick={async () => {
                      setLoadingRec((l) => ({ ...l, [idx]: true }))
                      try {
                        const { getRecommendation } = await import('../api')
                        const result = await getRecommendation(files)
                        setRecommendations((r) => ({ ...r, [idx]: result }))
                      } catch (e) {
                        console.error(e)
                      } finally {
                        setLoadingRec((l) => ({ ...l, [idx]: false }))
                      }
                    }}
                    className="text-xs font-display px-4 py-2 bg-accent/10 border border-accent/30 text-accent rounded-lg hover:bg-accent/20 transition-all disabled:opacity-40"
                  >
                    {loadingRec[idx] ? 'ANALYZING...' : '◈ GET RECOMMENDATION'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
