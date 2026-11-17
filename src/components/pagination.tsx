// 檔案位置: components/pagination.tsx

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Props {
  totalPages: number;
  currentPage: number;
  basePath: string;
  searchParams?: Record<string, string>;
}

export function PaginationComponent({ totalPages, currentPage, basePath, searchParams }: Props) {
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${basePath}?${params.toString()}`;
  };

  // 這裡可以加入更複雜的頁碼生成邏輯，但我們先從簡單的開始
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href={createPageURL(currentPage - 1)} 
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
        {pageNumbers.map(page => (
          <PaginationItem key={page}>
            <PaginationLink href={createPageURL(page)} isActive={page === currentPage}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext 
            href={createPageURL(currentPage + 1)}
            aria-disabled={currentPage >= totalPages}
            tabIndex={currentPage >= totalPages ? -1 : undefined}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}