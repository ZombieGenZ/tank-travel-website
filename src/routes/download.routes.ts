import express from 'express'
import { downloadAppController } from '~/controllers/download.controllers'
const router = express.Router()

/*
 * Description: Tải phần mềm quản lý danh cho doanh nghiệp và quản trị viên
 * Path: /download/app
 * Method: GET
 */
router.get('/app', downloadAppController)

export default router
