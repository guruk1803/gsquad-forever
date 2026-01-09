import express from 'express'
import {
  getAllCelebrations,
  getCelebrationById,
  getCelebrationBySlug,
  createCelebration,
  updateCelebration,
  deleteCelebration,
} from '../controllers/celebration.controller.js'
import { authenticateAdmin } from '../middlewares/auth.middleware.js'

const router = express.Router()

// Public routes
router.get('/slug/:slug', getCelebrationBySlug)

// Admin routes
router.get('/', authenticateAdmin, getAllCelebrations)
router.get('/:id', authenticateAdmin, getCelebrationById)
router.post('/', authenticateAdmin, createCelebration)
router.put('/:id', authenticateAdmin, updateCelebration)
router.delete('/:id', authenticateAdmin, deleteCelebration)

export default router



