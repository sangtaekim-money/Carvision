// Pagination.js (you can add this component)
import React from 'react';

const Pagination = ({ loadMore }) => {
    return (
        <div className="pagination">
            <button onClick={loadMore}>Load More</button>
        </div>
    );
};

export default Pagination;
