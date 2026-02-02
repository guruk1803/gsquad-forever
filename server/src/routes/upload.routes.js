import express from 'express'
import { uploadImage, uploadVideo } from '../controllers/upload.controller.js'
import { authenticateAdmin } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/image', authenticateAdmin, uploadImage)
router.post('/video', authenticateAdmin, uploadVideo)

export default router



