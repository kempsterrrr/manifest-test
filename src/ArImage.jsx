// src/components/ArImage.js
import React from 'react'
import PropTypes from 'prop-types'
import { useArUrl } from './useArUrl.js'

export function ArImage({ src, ...rest }) {
  const resolved = useArUrl(src)

//   // while gateway-selection is pending, you could render a placeholder or nothing
//   if (!resolved) return <span>Loading image…</span>

  return <img src={resolved} {...rest} />
}

ArImage.propTypes = {
  src: PropTypes.string.isRequired, // "ar://<TX_ID>/path/to.png"
}
