import { connectToDB } from '@/lib/db'
import Segment from '@/lib/models/Segment'

export async function POST(req: Request) {
  await connectToDB()

  const { rules, logic } = await req.json()
  const size = Math.floor(Math.random() * 2000)

  return Response.json({ size })
}