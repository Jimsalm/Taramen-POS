import { useNavigate } from "react-router-dom";
import IButton from "../components/custom/Button";
import ICard from "../components/custom/Card";

export default function NotFound() {
   const navigate = useNavigate();

   return (
      <div className="min-h-screen flex items-center justify-center bg-background">
         <ICard
            title="404 - Page Not Found"
            description="The page you're looking for doesn't exist."
            cardClassName="text-center max-w-md"
         >
            <IButton onClick={() => navigate("/")} className="w-full">
               Go Home
            </IButton>
         </ICard>
      </div>
   );
}
