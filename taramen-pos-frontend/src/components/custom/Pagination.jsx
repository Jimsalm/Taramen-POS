import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import ISelect from "./Select";

const Pagination = ({
   currentPage,
   totalPages,
   pageSize = 10,
   totalCount = 1,
   isLoading = false,
   onPageChange,
   onPageSizeChange,
   showPageSizeSelector = true,
   className = "",
   pageSizeOptions = [
      { value: "10", label: "10" },
      { value: "25", label: "25" },
      { value: "50", label: "50" },
      { value: "100", label: "100" },
   ],
}) => {
   const defaultPageSize = 10;

   const handlePageSizeChange = (value) => {
      const newPageSize = parseInt(value.value);
      onPageSizeChange?.(newPageSize);
   };

   const handlePreviousPage = () => {
      const newPage = Math.max(1, currentPage - 1);
      onPageChange?.(newPage);
   };

   const handleNextPage = () => {
      const newPage = Math.min(totalPages, currentPage + 1);
      onPageChange?.(newPage);
   };

   const handlePageClick = (pageNum) => {
      onPageChange?.(pageNum);
   };

   // if (totalPages <= 1 && pageSize === defaultPageSize) return null;

   return (
      <div className={`flex items-center justify-between px-4 py-2 border rounded-lg bg-muted/50 ${className}`}>
         <div className='flex items-center space-x-4'>
            {showPageSizeSelector && (
               <div className='flex items-center space-x-2'>
                  <span className='text-xs text-muted-foreground'>Rows per page:</span>
                  <ISelect
                     value={pageSize ? pageSize.toString() : defaultPageSize.toString()}
                     onValueChange={handlePageSizeChange}
                     options={pageSizeOptions}
                     triggerClassName='bg-white'
                     showAll={false}
                  />
               </div>
            )}

            <div className='text-xs text-muted-foreground'>
               Showing {totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
               {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
            </div>
         </div>

         <div className='flex items-center space-x-2'>
            {totalPages > 1 && (
               <>
                  <Button
                     variant='outline'
                     size='sm'
                     onClick={handlePreviousPage}
                     disabled={currentPage === 1 || isLoading}
                  >
                     <ChevronLeftIcon className='h-4 w-4' />
                  </Button>

                  <div className='flex items-center space-x-1'>
                     {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;

                        if (totalPages <= 5) {
                           pageNum = i + 1;
                        } else if (currentPage <= 3) {
                           pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                           pageNum = totalPages - 4 + i;
                        } else {
                           pageNum = currentPage - 2 + i;
                        }

                        return (
                           <Button
                              key={pageNum}
                              variant={currentPage === pageNum && "outline"}
                              size='sm'
                              onClick={() => handlePageClick(pageNum)}
                              className='size-8 p-0'
                              disabled={isLoading}
                           >
                              {pageNum}
                           </Button>
                        );
                     })}
                  </div>

                  <Button
                     variant='outline'
                     size='sm'
                     onClick={handleNextPage}
                     disabled={currentPage === totalPages || isLoading}
                  >
                     <ChevronRightIcon className='h-4 w-4' />
                  </Button>
               </>
            )}
         </div>
      </div>
   );
};

export default Pagination;
