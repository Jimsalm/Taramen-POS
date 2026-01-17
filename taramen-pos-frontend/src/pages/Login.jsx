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
import { LockIcon, MailIcon } from "lucide-react";

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
         <section className='flex flex-col lg:flex-row items-start mx-auto lg:gap-12 lg:pr-24 mb-12 lg:mb-0'>
            <ICard
               title='Welcome Back!'
               description='Enter your credentials to access your account'
               cardClassName='text-center w-100 bg-white'
               cardTitleClassName='lg:text-3xl'
            >
               <Form className='flex flex-col gap-6' onSubmit={onSubmit} schema={loginSchema}>
                  <IInput name='username' placeholder='Username' prefix={<MailIcon className='size-4 text-black' />} />
                  <IInput
                     name='password'
                     type='password'
                     placeholder='Password'
                     prefix={<LockIcon className='size-4 text-black' />}
                  />
                  <IButton type='submit' variant='brandRed' className='w-full'>
                     Sign In
                  </IButton>

                  {error && <IAlert description={error} />}
               </Form>
            </ICard>
         </section>
      </LoginLayout>
   );
}
