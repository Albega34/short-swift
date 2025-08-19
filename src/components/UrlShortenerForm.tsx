import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Link2, Copy, CheckCircle, AlertCircle } from "lucide-react";
import { ShortenedUrl, UrlFormData } from "@/types/url";

interface UrlShortenerFormProps {
  onUrlShorten: (url: ShortenedUrl) => void;
  isCodeExists: (code: string) => boolean;
  generateShortCode: () => string;
}

const UrlShortenerForm = ({ onUrlShorten, isCodeExists, generateShortCode }: UrlShortenerFormProps) => {
  const [formData, setFormData] = useState<UrlFormData>({
    originalUrl: '',
    customCode: '',
    validityMinutes: 30,
  });
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateCustomCode = (code: string): string[] => {
    const errors = [];
    if (code && !/^[a-zA-Z0-9]+$/.test(code)) {
      errors.push("Custom code must be alphanumeric");
    }
    if (code && (code.length < 3 || code.length > 20)) {
      errors.push("Custom code must be 3-20 characters long");
    }
    if (code && isCodeExists(code)) {
      errors.push("Custom code already exists");
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const validationErrors = [];

    if (!formData.originalUrl) {
      validationErrors.push("URL is required");
    } else if (!validateUrl(formData.originalUrl)) {
      validationErrors.push("Please enter a valid URL");
    }

    if (formData.customCode) {
      validationErrors.push(...validateCustomCode(formData.customCode));
    }

    if (formData.validityMinutes < 1 || formData.validityMinutes > 10080) {
      validationErrors.push("Validity must be between 1 and 10080 minutes (1 week)");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    setErrors([]);

    // Generate short code
    const shortCode = formData.customCode || generateShortCode();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + formData.validityMinutes * 60 * 1000);

    const newUrl: ShortenedUrl = {
      id: Math.random().toString(36).substr(2, 9),
      originalUrl: formData.originalUrl,
      shortCode,
      createdAt: now,
      expiresAt,
      isExpired: false,
    };

    onUrlShorten(newUrl);
    setShortenedUrls([newUrl, ...shortenedUrls]);
    
    // Reset form
    setFormData({
      originalUrl: '',
      customCode: '',
      validityMinutes: 30,
    });

    toast({
      title: "URL shortened successfully!",
      description: "Your short URL is ready to use.",
    });

    setIsLoading(false);
  };

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

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card shadow-medium">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center space-x-2">
            <Link2 className="w-6 h-6 text-primary" />
            <span>Shorten Your URL</span>
          </CardTitle>
          <CardDescription>
            Create short, shareable links that expire when you want them to
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Long URL *</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/very/long/url"
                value={formData.originalUrl}
                onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
                className="transition-all duration-300 focus:shadow-soft"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customCode">Custom Code (Optional)</Label>
                <Input
                  id="customCode"
                  placeholder="mycode123"
                  value={formData.customCode}
                  onChange={(e) => setFormData({ ...formData, customCode: e.target.value })}
                  className="transition-all duration-300 focus:shadow-soft"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="validity">Validity (Minutes)</Label>
                <Input
                  id="validity"
                  type="number"
                  min="1"
                  max="10080"
                  value={formData.validityMinutes}
                  onChange={(e) => setFormData({ ...formData, validityMinutes: parseInt(e.target.value) || 30 })}
                  className="transition-all duration-300 focus:shadow-soft"
                />
              </div>
            </div>

            {errors.length > 0 && (
              <Alert variant="destructive" className="animate-fade-in">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              variant="hero" 
              size="lg" 
              disabled={isLoading}
            >
              {isLoading ? "Shortening..." : "Shorten URL"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {shortenedUrls.length > 0 && (
        <Card className="bg-gradient-card shadow-medium animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span>Your Shortened URLs</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shortenedUrls.slice(0, 5).map((url) => (
                <div
                  key={url.id}
                  className="p-4 bg-background rounded-lg border border-border hover:shadow-soft transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-foreground">
                          {window.location.origin}/{url.shortCode}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(`${window.location.origin}/${url.shortCode}`)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {url.originalUrl}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Expires: {url.expiresAt.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UrlShortenerForm;