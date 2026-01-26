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
import { LockIcon, MailIcon, User, UtensilsCrossed } from "lucide-react"; 

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
                     className="size-30 w-auto mx-auto block mt-6"
                  />
               }
               title='Welcome Back'
               description='Enter your credentials to access your account'
               descriptionClassName='text-black text-gray-600 text-md'
               cardClassName='text-center w-128 bg-white relative overflow-hidden border-1 border-white bg-[linear-gradient(135deg,rgba(255,255,255,0)_0%,rgba(245,171,41,0.25)_100%)] shadow-2xl'
               cardContentClassName='pb-12 w-120 mx-auto'
               cardTitleClassName='md:text-4xl text-orange pt-4'
            >               
               <Form className='flex flex-col' onSubmit={onSubmit} schema={loginSchema}>
                  <IInput 
                     name='username' 
                     label='Email' 
                     placeholder='Enter your email' 
                     labelClassName='font-semibold text-md text-foreground'
                     className='bg-transparent border border-gray-300 h-12 text-lg! px-4'
                     wrapperClassName='mb-6'
                     suffix={<User className="size-4.5 text-gray-500" />}
                  />
                  <div className='relative mb-12'>
                     <div className='flex justify-between items-center mb-1'>
                        <div className='font-semibold text-md text-foreground'>Password</div>
                        <IButton type='button' variant='ghost' className='text-md text-orange hover:text-orange/80 p-0 h-auto font-semibold'>
                           Forgot password?
                        </IButton>
                     </div>
                     <IInput
                        name='password'
                        type='password'
                        placeholder='Enter your password'
                        className='bg-transparent border border-gray-300 h-12 text-lg! px-4'
                     />
                  </div>
                  <IButton type='submit' variant='orange' className='w-full font-normal h-12' disabled={false}>
                     LOGIN
                  </IButton>

                  {error && <IAlert description={error} />}
               </Form>
            </ICard>
         </section>
      </LoginLayout>
   );
}