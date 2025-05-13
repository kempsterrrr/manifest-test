// src/hooks/useArUrl.js
import { useState, useEffect } from 'react'
import { wf } from "./Wayfinder.js"

export function useArUrl(arLink) {
  const [url, setUrl] = useState(null)

  useEffect(() => {
    let cancelled = false

    wf
      .resolveUrl({ originalUrl: arLink })
      .then(u => {
        if (!cancelled) {
          setUrl(u.toString())
        }
      })
      .catch(err => {
        console.error('Wayfinder failed to resolve', err)
      })

    return () => {
      cancelled = true
    }
  }, [arLink])

  return url
}
