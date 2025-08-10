import { computeHoldingMetrics, allocationObjects, computeSummary, samplePerformance } from "../src/utils/calc.js"

describe("calc utils", () => {
  const holdings = [
    { symbol: "A", name: "A", quantity: 10, avgPrice: 100, currentPrice: 120, sector: "Tech", marketCap: "Large" },
    { symbol: "B", name: "B", quantity: 5, avgPrice: 200, currentPrice: 180, sector: "Energy", marketCap: "Small" },
  ]

  test("computeHoldingMetrics", () => {
    const m = computeHoldingMetrics(holdings[0])
    expect(m.value).toBe(1200)
    expect(m.gainLoss).toBe(200)
    expect(m.gainLossPercent).toBe(20)
  })

  test("allocationObjects shapes", () => {
    const a = allocationObjects(holdings)
    expect(a).toHaveProperty("bySector")
    expect(a).toHaveProperty("byMarketCap")
    const sectors = Object.keys(a.bySector)
    expect(sectors.length).toBeGreaterThan(0)
  })

  test("computeSummary fields", () => {
    const s = computeSummary(holdings)
    expect(s).toHaveProperty("totalValue")
    expect(s).toHaveProperty("topPerformer")
    expect(s.topPerformer).toHaveProperty("gainPercent")
  })

  test("samplePerformance structure", () => {
    const p = samplePerformance(holdings)
    expect(p.timeline.length).toBe(3)
    expect(p.returns).toHaveProperty("portfolio")
    expect(p.returns.portfolio).toHaveProperty("1month")
  })
})
