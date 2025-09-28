
import { useEffect, useState } from 'react';
import { PageShell } from '@/components/common/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GenerationCard } from '@/components/generations/generation-card';
import { getRecentGenerations, GenerationData } from '@/lib/generations-service';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [recentGenerations, setRecentGenerations] = useState<GenerationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentGenerations = async () => {
      try {
        const data = await getRecentGenerations(6);
        setRecentGenerations(data);
      } catch (error) {
        console.error('Failed to fetch recent generations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentGenerations();
  }, []);
  return (
    <PageShell>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link to="/">
            <Button>New Generation</Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>View All Generations</CardTitle>
            <CardDescription>Browse through your complete generation history with thumbnails and details.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">View All Your Generations</p>
                <Link to="/generations">
                    <Button>View All Generations</Button>
                </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Your Recent Generations</CardTitle>
                <CardDescription>A quick look at your latest video generations with job IDs and characters.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="aspect-[9/16] rounded-lg" />
                    ))}
                  </div>
                ) : recentGenerations.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {recentGenerations.map(generation => (
                          <GenerationCard 
                            key={generation.id} 
                            generation={generation} 
                          />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">No generations yet</p>
                    <Link to="/">
                      <Button>Create Your First Generation</Button>
                    </Link>
                  </div>
                )}
            </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
