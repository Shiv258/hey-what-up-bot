

import { GeneratorForm } from "@/components/generator/generator-form";
import { PageShell } from "@/components/common/page-shell";
import { QuickTry } from "@/components/generator/quick-try";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { Vortex } from "@/components/ui/vortex";
import { FeaturedVideos } from "@/components/generator/featured-videos";
import { CharacterSchema, type Character } from "@/ai/schemas/character";
import { useEffect } from "react";

export default function HomePage() {
  const [searchParams] = useSearchParams();
  
  // Read URL parameters for external integration
  const urlScript = searchParams.get('script');
  const urlCharacter = searchParams.get('character');
  const urlContentId = searchParams.get('content_id');
  const urlJobId = searchParams.get('job_id');
  const urlCallbackUrl = searchParams.get('callback_url');
  
  // Debug logging
  useEffect(() => {
    console.log('🔍 URL Parameters Debug:', {
      script: urlScript,
      character: urlCharacter,
      content_id: urlContentId,
      job_id: urlJobId,
      callback_url: urlCallbackUrl
    });
  }, [urlScript, urlCharacter, urlContentId, urlJobId, urlCallbackUrl]);
  
  // Decode and validate parameters
  const defaultScript = urlScript ? decodeURIComponent(urlScript) : undefined;
  const defaultCharacter = urlCharacter && CharacterSchema.safeParse(urlCharacter).success 
    ? (urlCharacter as Character) 
    : undefined;
  const contentId = urlContentId || undefined;
  const externalJobId = urlJobId || undefined;
  const callbackUrl = urlCallbackUrl || undefined;

  return (
    <PageShell>
      <div className="relative isolate">
         <Vortex
          backgroundColor="transparent"
          particleCount={200}
          baseHue={260}
          baseSpeed={0.1}
          rangeY={200}
          className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
        >
        <div className="container relative flex flex-col items-center justify-center text-center py-16 lg:py-24">
          <div className="bg-background/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-border/20">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              World's First <span className="text-accent">AI Influencer</span> SaaS
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
              Meet your AI Influencer - the digital brand ambassador that creates content, engages followers, generates leads, and books appointments 24/7 in 15+ languages.
            </p>
          </div>
        </div>
        </Vortex>

        <div className="container pb-16 lg:pb-24">
            <GeneratorForm 
              defaultScript={defaultScript}
              defaultCharacter={defaultCharacter}
              contentId={contentId}
              externalJobId={externalJobId}
              callbackUrl={callbackUrl}
            />
        </div>
        
        <div className="container pb-16 lg:pb-24">
            <Card>
               <CardHeader>
                 <CardTitle>View All Generations</CardTitle>
                 <CardDescription>All of your generated videos are stored securely. Click the button below to see your full history.</CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="text-center py-8 border-2 border-dashed rounded-lg">
                     <p className="text-muted-foreground mb-4">View All the Generations Till Now</p>
                     <Link to="/generations">
                         <Button>Click here to see!</Button>
                     </Link>
                 </div>
               </CardContent>
            </Card>
        </div>

        <div className="container pb-16 lg:pb-24">
            <FeaturedVideos />
        </div>

        <Separator className="my-16" />

        <div className="container pb-16 lg:pb-24">
            <QuickTry />
        </div>

        <div className="text-center pb-8">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Ravan AI</p>
        </div>
      </div>
    </PageShell>
  );
}
