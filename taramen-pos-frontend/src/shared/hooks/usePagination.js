import { useState } from "react";

export function usePagination(totalPages = 10, initialPage = 1) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [inputPage, setInputPage] = useState(initialPage.toString());

  const handlePageClick = (page) => {
    setCurrentPage(page);
    setInputPage(page.toString());
  };

  const handleGoToPage = () => {
    const page = parseInt(inputPage);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleInputChange = (e) => {
    setInputPage(e.target.value);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageClick(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageClick(currentPage + 1);
    }
  };

  const getVisiblePages = () => {
    const pages = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      // Show first 5 pages when near the beginning
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Show last 5 pages when near the end
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page (3 pages in middle)
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    }
    
    return pages;
  };

  const getPageButtonClass = (page, baseClass = "w-8 h-8 text-sm rounded-md") => {
    return currentPage === page 
      ? `${baseClass} text-white bg-primary`
      : `${baseClass} text-gray-700 bg-white hover:bg-gray-50`;
  };

  return {
    currentPage,
    inputPage,
    totalPages,
    visiblePages: getVisiblePages(),
    handlePageClick,
    handleGoToPage,
    handleInputChange,
    handlePrevPage,
    handleNextPage,
    getPageButtonClass,
    setCurrentPage,
    setInputPage,
    canGoPrev: currentPage > 1,
    canGoNext: currentPage < totalPages,
  };
}