/**
 * Calculation utilities.
 * All values are in INR unless specified. Percentages are numeric (not strings).
 */

export function computeHoldingMetrics(h) {
  // value = quantity * currentPrice
  const value = round2(h.quantity * h.currentPrice)
  // invested = quantity * avgPrice
  const invested = round2(h.quantity * h.avgPrice)
  // gain/loss = value - invested
  const gainLoss = round2(value - invested)
  // gain/loss percent relative to invested
  const gainLossPercent = invested === 0 ? 0 : round2((gainLoss / invested) * 100)
  return { ...h, value, gainLoss, gainLossPercent }
}

export function allocationObjects(holdings) {
  // Group by sector and marketCap, output keyed objects with { value, percentage }
  const enriched = holdings.map(computeHoldingMetrics)
  const total = Math.max(
    1,
    enriched.reduce((s, x) => s + x.value, 0),
  )

  const sector = {}
  const cap = {}

  for (const h of enriched) {
    sector[h.sector] = (sector[h.sector] || 0) + h.value
    cap[h.marketCap] = (cap[h.marketCap] || 0) + h.value
  }

  const bySector = {}
  Object.entries(sector).forEach(([k, v]) => {
    bySector[k] = { value: round2(v), percentage: round1((v / total) * 100) }
  })

  const byMarketCap = {}
  Object.entries(cap).forEach(([k, v]) => {
    byMarketCap[k] = { value: round2(v), percentage: round1((v / total) * 100) }
  })

  return { bySector, byMarketCap }
}

export function computeSummary(holdings) {
  const enriched = holdings.map(computeHoldingMetrics)
  const totalValue = round2(enriched.reduce((s, x) => s + x.value, 0))
  const totalInvested = round2(enriched.reduce((s, x) => s + x.quantity * x.avgPrice, 0))
  const totalGainLoss = round2(totalValue - totalInvested)
  const totalGainLossPercent = totalInvested === 0 ? 0 : round2((totalGainLoss / totalInvested) * 100)

  // Top and worst performers by gainLossPercent
  const sorted = [...enriched].sort((a, b) => b.gainLossPercent - a.gainLossPercent)
  const top = sorted[0]
  const worst = sorted[sorted.length - 1]

  // Diversification score (0-10): number of distinct sectors normalized (cap at 8 sectors)
  const sectors = new Set(enriched.map((h) => h.sector)).size
  const diversificationScore = round1(Math.min(10, (sectors / 8) * 10))

  // Risk level: based on small-cap percentage
  const { byMarketCap } = allocationObjects(holdings)
  const smallPct = byMarketCap.Small?.percentage || 0
  const riskLevel = smallPct > 50 ? "High" : smallPct > 25 ? "Moderate" : "Low"

  return {
    totalValue,
    totalInvested,
    totalGainLoss,
    totalGainLossPercent,
    topPerformer: top ? { symbol: top.symbol, name: top.name, gainPercent: top.gainLossPercent } : null,
    worstPerformer: worst ? { symbol: worst.symbol, name: worst.name, gainPercent: worst.gainLossPercent } : null,
    diversificationScore,
    riskLevel,
    holdingsCount: holdings.length,
  }
}

/**
 * Performance comparison — assignment-compliant sample series.
 * Returns EXACT 3-point timeline and 1m/3m/1y returns as per brief.
 */
export function samplePerformance(_holdings) {
  const timeline = [
    { date: "2024-01-01", portfolio: 650000, nifty50: 21000, gold: 62000 },
    { date: "2024-03-01", portfolio: 680000, nifty50: 22100, gold: 64500 },
    { date: "2024-06-01", portfolio: 700000, nifty50: 23500, gold: 68000 },
  ]

  const returns = {
    portfolio: { "1month": 2.3, "3months": 8.1, "1year": 15.7 },
    nifty50: { "1month": 1.8, "3months": 6.2, "1year": 12.4 },
    gold: { "1month": -0.5, "3months": 4.1, "1year": 8.9 },
  }

  return { timeline, returns }
}

function round2(n) {
  return Math.round(n * 100) / 100
}

function round1(n) {
  return Math.round(n * 10) / 10
}
