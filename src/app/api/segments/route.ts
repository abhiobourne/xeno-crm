import { connectToDB } from '@/lib/db'
import Campaign from '@/lib/models/Campaign'

export async function POST(req: Request) {
  await connectToDB()
  const { rules, logic, audienceSize } = await req.json()

  const audience = audienceSize ?? Math.floor(Math.random() * 2000)
  const sent = Math.floor(audience * 0.9)
  const failed = audience - sent

  const campaign = await Campaign.create({
    name: 'Campaign #' + Date.now(),
    rules,
    logic,
    audience,
    sent,
    failed,
  })

  return Response.json({ success: true, campaignId: campaign._id })
}
