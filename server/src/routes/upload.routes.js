import express from 'express'
import { uploadImage } from '../controllers/upload.controller.js'
import { authenticateAdmin } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/image', authenticateAdmin, uploadImage)

export default router


