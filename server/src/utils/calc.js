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
    enriched.reduce((s, x) => s + x.value, 0)
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
  const totalGainLossPercent =
    totalInvested === 0 ? 0 : round2((totalGainLoss / totalInvested) * 100)

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
  const riskLevel = smallPct > 50 ? 'High' : smallPct > 25 ? 'Moderate' : 'Low'

  return {
    totalValue,
    totalInvested,
    totalGainLoss,
    totalGainLossPercent,
    topPerformer: top
      ? { symbol: top.symbol, name: top.name, gainPercent: top.gainLossPercent }
      : null,
    worstPerformer: worst
      ? { symbol: worst.symbol, name: worst.name, gainPercent: worst.gainLossPercent }
      : null,
    diversificationScore,
    riskLevel,
  }
}

export function samplePerformance(holdings) {
  // Construct 3-point timeline based on invested->current with simple interpolation
  const enriched = holdings.map(computeHoldingMetrics)
  const totalCurrent = round2(enriched.reduce((s, x) => s + x.value, 0))
  const totalInvested = round2(enriched.reduce((s, x) => s + x.quantity * x.avgPrice, 0))

  const jan = isoDate('2024-01-01')
  const mar = isoDate('2024-03-01')
  const jun = isoDate('2024-06-01')

  const portfolioJan = Math.max(1, totalInvested)
  const portfolioJun = Math.max(portfolioJan * 1.15, totalCurrent) // approx growth

  const timeline = [
    { date: jan, portfolio: round0(portfolioJan), nifty50: 21000, gold: 62000 },
    {
      date: mar,
      portfolio: round0((portfolioJan + portfolioJun) / 2),
      nifty50: 22100,
      gold: 64500,
    },
    { date: jun, portfolio: round0(portfolioJun), nifty50: 23500, gold: 68000 },
  ]

  const returns = {
    portfolio: windowedReturns(timeline.map((t) => t.portfolio)),
    nifty50: windowedReturns(timeline.map((t) => t.nifty50)),
    gold: windowedReturns(timeline.map((t) => t.gold)),
  }

  return { timeline, returns }
}

function windowedReturns(series) {
  // Given [start, mid, end], compute 1month, 3months, 1year approximations.
  const s = series[0]
  const m = series[1]
  const e = series[2]
  return {
    '1month': round1(((e - m) / m) * 100), // approx last segment
    '3months': round1(((e - s) / s) * 100), // overall change
    '1year': round1(((e - s) / s) * 100 * 1.3), // scale to simulate 1y
  }
}

function isoDate(d) {
  return new Date(d).toISOString().slice(0, 10)
}

function round2(n) {
  return Math.round(n * 100) / 100
}

function round1(n) {
  return Math.round(n * 10) / 10
}

function round0(n) {
  return Math.round(n)
}
