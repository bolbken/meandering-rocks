import axios from 'axios'

class GooglePhotos {
  constructor(access_token) {
    this.access_token = access_token
    this.photosApi = axios.create({
      baseURL: 'https://photoslibrary.googleapis.com/v1',
      timeout: 2000,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.access_token}`,
      },
    })
  }

  async listAlbums() {
    const res = await this.photosApi.get('/albums')
    return res.data.albums
  }

  async getAlbum(albumName) {
    const albums = await this.listAlbums()
    const metaData = albums.filter((album) => album.title === albumName)[0]

    const res = await this.photosApi.post('/mediaItems:search', {
      albumId: metaData.id,
    })
    const mediaItems = res.data.mediaItems
    return {
      ...metaData,
      mediaItems,
    }
  }
}

export default GooglePhotos
