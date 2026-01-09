import express from 'express'
import { login, getMe } from '../controllers/admin.controller.js'
import { authenticateAdmin } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/login', login)
router.get('/me', authenticateAdmin, getMe)

export default router



