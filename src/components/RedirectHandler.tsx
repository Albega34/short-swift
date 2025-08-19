import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ExternalLink, Clock } from "lucide-react";
import { ShortenedUrl } from '@/types/url';

interface RedirectHandlerProps {
  getUrlByCode: (code: string) => ShortenedUrl | undefined;
}

const RedirectHandler = ({ getUrlByCode }: RedirectHandlerProps) => {
  const { code } = useParams<{ code: string }>();

  useEffect(() => {
    if (!code) return;

    const urlData = getUrlByCode(code);
    
    if (!urlData) {
      return; // Show error in render
    }

    const now = new Date();
    if (now > urlData.expiresAt) {
      return; // Show expired in render
    }

    // Redirect after a short delay for better UX
    const timer = setTimeout(() => {
      window.location.href = urlData.originalUrl;
    }, 2000);

    return () => clearTimeout(timer);
  }, [code, getUrlByCode]);

  if (!code) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md bg-gradient-card shadow-medium">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <CardTitle>Invalid URL</CardTitle>
            <CardDescription>
              The short URL you're trying to access is invalid.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const urlData = getUrlByCode(code);
  
  if (!urlData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md bg-gradient-card shadow-medium animate-fade-in">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <CardTitle>URL Not Found</CardTitle>
            <CardDescription>
              The short URL you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const now = new Date();
  const isExpired = now > urlData.expiresAt;

  if (isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md bg-gradient-card shadow-medium animate-fade-in">
          <CardHeader className="text-center">
            <Clock className="w-12 h-12 text-warning mx-auto mb-4" />
            <CardTitle>Link Expired</CardTitle>
            <CardDescription>
              This short URL has expired and is no longer valid.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>Original URL:</p>
              <p className="break-all font-mono bg-muted p-2 rounded">
                {urlData.originalUrl}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </Button>
              <Button 
                variant="default" 
                className="flex-1"
                onClick={() => window.open(urlData.originalUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Anyway
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md bg-gradient-card shadow-medium animate-scale-in">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle>Redirecting...</CardTitle>
          <CardDescription>
            You'll be redirected to your destination in a moment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Taking you to:</p>
            <p className="break-all font-mono bg-muted p-2 rounded">
              {urlData.originalUrl}
            </p>
          </div>
          <Button 
            variant="hero" 
            className="w-full"
            onClick={() => window.location.href = urlData.originalUrl}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Continue Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RedirectHandler;