import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { VideoPlayer } from './video-player';
import { Button } from '../ui/button';
import { Download, Copy, CornerDownLeft, Video, Image, Headphones } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useNavigate } from 'react-router-dom';

interface WebhookResponseData {
    broll_images?: string[];
    broll_videos?: string[];
    lipsync_images?: string[];
    lipsync_videos?: string[];
    full_audio?: string;
}

export function ResultsDisplay({ resultData }: { resultData: WebhookResponseData | null }) {
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleCopy = (url: string) => {
        navigator.clipboard.writeText(url);
        toast({ title: 'Copied!', description: 'Link copied to clipboard.' });
    };

    const handleDownloadAll = async () => {
        if (!resultData) return;
        const zip = new JSZip();
        toast({ title: 'Preparing Download', description: 'Zipping files, please wait...' });

        const downloadPromises: Promise<void>[] = [];

        // Download broll videos
        if (resultData.broll_videos) {
            resultData.broll_videos.forEach((url, index) => {
                downloadPromises.push(
                    fetch(url)
                        .then(response => response.blob())
                        .then(blob => {
                            zip.file(`broll-videos/broll-video-${index + 1}.mp4`, blob);
                        })
                        .catch(e => console.error(`Failed to download broll video ${index + 1}:`, e))
                );
            });
        }

        // Download broll images
        if (resultData.broll_images) {
            resultData.broll_images.forEach((url, index) => {
                downloadPromises.push(
                    fetch(url)
                        .then(response => response.blob())
                        .then(blob => {
                            zip.file(`broll-images/broll-image-${index + 1}.jpg`, blob);
                        })
                        .catch(e => console.error(`Failed to download broll image ${index + 1}:`, e))
                );
            });
        }

        // Download lipsync videos
        if (resultData.lipsync_videos) {
            resultData.lipsync_videos.forEach((url, index) => {
                downloadPromises.push(
                    fetch(url)
                        .then(response => response.blob())
                        .then(blob => {
                            zip.file(`lipsync-videos/lipsync-video-${index + 1}.mp4`, blob);
                        })
                        .catch(e => console.error(`Failed to download lipsync video ${index + 1}:`, e))
                );
            });
        }

        // Download lipsync images
        if (resultData.lipsync_images) {
            resultData.lipsync_images.forEach((url, index) => {
                downloadPromises.push(
                    fetch(url)
                        .then(response => response.blob())
                        .then(blob => {
                            zip.file(`lipsync-images/lipsync-image-${index + 1}.png`, blob);
                        })
                        .catch(e => console.error(`Failed to download lipsync image ${index + 1}:`, e))
                );
            });
        }

        // Download full audio
        if (resultData.full_audio) {
            downloadPromises.push(
                fetch(resultData.full_audio)
                    .then(response => response.blob())
                    .then(blob => {
                        zip.file(`audio/full-audio.mp3`, blob);
                    })
                    .catch(e => console.error('Failed to download full audio:', e))
            );
        }

        await Promise.all(downloadPromises);

        zip.generateAsync({ type: "blob" }).then((content) => {
            saveAs(content, "video-generation-results.zip");
            toast({ title: 'Download Complete!', description: 'All assets have been downloaded.' });
        });
    };

    if (!resultData) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Could not load video generation results. The data might be missing or in the wrong format.
                    <Button onClick={() => navigate('/')} variant="link">Go back</Button>
                </AlertDescription>
            </Alert>
        );
    }

    const hasContent = Boolean(
        resultData.broll_videos?.length || 
        resultData.lipsync_videos?.length || 
        resultData.broll_images?.length || 
        resultData.lipsync_images?.length || 
        resultData.full_audio
    );

    if (!hasContent) {
        return (
            <Alert>
                <AlertTitle>No Content Generated</AlertTitle>
                <AlertDescription>
                    The generation process completed but no content was produced.
                    <Button onClick={() => navigate('/')} variant="link">Try again</Button>
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Your Content is Ready!</h1>
                <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
                    Download your generated videos, images, and audio below.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-8">
                    {/* Lipsync Videos */}
                    {resultData.lipsync_videos && resultData.lipsync_videos.length > 0 && (
                        <Card className="overflow-hidden shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Video className="h-5 w-5" />
                                    Lipsync Videos ({resultData.lipsync_videos.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {resultData.lipsync_videos.map((videoUrl, index) => (
                                    <div key={`lipsync-video-${index}`} className="space-y-2">
                                        <VideoPlayer src={videoUrl} />
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" asChild className="flex-1">
                                                <a href={videoUrl} download>
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Download
                                                </a>
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleCopy(videoUrl)}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* B-Roll Videos */}
                    {resultData.broll_videos && resultData.broll_videos.length > 0 && (
                        <Card className="overflow-hidden shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Video className="h-5 w-5" />
                                    B-Roll Videos ({resultData.broll_videos.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {resultData.broll_videos.map((videoUrl, index) => (
                                    <div key={`broll-video-${index}`} className="space-y-2">
                                        <VideoPlayer src={videoUrl} />
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" asChild className="flex-1">
                                                <a href={videoUrl} download>
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Download
                                                </a>
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleCopy(videoUrl)}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Lipsync Images */}
                    {resultData.lipsync_images && resultData.lipsync_images.length > 0 && (
                        <Card className="overflow-hidden shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Image className="h-5 w-5" />
                                    Lipsync Images ({resultData.lipsync_images.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {resultData.lipsync_images.map((imageUrl, index) => (
                                    <div key={`lipsync-image-${index}`} className="space-y-2">
                                        <div className="relative aspect-square">
                                            <img 
                                                src={imageUrl} 
                                                alt={`Lipsync Image ${index + 1}`} 
                                                className="absolute inset-0 w-full h-full object-cover rounded-lg" 
                                            />
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="outline" size="sm" asChild className="flex-1">
                                                <a href={imageUrl} download>
                                                    <Download className="h-3 w-3" />
                                                </a>
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleCopy(imageUrl)}>
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* B-Roll Images */}
                    {resultData.broll_images && resultData.broll_images.length > 0 && (
                        <Card className="overflow-hidden shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Image className="h-5 w-5" />
                                    B-Roll Images ({resultData.broll_images.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {resultData.broll_images.map((imageUrl, index) => (
                                    <div key={`broll-image-${index}`} className="space-y-2">
                                        <div className="relative aspect-square">
                                            <img 
                                                src={imageUrl} 
                                                alt={`B-Roll Image ${index + 1}`} 
                                                className="absolute inset-0 w-full h-full object-cover rounded-lg" 
                                            />
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="outline" size="sm" asChild className="flex-1">
                                                <a href={imageUrl} download>
                                                    <Download className="h-3 w-3" />
                                                </a>
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleCopy(imageUrl)}>
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Full Audio */}
                    {resultData.full_audio && (
                        <Card className="overflow-hidden shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Headphones className="h-5 w-5" />
                                    Full Audio
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <audio controls className="w-full">
                                        <source src={resultData.full_audio} type="audio/mpeg" />
                                        Your browser does not support the audio element.
                                    </audio>
                                    <div className="flex gap-2">
                                        <Button variant="outline" asChild className="flex-1">
                                            <a href={resultData.full_audio} download>
                                                <Download className="h-4 w-4 mr-2" />
                                                Download Audio
                                            </a>
                                        </Button>
                                            <Button variant="outline" onClick={() => resultData.full_audio && handleCopy(resultData.full_audio)}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <Card className="h-fit shadow-lg sticky top-24">
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button size="lg" className="w-full" onClick={handleDownloadAll}>
                                <Download className="mr-2 h-5 w-5" />
                                Download All (.zip)
                            </Button>
                            <Button size="lg" variant="outline" className="w-full" onClick={() => navigate('/')}>
                                <CornerDownLeft className="mr-2 h-5 w-5" />
                                Create Another Video
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}