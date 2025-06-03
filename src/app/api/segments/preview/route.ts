import { connectToDB } from '@/lib/db'


export async function POST(req: Request) {
  await connectToDB()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { rules, logic } = await req.json()
  const size = Math.floor(Math.random() * 2000)

  return Response.json({ size })
}