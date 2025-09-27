
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { VideoPlayer } from './video-player';
import { Button } from '../ui/button';
import { Download, Copy, CornerDownLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useNavigate } from 'react-router-dom';

interface WebhookResponseItem {
    "video "?: string;
    "Broll Image"?: string;
    "Image URL"?: string;
}

export function ResultsDisplay({ resultData }: { resultData: any[] | null }) {
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

        const filePromises = resultData.map(async (item, index) => {
            const videoUrl = item["video "];
            const brollImageUrl = item["Broll Image"];
            const imageUrl = item["Image URL"];
            
            try {
                if (videoUrl) {
                    const response = await fetch(videoUrl);
                    if (!response.ok) throw new Error(`Failed to fetch video ${index + 1}`);
                    const blob = await response.blob();
                    zip.file(`clipforge-output/Video-${index + 1}.mp4`, blob);
                }
                if (brollImageUrl) {
                    const response = await fetch(brollImageUrl);
                    if (!response.ok) throw new Error(`Failed to fetch B-Roll Image ${index + 1}`);
                    const blob = await response.blob();
                    zip.file(`clipforge-output/B-Roll-Image-${index + 1}.png`, blob);
                }
                if (imageUrl) {
                    const response = await fetch(imageUrl);
                    if (!response.ok) throw new Error(`Failed to fetch Image ${index + 1}`);
                    const blob = await response.blob();
                    zip.file(`clipforge-output/Image-${index + 1}.png`, blob);
                }
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
                console.error(`Failed to download an asset for item ${index + 1}`, e);
                toast({ title: 'Download Error', description: `Could not fetch an asset: ${errorMessage}`, variant: 'destructive'});
            }
        });

        await Promise.all(filePromises);

        zip.generateAsync({ type: "blob" }).then((content) => {
            saveAs(content, "clipforge-results.zip");
        });
    };

    if (!resultData || !Array.isArray(resultData) || resultData.length === 0) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Could not load video generation results. The data might be missing or in the wrong format.
                     <Button onClick={() => navigate('/')} variant="link">Go back</Button>
                </AlertDescription>
            </Alert>
        )
    }

    const videoItems = resultData.filter(item => item["video "]);
    const imageItems = resultData.filter(item => item["Image URL"]);

  return (
    <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Your Content is Ready!</h1>
            <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
                Download your generated videos and images below.
            </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-8">
                {videoItems.map((item, index) => (
                    <Card key={`video-${index}`} className="overflow-hidden shadow-xl">
                        <CardHeader>
                            <CardTitle>Video {index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <VideoPlayer src={item["video "]!} poster={item["Broll Image"]} />
                        </CardContent>
                    </Card>
                ))}
                 {imageItems.length > 0 && (
                    <Card className="overflow-hidden shadow-xl">
                        <CardHeader>
                            <CardTitle>Generated Images</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {imageItems.map((item, index) => (
                                <div key={`image-${index}`} className="relative aspect-square">
                                    <img src={item["Image URL"]!} alt={`Generated Image ${index + 1}`} className="absolute inset-0 w-full h-full object-cover rounded-lg" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
            <div className="lg:col-span-2">
                <Card className="h-full shadow-lg sticky top-24">
                    <CardHeader>
                        <CardTitle>Download Assets</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {resultData.map((item, index) => {
                            const videoUrl = item["video "];
                            const brollUrl = item["Broll Image"];
                            const imageUrl = item["Image URL"];
                             return(
                               <div key={`assets-${index}`} className="space-y-2">
                                {videoUrl && (
                                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                      <span className="font-medium truncate">Video Clip</span>
                                      <div className="flex items-center gap-1 shrink-0">
                                          <Button variant="ghost" size="icon" asChild>
                                              <a href={videoUrl} download><Download className="h-4 w-4" /></a>
                                          </Button>
                                          <Button variant="ghost" size="icon" onClick={() => handleCopy(videoUrl)}>
                                              <Copy className="h-4 w-4" />
                                          </Button>
                                      </div>
                                  </div>
                                )}
                                {brollUrl && (
                                   <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                      <span className="font-medium truncate">B-Roll Image</span>
                                      <div className="flex items-center gap-1 shrink-0">
                                          <Button variant="ghost" size="icon" asChild>
                                              <a href={brollUrl} download><Download className="h-4 w-4" /></a>
                                          </Button>
                                          <Button variant="ghost" size="icon" onClick={() => handleCopy(brollUrl)}>
                                              <Copy className="h-4 w-4" />
                                          </Button>
                                      </div>
                                  </div>
                                )}
                                 {imageUrl && (
                                   <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                      <span className="font-medium truncate">Image</span>
                                      <div className="flex items-center gap-1 shrink-0">
                                          <Button variant="ghost" size="icon" asChild>
                                              <a href={imageUrl} download><Download className="h-4 w-4" /></a>
                                          </Button>
                                          <Button variant="ghost" size="icon" onClick={() => handleCopy(imageUrl)}>
                                              <Copy className="h-4 w-4" />
                                          </Button>
                                      </div>
                                  </div>
                                )}
                               </div>
                             )
                        })}
                    </CardContent>
                    <CardFooter className="flex-col gap-4">
                        <Button size="lg" className="w-full" onClick={handleDownloadAll} disabled={!resultData}>
                            <Download className="mr-2 h-5 w-5" /> Download All (.zip)
                        </Button>
                         <Button size="lg" variant="outline" className="w-full" onClick={() => navigate('/')}>
                            <CornerDownLeft className="mr-2 h-5 w-5" /> Create Another Video
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    </div>
  );
}
