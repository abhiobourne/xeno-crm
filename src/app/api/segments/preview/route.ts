import { connectToDB } from '@/lib/db'
import Campaign from '@/lib/models/Campaign'

export async function POST(req: Request) {
  await connectToDB()

  const { rules, logic } = await req.json()
  const size = Math.floor(Math.random() * 2000)

  const campaign = await Campaign.create({
    name: 'Campaign #' + Date.now(),
    rules: JSON.stringify(rules),
    logic,
    audience: size,
    sent: Math.floor(size * 0.9),
    failed: size - Math.floor(size * 0.9),
    createdAt: new Date(),
  })

  return Response.json({ success: true, campaign })
}
