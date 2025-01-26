import express from 'express'
import { createController } from '~/controllers/vehicle.controllers'
import { businessAuthenticationValidator, authenticationValidator } from '~/middlewares/authentication.middlewares'
const router = express.Router()
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import fse from 'fs-extra'
import User from '~/models/schemas/users.schemas'
import { createValidator } from '~/middlewares/vehicle.middlewares'
import { Console } from 'console'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const user = req.user as User
    const destinationPath = `public/images/upload/vehicle/${user._id}`

    fse.access(destinationPath, fse.constants.F_OK, (err) => {
      if (err) {
        fs.promises
          .mkdir(destinationPath, { recursive: true })
          .then(() => cb(null, destinationPath))
          .catch((mkdirErr) => cb(mkdirErr, ''))
      } else {
        cb(null, destinationPath)
      }
    })
  },
  filename: (req, file, cb) => {
    const uniquSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.originalname + '-' + uniquSuffix + path.extname(file.originalname))
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
    // tối đa mỗi file không quá 5MB
    fileSize: 1024 * 1024 * 5,
    // tối đa mỗi lần upload không quá 30 file
    files: 30
  }
})

// ERROR: Chưa tải file lên được
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
 *    license_plate: string
 * },
 * files: {
 *    preview: [Files]
 * }
 */
router.post(
  '/create',
  authenticationValidator,
  businessAuthenticationValidator,
  createValidator,
  upload.array('preview', 30),
  createController
)

export default router
