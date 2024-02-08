import React from 'react';

const Pagination = ({ perPage, totalRows, currentPage, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalRows / perPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex justify-center mt-4">
            <nav>
                <ul className="pagination">
                    {pageNumbers.map(number => (
                        <li key={number} className={`mr-2 inline-block ${number === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'} rounded-full`}>
                            <button onClick={() => paginate(number)} className="px-4 py-2 focus:outline-none">
                                {number}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Pagination;
