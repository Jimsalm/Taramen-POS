export default function LoginLayout({ children }) {
   return (
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
         <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
            style={{ backgroundImage: "url('/GAY.jpg')" }} 
         />
         <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
         <div className="relative z-10 w-full flex justify-center p-6">
            {children}
         </div>
      </div>
   );
}