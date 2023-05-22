import {Request} from './request'
export const uploadImage = (data: any) => {
  return Request.post('/api/v1/upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer 221\|MPFXAeVbXOlm0fefUHJY13ktVsBCaiU6qEOApK6t'
    }
  })
}