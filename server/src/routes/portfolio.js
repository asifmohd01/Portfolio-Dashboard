import { Router } from 'express'
import { authRequired } from '../middleware/auth.js'
import {
  getHoldings,
  getAllocation,
  getPerformance,
  getSummary,
  uploadHoldings,
} from '../controllers/portfolio.controller.js'
import multer from 'multer'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } }) // 2MB

router.use(authRequired)
router.get('/holdings', getHoldings)
router.get('/allocation', getAllocation)
router.get('/performance', getPerformance)
router.get('/summary', getSummary)
router.post('/upload', upload.single('file'), uploadHoldings)

export default router
