import express from 'express'
import {
  getAllWishes,
  getWishesByCelebration,
  createWish,
  approveWish,
  deleteWish,
} from '../controllers/wish.controller.js'
import { authenticateAdmin } from '../middlewares/auth.middleware.js'

const router = express.Router()

// Public routes
router.get('/celebration/:celebrationId', getWishesByCelebration)
router.post('/', createWish)

// Admin routes
router.get('/', authenticateAdmin, getAllWishes)
router.patch('/:id/approve', authenticateAdmin, approveWish)
router.delete('/:id', authenticateAdmin, deleteWish)

export default router



