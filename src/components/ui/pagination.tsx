import * as React from 'react'
import {
    ChevronFirstIcon,
    ChevronLastIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    MoreHorizontalIcon,
} from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
    return (
        <nav
            role="navigation"
            aria-label="pagination"
            data-slot="pagination"
            className={cn('mx-auto flex w-full justify-center', className)}
            {...props}
        />
    )
}

function PaginationContent({
    className,
    ...props
}: React.ComponentProps<'ul'>) {
    return (
        <ul
            data-slot="pagination-content"
            className={cn('flex flex-row items-center gap-1', className)}
            {...props}
        />
    )
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
    return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
    isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
    React.ComponentProps<'a'>

function PaginationLink({
    className,
    isActive,
    size = 'icon',
    ...props
}: PaginationLinkProps) {
    return (
        <a
            aria-current={isActive ? 'page' : undefined}
            data-slot="pagination-link"
            data-active={isActive}
            className={cn(
                buttonVariants({
                    variant: isActive ? 'outline' : 'ghost',
                    size,
                }),
                className
            )}
            {...props}
        />
    )
}

function PaginationPrevious({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) {
    return (
        <PaginationLink
            aria-label="Go to previous page"
            size="default"
            className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
            {...props}>
            <ChevronLeftIcon />
            <span className="hidden sm:block">Previous</span>
        </PaginationLink>
    )
}

function PaginationNext({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) {
    return (
        <PaginationLink
            aria-label="Go to next page"
            size="default"
            className={cn('gap-1 px-2.5 sm:pr-2.5', className)}
            {...props}>
            <span className="hidden sm:block">Next</span>
            <ChevronRightIcon />
        </PaginationLink>
    )
}

function PaginationEllipsis({
    className,
    ...props
}: React.ComponentProps<'span'>) {
    return (
        <span
            aria-hidden
            data-slot="pagination-ellipsis"
            className={cn('flex size-9 items-center justify-center', className)}
            {...props}>
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">More pages</span>
        </span>
    )
}

interface PaginationWithSelectProps {
    currentPage: number
    pages: number
    onPageChange: (page: number) => void
}
function PaginationWithSelect({
    pages,
    currentPage,
    onPageChange,
}: PaginationWithSelectProps) {
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationLink
                        onClick={(e) => {
                            e.preventDefault()
                            onPageChange(1)
                        }}
                        href="#"
                        aria-label="Go to first page"
                        size="icon"
                        className="rounded-full">
                        <ChevronFirstIcon className="size-4" />
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink
                        onClick={(e) => {
                            e.preventDefault()

                            if (currentPage === 1) {
                                return
                            }
                            onPageChange(currentPage - 1)
                        }}
                        href="#"
                        aria-label="Go to previous page"
                        size="icon"
                        className="rounded-full">
                        <ChevronLeftIcon className="size-4" />
                    </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                    <Select
                        defaultValue={String(1)}
                        value={String(currentPage)}
                        aria-label="Select page"
                        onValueChange={(page) => onPageChange(Number(page))}>
                        <SelectTrigger
                            id="select-page"
                            className="w-fit whitespace-nowrap"
                            aria-label="Select page">
                            <SelectValue placeholder="Select page" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: pages }, (_, i) => i + 1).map(
                                (page) => (
                                    <SelectItem key={page} value={String(page)}>
                                        Page {page}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink
                        onClick={(e) => {
                            e.preventDefault()

                            if (currentPage === pages) {
                                return
                            }
                            onPageChange(currentPage + 1)
                        }}
                        href="#"
                        aria-label="Go to next page"
                        size="icon"
                        className="rounded-full">
                        <ChevronRightIcon className="size-4" />
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink
                        onClick={(e) => {
                            e.preventDefault()
                            onPageChange(pages)
                        }}
                        href="#"
                        aria-label="Go to last page"
                        size="icon"
                        className="rounded-full">
                        <ChevronLastIcon className="size-4" />
                    </PaginationLink>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export {
    Pagination,
    PaginationContent,
    PaginationLink,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
    PaginationWithSelect,
}
