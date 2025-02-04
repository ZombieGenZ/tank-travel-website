import { ImageType } from './image'

export interface NotificationType {
  user_id: string
  display_name: string
  title: string
  description: string
  images: ImageType[]
}
