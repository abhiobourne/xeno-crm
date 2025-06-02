// File: /app/api/logs/route.ts
import { connectToDB } from '@/lib/db'
import CommunicationLog from '@/lib/models/CommunicationLog'
import Campaign from '@/lib/models/Campaign'
import Customer from '@/lib/models/Customer'

export async function GET() {
  await connectToDB()

  const logs = await CommunicationLog.find({})
    .populate('campaignId', 'name')      // populates campaignId -> campaign name
    .populate('customerId', 'name')      // populates customerId -> customer name
    .lean()

  const formattedLogs = logs.map(log => ({
    _id: log._id,
    message: log.message,
    status: log.status,
    timestamp: log.timestamp,
    campaignName: log.campaignId?.name || 'N/A',
    customerName: log.customerId?.name || 'N/A'
  }))

  return Response.json(formattedLogs)
}
