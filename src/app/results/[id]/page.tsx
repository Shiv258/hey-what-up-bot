

import { ResultsDisplay } from "@/components/results/results-display";
import { PageShell } from '@/components/common/page-shell';
import { Result } from "@/lib/supabase-store";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader, Clock, Video, Image, Mic, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const GENERATION_STAGES = [
  { id: 'prompting', name: 'Prompting', icon: Clock, duration: 7 },
  { id: 'image_generation', name: 'Image Generation', icon: Image, duration: 12 },
  { id: 'video_generation', name: 'Video Generation', icon: Video, duration: 15 },
  { id: 'lipsync_creation', name: 'Lip Sync Creation', icon: Mic, duration: 8 },
  { id: 'managing', name: 'Managing', icon: CheckCircle, duration: 3 }
];

export default function ResultPage({ params }: { params: { id: string } }) {
    const { id: jobId } = params;
    const navigate = useNavigate();
    const [result, setResult] = useState<Result | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentStage, setCurrentStage] = useState(0);
    const [progress, setProgress] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);

    useEffect(() => {
        if (!jobId) return;

        const pollResult = async () => {
            try {
                const response = await fetch(`https://ojffuyzursflvqojuuql.supabase.co/functions/v1/get-job-status/${jobId}`);
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
                    setProgress(100);
                    setCurrentStage(GENERATION_STAGES.length - 1);
                    if (data.status === 'error') {
                        setError(data.error || 'An unknown error occurred during generation.');
                    }
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

    // Progress simulation effect
    useEffect(() => {
        if (!isLoading) return;

        const interval = setInterval(() => {
            setTimeElapsed(prev => prev + 1);
            
            // Calculate progress based on realistic timings
            const totalDuration = GENERATION_STAGES.reduce((sum, stage) => sum + stage.duration, 0) * 60; // Convert to seconds
            let elapsed = 0;
            let currentProgress = 0;
            let activeStage = 0;

            for (let i = 0; i < GENERATION_STAGES.length; i++) {
                const stageDuration = GENERATION_STAGES[i].duration * 60;
                if (timeElapsed >= elapsed && timeElapsed < elapsed + stageDuration) {
                    activeStage = i;
                    const stageProgress = (timeElapsed - elapsed) / stageDuration;
                    currentProgress = ((elapsed + (stageProgress * stageDuration)) / totalDuration) * 100;
                    break;
                }
                elapsed += stageDuration;
            }

            setCurrentStage(activeStage);
            setProgress(Math.min(currentProgress, 95)); // Cap at 95% until completion
        }, 1000);

        return () => clearInterval(interval);
    }, [isLoading, timeElapsed]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const estimatedTotal = GENERATION_STAGES.reduce((sum, stage) => sum + stage.duration, 0) * 60;
    const timeRemaining = Math.max(0, estimatedTotal - timeElapsed);

    if (isLoading) {
        return (
            <PageShell>
                <div className="min-h-screen bg-background">
                    <div className="container py-16 lg:py-24">
                        <div className="max-w-2xl mx-auto text-center space-y-8">
                            {/* Header */}
                            <div className="space-y-4">
                                <div className="relative">
                                    <Loader className="h-16 w-16 animate-spin text-primary mx-auto" />
                                </div>
                                <h1 className="text-4xl font-bold tracking-tight">Generation in Progress...</h1>
                                <p className="text-lg text-muted-foreground">
                                    Your request has been taken and we're creating your video. This can take several minutes.
                                </p>
                                <Badge variant="secondary" className="text-sm font-mono">
                                    Job ID: {jobId}
                                </Badge>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-4">
                                <Progress value={progress} className="h-3" />
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>{Math.round(progress)}% Complete</span>
                                    <span>{formatTime(timeRemaining)} remaining</span>
                                </div>
                            </div>

                            {/* Current Stage */}
                            <div className="bg-card border rounded-lg p-6 space-y-4">
                            <div className="flex items-center justify-center gap-3">
                                {(() => {
                                    const IconComponent = GENERATION_STAGES[currentStage]?.icon || Clock;
                                    return <IconComponent className="h-6 w-6 text-primary" />;
                                })()}
                                <span className="text-xl font-semibold">
                                    {GENERATION_STAGES[currentStage]?.name || 'Processing'}
                                </span>
                            </div>
                                <p className="text-muted-foreground">
                                    Please keep this page open while we process your video.
                                </p>
                            </div>

                            {/* Stage Timeline */}
                            <div className="grid grid-cols-5 gap-2">
                                {GENERATION_STAGES.map((stage, index) => {
                                    const StageIcon = stage.icon;
                                    const isActive = index === currentStage;
                                    const isCompleted = index < currentStage;
                                    
                                    return (
                                        <div 
                                            key={stage.id}
                                            className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                                                isActive 
                                                    ? 'bg-primary/10 border-primary text-primary' 
                                                    : isCompleted 
                                                        ? 'bg-green-500/10 border-green-500/20 text-green-600'
                                                        : 'bg-muted border-border text-muted-foreground'
                                            }`}
                                        >
                                            <StageIcon className="h-5 w-5 mb-2" />
                                            <span className="text-xs font-medium text-center leading-tight">
                                                {stage.name}
                                            </span>
                                            {isActive && (
                                                <div className="mt-1 text-xs opacity-70">
                                                    ~{stage.duration}m
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Timer Display */}
                            <div className="bg-accent/10 border border-accent/20 rounded-lg p-6">
                                <div className="text-4xl font-mono font-bold text-accent mb-2">
                                    {formatTime(timeElapsed)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Time Elapsed
                                </div>
                            </div>
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
                            <Button onClick={() => navigate('/')} variant="link" className="pl-0">Go back and try again</Button>
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
