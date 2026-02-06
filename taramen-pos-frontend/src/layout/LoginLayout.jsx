export default function LoginLayout({ children }) {
   return (
      <div className="relative min-h-screen w-full overflow-hidden">
         <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
            style={{ backgroundImage: "url('/background.svg')" }} 
         />
         <div className="absolute inset-0 bg-black/60" />
         <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-6">
            {children}
         </div>
      </div>
   );
}