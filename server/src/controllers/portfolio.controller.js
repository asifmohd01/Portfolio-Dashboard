import Holding from '../models/Holding.js'
import {
  computeHoldingMetrics,
  allocationObjects,
  samplePerformance,
  computeSummary,
} from '../utils/calc.js'
import { parse } from 'csv-parse/sync'

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

/**
 * Upload holdings from CSV.
 * Accepts multipart/form-data with "file" field and optional "mode" field: "merge" (default) or "replace".
 * CSV columns (header required):
 * symbol,name,quantity,avgPrice,currentPrice,sector,marketCap
 */
export async function uploadHoldings(req, res, next) {
  try {
    if (!req.file?.buffer)
      return res.status(400).json({ error: "CSV file is required (field 'file')" })

    const csvText = req.file.buffer.toString('utf-8')
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    const allowedCaps = new Set(['Large', 'Mid', 'Small'])
    const errors = []
    const docs = []

    for (let i = 0; i < records.length; i++) {
      const row = records[i]
      const ctx = `row ${i + 1}`
      const symbol = (row.symbol || '').toString().trim().toUpperCase()
      const name = (row.name || '').toString().trim()
      const sector = (row.sector || '').toString().trim()
      const marketCap = (row.marketCap || '').toString().trim()

      const quantity = Number(row.quantity)
      const avgPrice = Number(row.avgPrice)
      const currentPrice = Number(row.currentPrice)

      if (!symbol) errors.push(`${ctx}: symbol required`)
      if (!name) errors.push(`${ctx}: name required`)
      if (!Number.isFinite(quantity) || quantity < 0) errors.push(`${ctx}: quantity must be >= 0`)
      if (!Number.isFinite(avgPrice) || avgPrice < 0) errors.push(`${ctx}: avgPrice must be >= 0`)
      if (!Number.isFinite(currentPrice) || currentPrice < 0)
        errors.push(`${ctx}: currentPrice must be >= 0`)
      if (!sector) errors.push(`${ctx}: sector required`)
      if (!allowedCaps.has(marketCap))
        errors.push(`${ctx}: marketCap must be one of Large|Mid|Small`)

      docs.push({ symbol, name, quantity, avgPrice, currentPrice, sector, marketCap })
    }

    if (errors.length)
      return res.status(400).json({ error: 'CSV validation failed', details: errors.slice(0, 25) })

    const userId = req.user.id
    const mode = (req.body.mode || 'merge').toLowerCase()

    let inserted = 0
    let updated = 0

    if (mode === 'replace') {
      await Holding.deleteMany({ userId })
      if (docs.length) {
        const result = await Holding.insertMany(docs.map((d) => ({ ...d, userId })))
        inserted = result.length
      }
    } else {
      // merge: upsert per symbol
      if (docs.length) {
        const ops = docs.map((d) => ({
          updateOne: {
            filter: { userId, symbol: d.symbol },
            update: { $set: { ...d, userId } },
            upsert: true,
          },
        }))
        const result = await Holding.bulkWrite(ops, { ordered: false })
        inserted = (result.upsertedCount || 0) + (result.insertedCount || 0)
        updated = result.modifiedCount || 0
      }
    }

    return res
      .status(200)
      .json({ message: 'Upload processed', mode, inserted, updated, rows: docs.length })
  } catch (e) {
    next(e)
  }
}
