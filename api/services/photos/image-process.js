import axios from 'axios'
import sharp from 'sharp'

class ImageProcessor {
  async urlToBase64(url) {
    let response
    try {
      response = await axios.get(url, {
        responseType: 'arraybuffer',
      })
    } catch (err) {
      throw err
    }

    const buffer = Buffer.from(response.data, 'utf-8')
    return buffer
  }

  async urlToWebPBuffer(url) {
    let buffer = await this.urlToBase64(url)
    buffer = await sharp(buffer).webp({ lossless: true }).toBuffer()
    return buffer
  }

  async resizeToFit(input, sharpOptions) {
    const buffer = await sharp(input)
      .resize({
        ...sharpOptions,
        fit: 'inside',
      })
      .toBuffer()
    return buffer
  }
}

export default ImageProcessor
