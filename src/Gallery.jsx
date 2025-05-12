import { useNavigate } from 'react-router-dom'

export default function Gallery({ metadata }) {
  const navigate = useNavigate()
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-12">
      <h1 className="text-3xl font-bold mb-8 text-left">Works</h1>
      <div
        className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
        style={{ columnGap: '1rem' }}
      >
        {Object.entries(metadata).map(([tokenId, data]) => (
          <div
            key={tokenId}
            className="mb-4 break-inside-avoid rounded overflow-hidden bg-transparent cursor-pointer"
            onClick={() => navigate(`/detail/${tokenId}`)}
          >
            <img
              src={data.image}
              alt={`NFT #${tokenId}`}
              className="w-full h-auto object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  )
}