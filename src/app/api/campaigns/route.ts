import { connectToDB } from '@/lib/db'
import Campaign from '@/lib/models/Campaign'
import CommunicationLog from '@/lib/models/CommunicationLog'

export async function POST(req: Request) {
  await connectToDB()
  const { rules, logic, audienceSize } = await req.json()

  const audience = audienceSize ?? Math.floor(Math.random() * 2000)
  const sent = Math.floor(audience * 0.9)
  const failed = audience - sent
  const campaignName = 'Campaign #' + Date.now()

  const campaign = await Campaign.create({
    name: campaignName,
    rules,
    logic,
    audience,
    sent,
    failed,
  })

  const logs = []

  for (let i = 0; i < audience; i++) {
    const isSent = Math.random() < 0.9
    const customerName = `User${i + 1}`
    const status = isSent ? 'SENT' : 'FAILED'
    const message = `Hi ${customerName}, here’s 10% off on your next order!`

    logs.push({
      campaignId: campaign._id,
      campaignName,
      customerName,
      message,
      status,
      timestamp: new Date(),
    })

    // Fire-and-forget delivery receipt POST
    fetch('http://localhost:3000/api/delivery-receipt', {
      method: 'POST',
      body: JSON.stringify({
        campaignId: campaign._id,
        customerName,
        status,
      }),
      headers: { 'Content-Type': 'application/json' },
    }).catch(console.error)
  }

  await CommunicationLog.insertMany(logs)

  return new Response(
    JSON.stringify({ success: true, campaignId: campaign._id }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}

// GET campaigns sorted by newest
export async function GET() {
  await connectToDB()
  const campaigns = await Campaign.find().sort({ createdAt: -1 })
  return new Response(
    JSON.stringify(campaigns),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}
