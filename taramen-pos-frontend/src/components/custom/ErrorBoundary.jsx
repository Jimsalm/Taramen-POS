import React from "react";
import { AlertTriangle } from "lucide-react";
import Title from "./Title";
import Paragraph from "./Paragraph";
import IButton from "./Button";

class ErrorBoundary extends React.Component {
   constructor(props) {
      super(props);
      this.state = { hasError: false, error: null, errorInfo: null };
   }

   static getDerivedStateFromError(error) {
      return { hasError: true };
   }

   componentDidCatch(error, errorInfo) {
      console.error("Error caught by boundary:", error, errorInfo);
      this.setState({
         error,
         errorInfo,
      });
   }

   handleReload = () => {
      window.location.reload();
   };

   render() {
      if (this.state.hasError) {
         return (
            <div className='min-h-screen flex items-center justify-center bg-background p-4'>
               <div className='max-w-md w-full text-center space-y-6'>
                  <div className='flex justify-center'>
                     <div className='rounded-full bg-destructive/10 p-6'>
                        <AlertTriangle className='size-16 text-destructive' />
                     </div>
                  </div>

                  <div className='space-y-2 flex flex-col items-center'>
                     <Title size='2xl'>Oops! Something went wrong</Title>
                     <Paragraph size='sm' className='text-muted-foreground !text-center'>
                        An unexpected error occurred. Please contact the developer for assistance.
                     </Paragraph>
                  </div>

                  {process.env.NODE_ENV === "development" && this.state.error && (
                     <div className='mt-4 p-4 bg-muted rounded-lg text-left'>
                        <Paragraph size='sm' variant='danger' className='font-mono break-all'>
                           {this.state.error.toString()}
                        </Paragraph>
                        {this.state.errorInfo && (
                           <details className='mt-2'>
                              <summary className='text-xs cursor-pointer text-muted-foreground'>Stack trace</summary>
                              <pre className='text-xs mt-2 overflow-auto max-h-40 text-muted-foreground'>
                                 {this.state.errorInfo.componentStack}
                              </pre>
                           </details>
                        )}
                     </div>
                  )}

                  <div className='flex gap-3 justify-center'>
                     <IButton onClick={this.handleReload} variant='default'>
                        Reload Page
                     </IButton>
                  </div>
               </div>
            </div>
         );
      }

      return this.props.children;
   }
}

export default ErrorBoundary;
