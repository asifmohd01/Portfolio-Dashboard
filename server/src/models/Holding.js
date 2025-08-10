import mongoose from 'mongoose'

const holdingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    avgPrice: { type: Number, required: true, min: 0 },
    currentPrice: { type: Number, required: true, min: 0 },
    sector: { type: String, required: true },
    marketCap: { type: String, enum: ['Large', 'Mid', 'Small'], required: true },
  },
  { timestamps: true }
)

export default mongoose.model('Holding', holdingSchema)
