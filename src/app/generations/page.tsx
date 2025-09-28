import { useEffect, useState } from 'react';
import { PageShell } from '@/components/common/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GenerationCard } from '@/components/generations/generation-card';
import { getAllGenerations, GenerationData } from '@/lib/generations-service';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function GenerationsPage() {
  const [generations, setGenerations] = useState<GenerationData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGenerations = async () => {
    setLoading(true);
    try {
      const data = await getAllGenerations();
      setGenerations(data);
    } catch (error) {
      console.error('Failed to fetch generations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenerations();
  }, []);

  return (
    <PageShell>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">All Generations</h1>
              <p className="text-muted-foreground">View all your video generations</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchGenerations} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Link to="/">
              <Button>New Generation</Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generation History</CardTitle>
            <CardDescription>
              {generations.length > 0 
                ? `${generations.length} total generations` 
                : 'No generations found'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[9/16] w-full rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : generations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {generations.map((generation) => (
                  <GenerationCard 
                    key={generation.id} 
                    generation={generation} 
                    showFullDetails={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">No generations found</p>
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