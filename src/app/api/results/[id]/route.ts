
import { getResult } from '@/lib/store';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const jobId = params.id;
  if (!jobId) {
    return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
  }

  try {
    const result = await getResult(jobId);
    if (!result) {
      // Still processing or job doesn't exist yet
      return NextResponse.json({ status: 'processing' });
    }
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
