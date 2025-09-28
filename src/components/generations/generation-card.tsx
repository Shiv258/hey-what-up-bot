import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, User, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { GenerationData } from "@/lib/generations-service";

interface GenerationCardProps {
  generation: GenerationData;
  showFullDetails?: boolean;
}

export function GenerationCard({ generation, showFullDetails = false }: GenerationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'processing': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'error': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative aspect-[9/16] overflow-hidden">
        <img 
          src={generation.thumbnail} 
          alt={`Generation ${generation.id}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {generation.hasResults ? (
            <Link to={`/results/${generation.id}`}>
              <Button variant="outline" size="sm" className="bg-white/20 border-white/20 text-white hover:bg-white hover:text-black">
                <Eye className="h-4 w-4 mr-2" />
                View Results
              </Button>
            </Link>
          ) : (
            <Badge variant="secondary" className="bg-white/20 border-white/20 text-white">
              {generation.status === 'processing' ? 'Processing...' : 'No Results'}
            </Badge>
          )}
        </div>
        
        {/* Status badge */}
        <Badge 
          variant="outline" 
          className={`absolute top-2 right-2 ${getStatusColor(generation.status)}`}
        >
          {generation.status}
        </Badge>
      </div>
      
      {showFullDetails && (
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm text-muted-foreground">{generation.id}</span>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {generation.timeAgo}
            </div>
          </div>
          
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="font-medium">{generation.character}</span>
          </div>
          
          {generation.script && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {generation.script}
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
}