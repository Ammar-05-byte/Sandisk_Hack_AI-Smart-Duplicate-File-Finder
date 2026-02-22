import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 120000, // 2 min for large directories
})

export const scanDirectory = (directoryPath) =>
  api.post('/scan', { directory_path: directoryPath }).then((r) => r.data)

export const findExactDuplicates = (directoryPath) =>
  api.post('/duplicates/exact', { directory_path: directoryPath }).then((r) => r.data)

export const findImageDuplicates = (directoryPath) =>
  api.post('/duplicates/image', { directory_path: directoryPath }).then((r) => r.data)

export const findTextDuplicates = (directoryPath) =>
  api.post('/duplicates/text', { directory_path: directoryPath }).then((r) => r.data)

export const getRecommendation = (duplicateGroup) =>
  api.post('/recommend', { duplicate_group: duplicateGroup }).then((r) => r.data)

export const simulateClean = (duplicateGroup) =>
  api.post('/recommend/clean', { duplicate_group: duplicateGroup }).then((r) => r.data)

export const getStorageAnalytics = (directory) =>
  api.get('/analytics/storage', { params: { directory } }).then((r) => r.data)

export const getStoragePrediction = (directory) =>
  api.get('/analytics/predict', { params: { directory } }).then((r) => r.data)

export default api
