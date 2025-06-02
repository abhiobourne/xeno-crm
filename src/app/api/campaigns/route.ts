import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/db'
import Campaign from '@/lib/models/Campaign'
import Customer from '@/lib/models/Customer'
import CommunicationLog from '@/lib/models/CommunicationLog'

export async function GET() {
  try {
    await connectToDB()
    const campaigns = await Campaign.find().sort({ createdAt: -1 })
    return NextResponse.json(campaigns)
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDB()
    const { name, rules, logic, message } = await req.json()

    const audience = await Customer.find({ totalSpend: { $gt: 10000 } })

    const campaign = await Campaign.create({
      name,
      rules,
      logic,
      audience: audience.length,
      sent: 0,
      failed: 0
    })

    for (const customer of audience) {
      const personalized = `Hi ${customer.name}, ${message}`
      const log = await CommunicationLog.create({
        campaignId: campaign._id,
        customerId: customer._id,
        status: 'PENDING',
        message: personalized
      })

      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logId: log._id,
          customerName: customer.name,
          message: personalized
        })
      })
    }

    return NextResponse.json({ success: true, campaignId: campaign._id })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
