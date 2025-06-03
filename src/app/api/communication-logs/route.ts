import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/db'
import CommunicationLog from '@/lib/models/CommunicationLog'

export async function GET() {
  try {
    await connectToDB()
    const logs = await CommunicationLog.find()
      .sort({ createdAt: -1 })
      .populate('campaignId')
      .populate('customerId')
    return NextResponse.json(logs)
  } // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDB()
    const body = await request.json()
    const { campaignId, customerId, message, status } = body

    const log = await CommunicationLog.create({
      campaignId,
      customerId,
      message,
      status
    })

    return NextResponse.json(log)
  } // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch (error) {
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 })
  }
}