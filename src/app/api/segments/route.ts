import { connectToDB } from '@/lib/db'
import Campaign from '@/lib/models/Campaign'
import CommunicationLog from '@/lib/models/CommunicationLog'
import Customer from '@/lib/models/Customer'

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

    // Find or create the customer
    let customer = await Customer.findOne({ name: customerName })
    if (!customer) {
      customer = await Customer.create({ name: customerName })
    }

    logs.push({
      campaignId: campaign._id,
      customerId: customer._id,
      message,
      status,
      timestamp: new Date(),
    })

    fetch('http://localhost:3000/api/delivery-receipt', {
      method: 'POST',
      body: JSON.stringify({
        campaignId: campaign._id,
        customerId: customer._id,
        status,
      }),
      headers: { 'Content-Type': 'application/json' },
    }).catch(console.error)
  }

  await CommunicationLog.insertMany(logs)

  return Response.json({ success: true, campaignId: campaign._id })
}
