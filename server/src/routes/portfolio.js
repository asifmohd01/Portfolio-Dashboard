import { Router } from 'express'
import { authRequired } from '../middleware/auth.js'
import {
  getHoldings,
  getAllocation,
  getPerformance,
  getSummary,
} from '../controllers/portfolio.controller.js'

const router = Router()
router.use(authRequired)
router.get('/holdings', getHoldings)
router.get('/allocation', getAllocation)
router.get('/performance', getPerformance)
router.get('/summary', getSummary)
export default router
