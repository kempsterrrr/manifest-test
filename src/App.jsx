import { useState, useEffect } from 'react'
import './App.css'

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

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!metadata) return <div>No metadata found</div>

  return (
    <div className="container">
      <h1>NFT Collection Gallery</h1>
      <div className="gallery">
        {Object.entries(metadata).map(([tokenId, data]) => (
          <div key={tokenId} className="nft-card">
            <h2>Token #{tokenId}</h2>
            <img 
              src={data.image} 
              alt={`NFT #${tokenId}`} 
              className="nft-image"
            />
            <div className="nft-details">
              <h3>{data.name}</h3>
              <p>{data.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
