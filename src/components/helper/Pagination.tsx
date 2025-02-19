import ReactPaginate from 'react-paginate';

interface PaginationProps {
    pageCount: number;
    onPageChange: (selected: number) => void;
    currentPage?: number;
}

export default function Pagination({ pageCount, onPageChange, currentPage = 0 }: PaginationProps) {
    return (
        <ReactPaginate
            previousLabel={
                <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Prev
                </span>
            }
            nextLabel={
                <span className="flex items-center gap-1">
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </span>
            }
            breakLabel="..."
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={(event) => onPageChange(event.selected)}
            forcePage={currentPage}
            containerClassName="flex items-center justify-center gap-2"
            pageClassName="btn btn-ghost hover:btn-primary min-h-8 h-8"
            pageLinkClassName="px-3"
            previousClassName="btn btn-ghost hover:btn-primary min-h-8 h-8"
            nextClassName="btn btn-ghost hover:btn-primary min-h-8 h-8"
            breakClassName="btn btn-ghost min-h-8 h-8"
            activeClassName="!btn-primary text-primary-content"
            disabledClassName="btn-disabled opacity-50 cursor-not-allowed"
            renderOnZeroPageCount={null}
        />
    );
}