import express from 'express'
import { createController } from '~/controllers/vehicle.controllers'
import { businessAuthenticationValidator, authenticationValidator } from '~/middlewares/authentication.middlewares'
const router = express.Router()
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import fse from 'fs-extra'
import User from '~/models/schemas/users.schemas'
import {
  authenticateCreateValidator,
  permissionValidator,
  createValidator,
  setupCreateImage
} from '~/middlewares/vehicle.middlewares'

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

// ERROR: Chưa xử lý được trường hợp upload file
/*
 * Description: Tạo yêu cầu kiểu duyệt phương tiện
 * Path: /api/vehicle/create
 * Method: POST
 * headers: {
 *    Authorization: Bearer <token>
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
// router.post(
//   '/create',
//   formDataParser,
//   authenticationValidator,
//   businessAuthenticationValidator,
//   createValidator,
//   fileValidator,
//   createController
// )

export default router
