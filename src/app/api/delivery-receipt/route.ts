import { connectToDB } from '@/lib/db'
import CommunicationLog from '@/lib/models/CommunicationLog'

export async function POST(req: Request) {
  await connectToDB()
  const { campaignId, customerId, customerName, status } = await req.json()

  // Update based on customerId if provided, else fallback to customerName
  const query = customerId ? { campaignId, customerId } : { campaignId, customerName }

  CommunicationLog.findOneAndUpdate(query, { status }, { new: true }).catch(err => {
    console.error('Error updating communication log status:', err)
  })

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}
