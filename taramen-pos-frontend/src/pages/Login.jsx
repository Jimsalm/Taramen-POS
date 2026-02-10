import { User, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import IButton from "../components/custom/Button";
import ICard from "../components/custom/Card";
import Form from "../components/custom/Form";
import IInput from "../components/custom/Input";
import LoginLayout from "../layout/LoginLayout";
import { loginSchema } from "../shared/lib/zod/schema/login";
import { useLogin } from "../hooks/useAuth";
import useAuthStore from "../stores/useAuthStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import IAlert from "../components/custom/Alert";

export default function Login() {
   const navigate = useNavigate();
   const { 
      isLoading,
      errorMessage,
      clearError,
      openForgotPasswordModal,
      isForgotPasswordModalOpen,
      closeForgotPasswordModal
   } = useAuthStore();

   const { mutate: login } = useLogin();

   const onSubmit = async (data) => {
      clearError(); // Clear any previous errors
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
                     name='email' 
                     type='email'
                     label='Email' 
                     placeholder='Enter your email' 
                     labelClassName='font-semibold text-md text-foreground'
                     className='bg-transparent border border-gray-300 h-12 text-lg! px-4'
                     wrapperClassName='mb-6'
                     suffix={<User className="size-4.5 text-gray-500" />}
                  />
                  <div className='relative mb-8'>
                     <div className='flex justify-between items-center mb-1'>
                        <div className='font-semibold text-md text-foreground'>Password</div>
                        <IButton 
                           type='button' 
                           variant='ghost' 
                           className='text-md text-orange hover:text-orange/80 p-0 h-auto font-semibold'
                           onClick={openForgotPasswordModal}
                        >
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
                  <IButton 
                     type='submit' 
                     variant='orange' 
                     className='w-full font-normal h-12 flex items-center justify-center gap-2' 
                     disabled={isLoading}
                  >
                     {isLoading ? (
                        <>
                           <Loader2 className="h-4 w-4 animate-spin" />
                           SIGNING IN...
                        </>
                     ) : 'LOGIN'}
                  </IButton>
                  {errorMessage && (
                     <div className="mt-8">
                        <IAlert variant="destructive" description={errorMessage} />
                     </div>
                  )}
               </Form>
            </ICard>
         </section>

         <Dialog 
            open={isForgotPasswordModalOpen} 
            onOpenChange={(open) => !open && closeForgotPasswordModal()}
         >
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Forgot Password</DialogTitle>
               </DialogHeader>
               <p className="text-sm text-gray-600 mb-4">
                  Please contact the administrator to reset your password.
               </p>
               <div className="flex justify-end gap-2">
                  <IButton 
                     onClick={closeForgotPasswordModal}
                     variant="outline"
                  >
                     Close
                  </IButton>
               </div>
            </DialogContent>
         </Dialog>
      </LoginLayout>
   );
}
