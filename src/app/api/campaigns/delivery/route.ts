import { NextResponse } from 'next/server';
import { DeliveryLog } from '@/lib/types';

// Mock delivery logs storage
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let deliveryLogs: DeliveryLog[] = [];
let batchQueue: DeliveryLog[] = [];
const BATCH_SIZE = 100;
let batchTimeout: NodeJS.Timeout | null = null;

function processBatch() {
  if (batchQueue.length > 0) {
    // In a real application, this would be a database transaction
    deliveryLogs.push(...batchQueue);
    
    // Update campaign stats
    const campaignStats = new Map<string, { sent: number; failed: number }>();
    
    batchQueue.forEach(log => {
      const stats = campaignStats.get(log.campaignId) || { sent: 0, failed: 0 };
      if (log.status === 'SENT') {
        stats.sent++;
      } else {
        stats.failed++;
      }
      campaignStats.set(log.campaignId, stats);
    });
    
    // Clear the batch queue
    batchQueue = [];
    
    // Clear the timeout
    if (batchTimeout) {
      clearTimeout(batchTimeout);
      batchTimeout = null;
    }
  }
}

export async function POST(request: Request) {
  try {
    const deliveryUpdate = await request.json();
    
    // Validate the delivery update
    if (!deliveryUpdate.campaignId || !deliveryUpdate.customerId || !deliveryUpdate.status) {
      return NextResponse.json(
        { error: 'Invalid delivery update format' },
        { status: 400 }
      );
    }
    
    // Create a delivery log entry
    const log: DeliveryLog = {
      id: crypto.randomUUID(),
      campaignId: deliveryUpdate.campaignId,
      customerId: deliveryUpdate.customerId,
      status: deliveryUpdate.status,
      timestamp: new Date(),
    };
    
    // Add to batch queue
    batchQueue.push(log);
    
    // Process batch if size threshold is reached
    if (batchQueue.length >= BATCH_SIZE) {
      processBatch();
    } else if (!batchTimeout) {
      // Set a timeout to process partial batch
      batchTimeout = setTimeout(processBatch, 5000);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing delivery update:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');
    
    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }
    
    const logs = deliveryLogs.filter(log => log.campaignId === campaignId);
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching delivery logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 