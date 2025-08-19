import Header from "@/components/Header";
import StatisticsPage from "@/components/StatisticsPage";
import { useUrlStorage } from "@/hooks/useUrlStorage";

const Statistics = () => {
  const { urls } = useUrlStorage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <StatisticsPage urls={urls} />
      </main>
    </div>
  );
};

export default Statistics;