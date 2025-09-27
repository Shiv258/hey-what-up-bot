
import { NextResponse } from 'next/server';
import { updateResult } from '@/lib/store';

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
        return NextResponse.json({ message: 'Error: jobId query parameter is required.' }, { status: 400 });
    }

    try {
        const resultData = await request.json();
        
        await updateResult(jobId, {
            status: 'success',
            data: resultData
        });

        return NextResponse.json({ message: `Successfully updated result for job ${jobId}` });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        
        // Update the job with an error status if something goes wrong
        await updateResult(jobId, {
            status: 'error',
            error: `Webhook processing failed: ${errorMessage}`
        });

        return NextResponse.json({ message: 'Error processing webhook data.', error: errorMessage }, { status: 500 });
    }
}
