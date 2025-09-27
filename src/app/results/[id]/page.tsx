
"use client";

import { ResultsDisplay } from "@/components/results/results-display";
import { PageShell } from '@/components/common/page-shell';
import { Result } from "@/lib/store";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function ResultPage({ params }: { params: { id: string } }) {
    const { id: jobId } = params;
    const router = useRouter();
    const [result, setResult] = useState<Result | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

    useEffect(() => {
        if (!jobId) return;

        const pollResult = async () => {
            try {
                const response = await fetch(`/api/results/${jobId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch results.');
                }
                const data: Result | { status: string, error?: string } = await response.json();
                
                if (data.status === 'error' && 'error' in data) {
                    throw new Error(data.error);
                }

                if (data.status === 'success' || data.status === 'error') {
                    setResult(data as Result);
                    setIsLoading(false);
                    if (data.status === 'error') {
                        setError(data.error || 'An unknown error occurred during generation.');
                    }
                    // Stop polling
                    return; 
                }

                // If still processing, poll again after a delay
                setTimeout(pollResult, 5000);
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
                setError(errorMessage);
                setIsLoading(false);
            }
        };

        pollResult();

    }, [jobId]);

    useEffect(() => {
        if (isLoading && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isLoading, timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    if (isLoading) {
        return (
            <PageShell>
                <div className="container py-16 lg:py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader className="h-12 w-12 animate-spin text-primary" />
                        <h1 className="text-3xl font-bold">Generation in Progress...</h1>
                        <p className="text-muted-foreground max-w-md">
                            Your video is being created. This can take several minutes. Please keep this page open.
                        </p>
                        <div className="mt-4">
                            <p className="text-2xl font-mono font-bold text-accent">
                                {formatTime(timeLeft)}
                            </p>
                            <p className="text-sm text-muted-foreground">Time Remaining</p>
                        </div>
                        <div className="mt-6">
                             <Link href="https://airtable.com/appSMvzeRgjiPtu8u/shrsx3ElFqEYN2lOi" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline">
                                    Check Generation Status on Airtable
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </Button>
                             </Link>
                             <p className="text-xs text-muted-foreground mt-2">Here is your Generation, it will appear here once ready.</p>
                        </div>
                    </div>
                </div>
            </PageShell>
        );
    }
    
    if (error) {
        return (
             <PageShell>
                <div className="container py-16 lg:py-24">
                    <Alert variant="destructive">
                        <AlertTitle>Generation Failed</AlertTitle>
                        <AlertDescription>
                            <p>{error}</p>
                            <Button onClick={() => router.push('/')} variant="link" className="pl-0">Go back and try again</Button>
                        </AlertDescription>
                    </Alert>
                </div>
            </PageShell>
        );
    }


    return (
        <PageShell>
            <div className="container py-16 lg:py-24">
                <ResultsDisplay resultData={result?.data} />
            </div>
        </PageShell>
    );
}
