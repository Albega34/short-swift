import RedirectHandler from "@/components/RedirectHandler";
import { useUrlStorage } from "@/hooks/useUrlStorage";

const Redirect = () => {
  const { getUrlByCode } = useUrlStorage();

  return <RedirectHandler getUrlByCode={getUrlByCode} />;
};

export default Redirect;