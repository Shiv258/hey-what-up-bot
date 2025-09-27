
import { PageShell } from '@/components/common/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardPage() {
  const previousGenerations = [
    { id: 1, src: 'https://placehold.co/180x320.png', 'data-ai-hint': 'video' },
    { id: 2, src: 'https://placehold.co/180x320.png', 'data-ai-hint': 'video' },
    { id: 3, src: 'https://placehold.co/180x320.png', 'data-ai-hint': 'video' },
    { id: 4, src: 'https://placehold.co/180x320.png', 'data-ai-hint': 'video' },
  ]
  return (
    <PageShell>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link href="/">
            <Button>New Generation</Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>View All Generations</CardTitle>
            <CardDescription>All of your generated videos are stored in our Airtable. Click the button below to see your full history.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">View All the Generations Till Now</p>
                <Link href="https://airtable.com/appSMvzeRgjiPtu8u/shrsx3ElFqEYN2lOi" target="_blank" rel="noopener noreferrer">
                    <Button>Click here to see!</Button>
                </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Your Recent Generations</CardTitle>
                <CardDescription>A quick look at some of your recent videos.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {previousGenerations.map(gen => (
                        <div key={gen.id} className="relative aspect-[9/16] rounded-lg overflow-hidden group">
                           <Image src={gen.src} alt={`Generated video ${gen.id}`} fill className="object-cover" data-ai-hint={gen['data-ai-hint']} />
                           <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="outline" size="sm">View</Button>
                           </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
