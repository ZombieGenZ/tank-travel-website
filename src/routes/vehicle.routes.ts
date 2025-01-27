import express from 'express'
import { createController, deleteController } from '~/controllers/vehicle.controllers'
const router = express.Router()
import multer from 'multer'
import path from 'path'
import {
  authenticateCreateValidator,
  permissionValidator,
  createValidator,
  setupCreateImage,
  deleteValidator
} from '~/middlewares/vehicle.middlewares'
import { authenticationValidator, businessAuthenticationValidator } from '~/middlewares/authentication.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `public/images/upload/vehicle/temporary`)
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
    fileSize: 1024 * 1024 * 5,
    files: 30
  }
})

/*
 * Description: Tạo một phương tiện mới
 * Path: /api/vehicle/create
 * Method: POST
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    vehicle_type: number,
 *    seat_type: number,
 *    seats: number,
 *    rules: string,
 *    amenities: string,
 *    license_plate: string,
 *    preview: [Files]
 * }
 */
router.post(
  '/create',
  upload.array('preview', 30),
  authenticateCreateValidator,
  permissionValidator,
  createValidator,
  setupCreateImage,
  createController
)

/*
 * Description: Xóa một phương tiện đã có trên CSDL
 * Path: /api/vehicle/delete
 * Method: DELETE
 * headers: {
 *    authorization: Bearer <token>
 * },
 * Body: {
 *    refresh_token: string,
 *    vehicle_id: string,
 * }
 */
router.delete(
  '/delete',
  authenticationValidator,
  businessAuthenticationValidator,
  deleteValidator,
  wrapRequestHandler(deleteController)
)

export default router
