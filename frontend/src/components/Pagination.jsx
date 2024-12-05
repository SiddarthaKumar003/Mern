import React from 'react'

function Pagination({currentPage,totalPages,onPageChange}) {
    const pages = [...Array(totalPages).keys()].map((num)=>num+1)
    return (
        <div className="flex justify-end items-center mt-6">
            {/* Previous Button */}
            <button
                className={`px-4 py-2 border border-gray-300 rounded-l-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'hover:bg-gray-100'
                    }`}
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Previous
            </button>

            {/* Page Numbers */}
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2 border-t border-b border-r border-gray-300 ${page === currentPage
                        ? 'bg-red-600 text-white'
                        : 'bg-white hover:bg-gray-100 text-gray-700'
                        }`}
                >
                    {page}
                </button>
            ))}

            {/* Next Button */}
            <button
                className={`px-4 py-2 border border-l-0 border-gray-300 rounded-r-lg ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'hover:bg-gray-100'
                    }`}
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
            </button>
        </div>
    )
}

export default Pagination