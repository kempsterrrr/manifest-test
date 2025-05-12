import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Gallery from './Gallery'
import ImageDetail from './ImageDetail'

function App() {
  const [metadata, setMetadata] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch('/data/collection_metadata.json')
        if (!response.ok) {
          throw new Error('Failed to fetch metadata')
        }
        const data = await response.json()
        setMetadata(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMetadata()
  }, [])

  if (loading) return <div className="flex items-center justify-center min-h-screen text-xl bg-black text-white">Loading...</div>
  if (error) return <div className="flex items-center justify-center min-h-screen text-xl text-red-500 bg-black">Error: {error}</div>
  if (!metadata) return <div className="flex items-center justify-center min-h-screen text-xl bg-black text-white">No metadata found</div>

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Routes>
          <Route path="/" element={<Gallery metadata={metadata} />} />
          <Route path="/detail/:tokenId" element={<ImageDetail />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
