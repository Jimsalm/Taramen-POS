import { Skeleton } from "../ui/skeleton";

export default function ModalSkeleton() {
   return (
      <div>
         <Skeleton className='h-8 w-1/3 mb-4' />
         <div className='space-y-2'>
            <Skeleton className='h-4 w-3/6' />
            <Skeleton className='h-4 w-5/6' />
            <Skeleton className='h-4 w-4/6' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-2/6' />
         </div>
      </div>
   );
}
