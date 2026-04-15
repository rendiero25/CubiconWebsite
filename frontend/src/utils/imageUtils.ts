/**
 * Center a data-URL image on a square canvas with transparent padding.
 * Ensures icon output is always 1:1 regardless of what the AI model returns.
 */
export function makeSquare(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const size = Math.max(img.width, img.height)
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      if (!ctx) { resolve(dataUrl); return }
      // Transparent background; center the image
      const x = Math.floor((size - img.width) / 2)
      const y = Math.floor((size - img.height) / 2)
      ctx.drawImage(img, x, y)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => reject(new Error('makeSquare: failed to load image'))
    img.src = dataUrl
  })
}
