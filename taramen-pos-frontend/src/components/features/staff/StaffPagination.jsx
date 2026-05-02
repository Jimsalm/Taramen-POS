import { StepBack, StepForward } from "lucide-react";
import { usePagination } from "@/shared/hooks/usePagination";

export default function StaffPagination() {
  const {
    currentPage,
    inputPage,
    totalPages,
    visiblePages,
    handlePageClick,
    handleGoToPage,
    handleInputChange,
    handlePrevPage,
    handleNextPage,
    getPageButtonClass,
    canGoPrev,
    canGoNext,
  } = usePagination(10, 1);

  return (
    <div className="flex items-center justify-center gap-2 px-4 py-3rounded-b-xl">
      <div className="flex items-center gap-2">
        <button 
          onClick={handlePrevPage}
          className="flex items-center justify-center w-8 h-8 text-gray-700 bg-white rounded-md hover:bg-gray-50 disabled:opacity-50"
          disabled={!canGoPrev}
        >
          <StepBack className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-1 justify-center">
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center text-gray-500">
                  ...
                </span>
              );
            }
            return (
              <button 
                key={page}
                onClick={() => handlePageClick(page)}
                className={getPageButtonClass(page)}
              >
                {page}
              </button>
            );
          })}
        </div>
        
        <button 
          onClick={handleNextPage}
          className="flex items-center justify-center w-8 h-8 text-gray-700 bg-white rounded-md hover:bg-gray-50 disabled:opacity-50"
          disabled={!canGoNext}
        >
          <StepForward className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Page</span>
        <input 
          type="text" 
          className="w-16 px-2 py-1 text-sm text-center border border-red-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          value={inputPage}
          onChange={handleInputChange}
        />
        <span className="text-sm text-gray-700">of {totalPages}</span>
        <button 
          onClick={handleGoToPage}
          className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Go to Page
        </button>
      </div>
    </div>
  );
}
