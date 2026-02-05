import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import IAlert from "../components/custom/Alert";
import IButton from "../components/custom/Button";
import ICard from "../components/custom/Card";
import Form from "../components/custom/Form";
import IInput from "../components/custom/Input";
import LoginLayout from "../layout/LoginLayout";
import { loginSchema } from "../shared/lib/zod/schema/login";
import { useLogin } from "../hooks/useAuth";

export default function Login() {
   const navigate = useNavigate();
   const { mutate: login, isLoading, error } = useLogin();

   const onSubmit = async (data) => {
      login(data, {
         onSuccess: () => {
            navigate("/dashboard", { replace: true });
         }
      });
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
               cardClassName='text-center w-128 bg-white relative overflow-hidden border-1 border-white shadow-2xl'
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
                  <IButton type='submit' variant='orange' className='w-full font-normal h-12' disabled={isLoading}>
                     {isLoading ? 'SIGNING IN...' : 'LOGIN'}
                  </IButton>

                  {error && <IAlert description={error} />}
               </Form>
            </ICard>
         </section>
      </LoginLayout>
   );
}