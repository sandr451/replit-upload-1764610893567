import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Github } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGitHubUpload = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/github/upload', {
        repoName: `replit-upload-${Date.now()}`,
        repoDescription: 'Project uploaded from Replit',
        isPrivate: false,
        includeReadme: true,
      });

      toast({
        title: 'Success!',
        description: `Repository created: ${response.repoName}`,
      });

      // Open the repo in a new window
      window.open(response.url, '_blank');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload to GitHub',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Upload to GitHub</h1>
            <p className="text-muted-foreground">
              Push your project to GitHub with one click
            </p>
          </div>

          <Button
            onClick={handleGitHubUpload}
            disabled={isLoading}
            size="lg"
            className="w-full gap-2"
            data-testid="button-github-upload"
          >
            <Github className="w-5 h-5" />
            {isLoading ? 'Uploading...' : 'Upload to GitHub'}
          </Button>

          <div className="text-xs text-muted-foreground text-center">
            Your project files will be uploaded to a new GitHub repository
          </div>
        </div>
      </Card>
    </div>
  );
}
