import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import IAlert from "../components/custom/Alert";
import IButton from "../components/custom/Button";
import ICard from "../components/custom/Card";
import Form from "../components/custom/Form";
import IInput from "../components/custom/Input";
import LoginLayout from "../layout/LoginLayout";
import { loginSchema } from "../shared/lib/zod/schema/login";
import { LockIcon, MailIcon, UtensilsCrossed } from "lucide-react"; 

export default function Login() {
   const [error, setError] = useState(null);
   const navigate = useNavigate();

   const onSubmit = async (data) => {
      setError(null);
      const id = toast.loading("Signing you in...");

      try {
         await new Promise(resolve => setTimeout(resolve, 1000));
         
         if (!data.username || !data.password) {
            throw new Error("Please fill in all fields");
         }
         
         const mockToken = "mock-jwt-token";
         localStorage.setItem("token", mockToken);
         
         toast.dismiss(id);
         toast.success("Login successful!");
         navigate("/dashboard", { replace: true });
      } catch (error) {
         toast.dismiss(id);
         setError(error.message);
      }
   };

   return (
      <LoginLayout>
         <section className='flex flex-col items-center justify-center mb-12 lg:mb-0'>
            <ICard
               logo={
                  <img 
                     src="/Taramen.png" 
                     alt="Ta'ramen POS"
                     className="size-50 w-auto mx-auto block"
                  />
               }
               title='Welcome Back!'
               description='Enter your credentials to access your account'
               descriptionClassName='text-gray-600'
               cardClassName='text-center w-128 bg-white hover:bg-gray-50 transition-all duration-300 relative overflow-hidden border-0 shadow-2xl shadow-black/60'
               cardContentClassName='pb-14 w-96 mx-auto'
               cardTitleClassName='md:text-3xl text-[#FF0605]'
            >
               <Form className='flex flex-col gap-6' size- onSubmit={onSubmit} schema={loginSchema}>
                  <IInput name='username' placeholder='Username' prefix={<MailIcon className='size-4 text-gray-500' />} className='h-12' />
                  <IInput
                     name='password'
                     type='password'
                     placeholder='Password'
                     prefix={<LockIcon className='size-4 text-gray-500' />}
                     className='h-12'
                  />
                  <div className='flex justify-end'>
                     <IButton type='button' variant='ghost' className='text-sm text-[#FF0605] p-0 h-auto'>
                        Forgot Password?
                     </IButton>
                  </div>
                  <IButton type='submit' variant='destructive' className='w-full'>
                     Log in
                  </IButton>

                  {error && <IAlert description={error} />}
               </Form>
            </ICard>
         </section>
      </LoginLayout>
   );
}