import { useParams } from "react-router-dom";
import ResultsPage from "@/app/results/[id]/page";

export default function ResultsPageWrapper() {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div>Invalid result ID</div>;
  }

  return <ResultsPage params={{ id }} />;
}