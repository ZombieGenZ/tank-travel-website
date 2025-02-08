import express from 'express'
import multer from 'multer'
import path from 'path'
import {
  setNotificationGlobalController,
  removeNotificationGlobalController,
  getNotificationGlobalController
} from '~/controllers/notification-global.controllers'
import { administratorAuthenticationValidator, authenticationValidator } from '~/middlewares/authentication.middlewares'
import {
  authenticateNotificationGlobalValidator,
  permissionValidator,
  setNotificationGlobalValidator,
  setupNotificationGlobal
} from '~/middlewares/notification-global.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import fse from 'fs-extra'

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'public/images/upload/notification/temporary'

    fse
      .ensureDir(uploadPath)
      .then(() => {
        cb(null, uploadPath)
      })
      .catch((err) => {
        cb(err, uploadPath)
      })
  },
  filename: (req, file, cb) => {
    const fileName = path.basename(file.originalname, path.extname(file.originalname))
    const fileExt = path.extname(file.originalname)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `${fileName}-${uniqueSuffix}${fileExt}`)
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true)
    } else {
      cb(null, false)
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 10,
    files: 50
  }
})

/*
 * Description: Tạo thông báo mới
 * Path: /api/notification-global/set-notification
 * Method: PUT
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    title: string,
 *    description: string,
 *    image: file
 * }
 */
router.put(
  '/set-notification',
  upload.array('image', 50),
  authenticateNotificationGlobalValidator,
  permissionValidator,
  setNotificationGlobalValidator,
  setupNotificationGlobal,
  wrapRequestHandler(setNotificationGlobalController)
)

/*
 * Description: Xóa thông báo
 * Path: /api/notification-global/remove-notification
 * Method: DELETE
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string
 * }
 */
router.delete(
  '/remove-notification',
  authenticationValidator,
  administratorAuthenticationValidator,
  wrapRequestHandler(removeNotificationGlobalController)
)

/*
 * Description: Tạo thông báo mới
 * Path: /api/notification-global/get-notification
 * Method: GET
 */
router.get('/get-notification', wrapRequestHandler(getNotificationGlobalController))

export default router
