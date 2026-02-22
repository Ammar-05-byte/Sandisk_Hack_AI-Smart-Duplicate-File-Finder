export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function truncatePath(path, maxLen = 60) {
  if (path.length <= maxLen) return path
  const parts = path.split('/')
  if (parts.length <= 2) return '...' + path.slice(-maxLen)
  return '.../' + parts.slice(-2).join('/')
}

export function getExtColor(ext) {
  const colorMap = {
    '.jpg': '#FF6B2B',
    '.jpeg': '#FF6B2B',
    '.png': '#4D9EFF',
    '.gif': '#C44DFF',
    '.mp4': '#FF4D88',
    '.mp3': '#FFD24D',
    '.pdf': '#FF4D4D',
    '.txt': '#00F5C4',
    '.doc': '#4D9EFF',
    '.docx': '#4D9EFF',
    '.zip': '#FFB84D',
    '.py': '#00F5C4',
    '.js': '#FFD24D',
  }
  return colorMap[ext?.toLowerCase()] || '#3D5066'
}
