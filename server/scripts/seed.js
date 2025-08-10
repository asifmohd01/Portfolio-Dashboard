import dotenv from 'dotenv'
dotenv.config()
import { connectDB } from '../src/config/db.js'
import User from '../src/models/User.js'
import Holding from '../src/models/Holding.js'
import bcrypt from 'bcryptjs'

async function seed() {
  await connectDB()
  await User.deleteMany({})
  await Holding.deleteMany({})

  const user = await User.create({
    email: 'test@example.com',
    passwordHash: await bcrypt.hash('password123', 10),
  })

  const holdings = [
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      quantity: 50,
      avgPrice: 2450,
      currentPrice: 2680.5,
      sector: 'Energy',
      marketCap: 'Large',
    },
    {
      symbol: 'INFY',
      name: 'Infosys Limited',
      quantity: 100,
      avgPrice: 1800,
      currentPrice: 2010.75,
      sector: 'Technology',
      marketCap: 'Large',
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      quantity: 40,
      avgPrice: 3550,
      currentPrice: 3925.4,
      sector: 'Technology',
      marketCap: 'Large',
    },
    {
      symbol: 'HDFC',
      name: 'HDFC Bank',
      quantity: 60,
      avgPrice: 1450,
      currentPrice: 1420.1,
      sector: 'Banking',
      marketCap: 'Large',
    },
    {
      symbol: 'DMART',
      name: 'Avenue Supermarts',
      quantity: 15,
      avgPrice: 3400,
      currentPrice: 3602,
      sector: 'Consumer',
      marketCap: 'Large',
    },
    {
      symbol: 'LTIM',
      name: 'LTIMindtree',
      quantity: 20,
      avgPrice: 5300,
      currentPrice: 5101,
      sector: 'Technology',
      marketCap: 'Mid',
    },
    {
      symbol: 'TATAMOTORS',
      name: 'Tata Motors',
      quantity: 80,
      avgPrice: 650,
      currentPrice: 985.2,
      sector: 'Auto',
      marketCap: 'Mid',
    },
    {
      symbol: 'DIVISLAB',
      name: "Divi's Laboratories",
      quantity: 10,
      avgPrice: 3550,
      currentPrice: 3800,
      sector: 'Healthcare',
      marketCap: 'Large',
    },
    {
      symbol: 'APOLLOHOSP',
      name: 'Apollo Hospitals',
      quantity: 8,
      avgPrice: 4800,
      currentPrice: 5100,
      sector: 'Healthcare',
      marketCap: 'Large',
    },
    {
      symbol: 'PBFINTECH',
      name: 'PB Fintech',
      quantity: 25,
      avgPrice: 620,
      currentPrice: 455,
      sector: 'Financials',
      marketCap: 'Small',
    },
  ]

  await Holding.insertMany(holdings.map((h) => ({ userId: user._id, ...h })))

  console.log('Seed complete. Demo user:', user.email)
  process.exit(0)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
