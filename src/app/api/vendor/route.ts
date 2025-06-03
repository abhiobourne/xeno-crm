import { NextResponse } from 'next/server'

// Simulate vendor API with ~90% success rate
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customerId, message } = body

    // Simulate random success/failure
    const isSuccess = Math.random() < 0.9

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    if (!isSuccess) {
      return NextResponse.json({ 
        success: false, 
        error: 'Delivery failed' 
      }, { status: 500 })
    }

    // Send delivery receipt to our backend
    await fetch('http://localhost:3000/api/communication-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId,
        message,
        status: 'SENT',
        timestamp: new Date()
      })
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Message delivered successfully' 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}