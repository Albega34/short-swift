import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShortenedUrl } from "@/types/url";
import { Copy, ExternalLink, Clock, Link2, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StatisticsPageProps {
  urls: ShortenedUrl[];
}

const StatisticsPage = ({ urls }: StatisticsPageProps) => {
  const { toast } = useToast();

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Copied!",
        description: "URL copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy URL to clipboard.",
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getTimeUntilExpiry = (expiresAt: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffInMinutes <= 0) return "Expired";
    if (diffInMinutes < 60) return `${diffInMinutes}m left`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h left`;
    return `${Math.floor(diffInMinutes / 1440)}d left`;
  };

  const totalUrls = urls.length;
  const activeUrls = urls.filter(url => !url.isExpired && new Date() <= url.expiresAt).length;
  const expiredUrls = totalUrls - activeUrls;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-card shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Link2 className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{totalUrls}</p>
                <p className="text-sm text-muted-foreground">Total URLs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <div>
                <p className="text-2xl font-bold text-success">{activeUrls}</p>
                <p className="text-sm text-muted-foreground">Active URLs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold text-muted-foreground">{expiredUrls}</p>
                <p className="text-sm text-muted-foreground">Expired URLs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* URLs List */}
      <Card className="bg-gradient-card shadow-medium">
        <CardHeader>
          <CardTitle>Your Shortened URLs</CardTitle>
          <CardDescription>
            Manage and track all your shortened links
          </CardDescription>
        </CardHeader>
        <CardContent>
          {urls.length === 0 ? (
            <div className="text-center py-12">
              <Link2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No URLs yet</h3>
              <p className="text-muted-foreground">
                Start by shortening your first URL!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {urls.map((url) => {
                const isExpired = url.isExpired || new Date() > url.expiresAt;
                const shortUrl = `${window.location.origin}/${url.shortCode}`;
                
                return (
                  <div
                    key={url.id}
                    className="p-4 bg-background rounded-lg border border-border hover:shadow-soft transition-all duration-300 animate-fade-in"
                  >
                    <div className="flex items-start justify-between space-x-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                            {url.shortCode}
                          </code>
                          <Badge variant={isExpired ? "secondary" : "default"}>
                            {isExpired ? "Expired" : getTimeUntilExpiry(url.expiresAt)}
                          </Badge>
                        </div>
                        
                        <h4 className="font-medium text-foreground mb-1 truncate">
                          {shortUrl}
                        </h4>
                        
                        <p className="text-sm text-muted-foreground truncate mb-2">
                          → {url.originalUrl}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Created {formatTimeAgo(url.createdAt)}</span>
                          <span>•</span>
                          <span>Expires {url.expiresAt.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(shortUrl)}
                          disabled={isExpired}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(url.originalUrl, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsPage;