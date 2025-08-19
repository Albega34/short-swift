import Header from "@/components/Header";
import UrlShortenerForm from "@/components/UrlShortenerForm";
import { useUrlStorage } from "@/hooks/useUrlStorage";

const Index = () => {
  const { addUrl, isCodeExists, generateShortCode } = useUrlStorage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <UrlShortenerForm
          onUrlShorten={addUrl}
          isCodeExists={isCodeExists}
          generateShortCode={generateShortCode}
        />
      </main>
    </div>
  );
};

export default Index;
