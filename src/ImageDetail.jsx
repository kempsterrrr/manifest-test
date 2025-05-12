import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function ImageDetail() {
  const { tokenId } = useParams()
  const navigate = useNavigate()
  const [metadata, setMetadata] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch('/data/collection_metadata.json')
        if (!response.ok) throw new Error('Failed to fetch metadata')
        const data = await response.json()
        setMetadata(data[tokenId])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchMetadata()
  }, [tokenId])

  if (loading) return <div className="flex items-center justify-center min-h-screen text-xl bg-black text-white">Loading...</div>
  if (error) return <div className="flex items-center justify-center min-h-screen text-xl text-red-500 bg-black">Error: {error}</div>
  if (!metadata) return <div className="flex items-center justify-center min-h-screen text-xl bg-black text-white">No metadata found</div>

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      <div className="w-full max-w-4xl px-4 py-12">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-gray-400 hover:text-white transition"
        >
          ← Back
        </button>
        <div className="bg-[#18181b] rounded-lg shadow-lg overflow-hidden">
          <img
            src={metadata.image}
            alt={metadata.name}
            className="w-full object-contain bg-black"
            style={{ maxHeight: 500 }}
          />
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-2">{metadata.name || `NFT #${tokenId}`}</h2>
            <div className="mb-4 text-gray-400">{metadata.owner ? `Owner: ${metadata.owner}` : null}</div>
            <div className="mb-4">
              <span className="inline-block bg-gray-700 text-xs px-2 py-1 rounded mr-2">Ethereum</span>
              {/* Add more tags if needed */}
            </div>
            <div className="mb-6">
              <p className="text-lg">{metadata.description || 'No description available.'}</p>
            </div>
            {/* Add more info/attributes if available */}
            <div className="text-sm text-gray-500">
              <div>Token ID: {tokenId}</div>
              {/* Add more fields as needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}