import { Loader2Icon } from "lucide-react";

export default function Suspense({
   children,
   loading,
   loader = <Loader2Icon className='animate-spin size-8 mx-auto' />,
   className,
}) {
   if (loading) {
      return <div className={`flex items-center justify-center w-full h-full p-8 ${className}`}>{loader}</div>;
   }

   return children;
}
