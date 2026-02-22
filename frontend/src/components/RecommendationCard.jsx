import React from 'react'
import { formatBytes, truncatePath } from '../utils'

function ScoreBar({ label, value }) {
  const pct = Math.round(value * 100)
  return (
    <div className="flex items-center gap-3">
      <div className="text-xs text-muted font-display w-28 shrink-0">{label}</div>
      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-xs font-display text-accent w-10 text-right">{pct}%</div>
    </div>
  )
}

export default function RecommendationCard({ recommendation }) {
  if (!recommendation) return null

  const { recommended_file, scores, emotional_importance, reason } = recommendation
  const myScore = scores[recommended_file.path]

  return (
    <div className="border border-accent/30 bg-accent/5 rounded-xl p-4 animate-fadeInUp">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-accent text-sm">◈</span>
        <span className="font-display text-sm text-accent">AI RECOMMENDATION</span>
        {emotional_importance && (
          <span className="text-xs font-display text-warn border border-warn/40 px-2 py-0.5 rounded ml-auto">
            ❤ HIGH EMOTIONAL IMPORTANCE
          </span>
        )}
      </div>

      <div className="font-display text-xs text-text mb-1">KEEP THIS FILE:</div>
      <div className="text-sm text-accent mb-1 truncate" title={recommended_file.path}>
        {truncatePath(recommended_file.path, 70)}
      </div>
      <div className="text-xs text-muted mb-4">{formatBytes(recommended_file.size)}</div>

      <div className="text-xs text-muted mb-3 italic">{reason}</div>

      {myScore && (
        <div className="space-y-2">
          <div className="text-xs font-display text-muted uppercase tracking-wider mb-2">Score Breakdown</div>
          <ScoreBar label="Resolution" value={myScore.resolution_score} />
          <ScoreBar label="Recency" value={myScore.recency_score} />
          <ScoreBar label="Folder Priority" value={myScore.folder_priority_score} />
          <ScoreBar label="File Size" value={myScore.size_score} />
          <div className="pt-2 border-t border-border mt-2">
            <ScoreBar label="TOTAL SCORE" value={myScore.total_score} />
          </div>
        </div>
      )}
    </div>
  )
}
