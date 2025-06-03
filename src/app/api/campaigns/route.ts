import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/db'
import { Campaign, Customer, CommunicationLog } from '@/lib/models'
import { Document, Types } from 'mongoose'

interface CampaignDocument extends Document {
  _id: Types.ObjectId
  name: string
  segmentId: {
    _id: Types.ObjectId
    name: string
  } | null
  messageTemplate: string
  audienceSize: number
  status: string
  createdAt: Date
}

interface CustomerDocument extends Document {
  _id: Types.ObjectId
  name: string
}

export async function GET() {
  try {
    await connectToDB()
    const campaigns = await Campaign.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'segmentId',
        select: '_id name',
        model: 'Segment'
      })
      .lean()

    // Transform the data to match the frontend interface
    // @ts-ignore
    const transformedCampaigns = campaigns.map((campaign: CampaignDocument) => ({
      _id: campaign._id.toString(),
      name: campaign.name,
      segmentId: campaign.segmentId ? {
        _id: campaign.segmentId._id.toString(),
        name: campaign.segmentId.name
      } : null,
      messageTemplate: campaign.messageTemplate,
      audienceSize: campaign.audienceSize,
      status: campaign.status,
      createdAt: campaign.createdAt
    }))

    return NextResponse.json(transformedCampaigns)
  } catch (error) {
    console.error('Failed to fetch campaigns:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectToDB()
    const body = await request.json()
    const { name, segmentId, messageTemplate, audienceSize } = body

    // Create campaign
    const campaign = await Campaign.create({
      name,
      segmentId,
      messageTemplate,
      audienceSize,
      status: 'PENDING'
    })

    // Get customers in the segment
    const customers = await Customer.find({ segmentId })

    // Send messages to each customer
    const messagePromises = customers.map(async (customer: CustomerDocument) => {
      const personalizedMessage = messageTemplate.replace('{name}', customer.name)
      
      try {
        // Send to vendor API
        const vendorResponse = await fetch('https://xeno-crm-peach.vercel.app/api/vendor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerId: customer._id,
            message: personalizedMessage
          })
        })

        // Log the communication attempt
        await CommunicationLog.create({
          campaignId: campaign._id,
          customerId: customer._id,
          message: personalizedMessage,
          status: vendorResponse.ok ? 'SENT' : 'FAILED'
        })
      } // eslint-disable-next-line @typescript-eslint/no-unused-vars
      catch (error) {
        // Log failed delivery
        await CommunicationLog.create({
          campaignId: campaign._id,
          customerId: customer._id,
          message: personalizedMessage,
          status: 'FAILED'
        })
      }
    })

    // Wait for all messages to be sent
    await Promise.all(messagePromises)

    // Update campaign status
    const successCount = await CommunicationLog.countDocuments({
      campaignId: campaign._id,
      status: 'SENT'
    })

    const status = successCount === customers.length ? 'COMPLETED' : 'FAILED'
    await Campaign.findByIdAndUpdate(campaign._id, { status })

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Failed to create campaign:', error)
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    )
  }
}
