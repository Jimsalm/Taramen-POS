import BaseLayout from "./BaseLayout";

export default function LoginLayout({ children }) {
   return <BaseLayout className='!items-center !justify-center bg-muted min-h-screen'>
      <div className='flex justify-center w-full p-4'>
         {children}
      </div>
   </BaseLayout>;
}
