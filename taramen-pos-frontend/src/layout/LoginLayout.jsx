export default function LoginLayout({ children }) {
   return (
      <div className="min-h-screen w-full flex items-center justify-center px-6 py-10 bg-neutral-950">
         <div 
            className="absolute inset-0 bg-cover bg-center blur-xs opacity-60"
            style={{ backgroundImage: "url('/taramen-bg.jpg')" }} 
         />
         <div className="relative z-10 w-full">
            {children}
         </div>
      </div>
   );
}
