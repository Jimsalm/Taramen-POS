import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import ICard from "../components/custom/Card";
import LoginLayout from "../layout/LoginLayout";
import { useLogout } from "../hooks/useAuth";

export default function Logout() {
  const logout = useLogout();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <LoginLayout>
      <section className="flex items-center justify-center">
        <ICard
          title="Signing out"
          description="Please wait while we securely end your session."
          descriptionClassName="text-gray-500 text-base"
          cardClassName="text-center w-full max-w-md mx-auto bg-white/90 backdrop-blur border border-white/60 shadow-2xl/70"
          cardContentClassName="pb-8 px-8"
          cardTitleClassName="text-2xl text-gray-900"
          cardHeaderClassName="gap-2 pt-8"
        >
          <div className="flex items-center justify-center gap-2 py-6 text-gray-600">
            <Loader2 className="size-4 animate-spin" />
            <span>Redirecting to login...</span>
          </div>
        </ICard>
      </section>
    </LoginLayout>
  );
}
