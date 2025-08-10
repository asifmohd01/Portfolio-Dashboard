import Holding from "../models/Holding.js"
import { computeHoldingMetrics, allocationObjects, samplePerformance, computeSummary } from "../utils/calc.js"

export async function getHoldings(req, res, next) {
  try {
    const holdings = await Holding.find({ userId: req.user.id }).lean()
    return res.json(holdings.map(computeHoldingMetrics))
  } catch (e) {
    next(e)
  }
}

export async function getAllocation(req, res, next) {
  try {
    const holdings = await Holding.find({ userId: req.user.id }).lean()
    return res.json(allocationObjects(holdings))
  } catch (e) {
    next(e)
  }
}

export async function getPerformance(req, res, next) {
  try {
    const holdings = await Holding.find({ userId: req.user.id }).lean()
    return res.json(samplePerformance(holdings))
  } catch (e) {
    next(e)
  }
}

export async function getSummary(req, res, next) {
  try {
    const holdings = await Holding.find({ userId: req.user.id }).lean()
    return res.json(computeSummary(holdings))
  } catch (e) {
    next(e)
  }
}
