import { connectToDB } from '@/lib/db'
import Segment from '@/lib/models/Segment'

export async function POST(req: Request) {
  await connectToDB()
  const { rules, logic, audienceSize } = await req.json()

  const segment = await Segment.create({
    name: 'Segment #' + Date.now(),
    rules,
    logic,
    audienceSize
  })

  return Response.json({ id: segment._id })
}