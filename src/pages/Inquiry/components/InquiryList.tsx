import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  getInquiries,
  approveInquiry,
  fulfillInquiry,
  convertInquiryToLead,
} from "@/api/api";
import { Search, MoreHorizontal, Filter } from "lucide-react";
import { InquiryDetails } from "./InquiryDetails";
import { InquiryStatusBadge } from "./InquiryStatusBadge";
import { EnhancedInquiry, InquiryStatus, PaginatedResponse } from "../types";
import { toast } from "react-toastify";
import { CreateQuoteDialog } from "./CreateQuoteDialog";
import { ScheduleInquiryDialog } from "./ScheduleInquiryDialog";
import { InquiryListSkeleton } from "./ui/Skeleton";

const Pagination = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center">{children}</div>
);

const PaginationContent = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center space-x-1">{children}</div>
);

const PaginationItem = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

const PaginationLink = ({
  children,
  isActive,
  href,
  onClick,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  href: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => (
  <Button
    variant={isActive ? "default" : "outline"}
    size="sm"
    className="w-9"
    asChild
  >
    <a href={href} onClick={onClick}>
      {children}
    </a>
  </Button>
);

const PaginationNext = ({
  href,
  onClick,
}: {
  href: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => (
  <Button variant="outline" size="sm" className="w-9" asChild>
    <a href={href} onClick={onClick}>
      ›
    </a>
  </Button>
);

const PaginationPrevious = ({
  href,
  onClick,
}: {
  href: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => (
  <Button variant="outline" size="sm" className="w-9" asChild>
    <a href={href} onClick={onClick}>
      ‹
    </a>
  </Button>
);

const PaginationEllipsis = () => (
  <div className="flex h-9 w-9 items-center justify-center">
    <div className="h-4 w-4">...</div>
  </div>
);

interface InquiryListProps {
  refreshTrigger: number;
}

export function InquiryList({ refreshTrigger }: InquiryListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(
    null
  );
  const [createQuoteDialogOpen, setCreateQuoteDialogOpen] = useState(false);
  const [scheduleInquiryDialogOpen, setScheduleInquiryDialogOpen] =
    useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedInquiryForDetails, setSelectedInquiryForDetails] =
    useState<EnhancedInquiry | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<PaginatedResponse<EnhancedInquiry>>({
    queryKey: ["inquiries", currentPage, statusFilter, refreshTrigger],
    queryFn: async () => {
      const result = await getInquiries({ page: currentPage, status: statusFilter });
      return {
        ...result,
        data: result.data.map(inquiry => ({
          ...inquiry,
          assignedTo: inquiry.assignedTo === null ? undefined : inquiry.assignedTo
        })) as EnhancedInquiry[]
      };
    },
  });

  const filteredInquiries =
    data?.data?.filter(
      (inquiry: EnhancedInquiry) =>
        inquiry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.phoneNumber.includes(searchTerm) ||
        inquiry.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Mutations for workflow actions
  const approveInquiryMutation = useMutation({
    mutationFn: (id: string) => approveInquiry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      toast.success("Inquiry approved successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to approve inquiry");
    },
  });

  const fulfillInquiryMutation = useMutation({
    mutationFn: (id: string) => fulfillInquiry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      toast.success("Inquiry fulfilled successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to fulfill inquiry");
    },
  });

  const handleConvertToLead = async (inquiryId: string) => {
    try {
      await convertInquiryToLead(inquiryId);
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      toast.success("Inquiry converted to lead");
    } catch (error: any) {
      toast.error("Failed to convert inquiry");
    }
  };

  // Handler functions for workflow actions
  const handleApproveInquiry = (inquiryId: string) => {
    approveInquiryMutation.mutate(inquiryId);
  };

  const handleFulfillInquiry = (inquiryId: string) => {
    fulfillInquiryMutation.mutate(inquiryId);
  };

  const openCreateQuoteDialog = (inquiryId: string) => {
    setSelectedInquiryId(inquiryId);
    setCreateQuoteDialogOpen(true);
  };

  const openScheduleInquiryDialog = (inquiryId: string) => {
    setSelectedInquiryId(inquiryId);
    setScheduleInquiryDialogOpen(true);
  };

  const openDetailsDialog = (inquiry: EnhancedInquiry) => {
    setSelectedInquiryForDetails(inquiry);
    setDetailsDialogOpen(true);
  };

  const totalPages = data?.meta?.total ? Math.ceil(data.meta.total / 10) : 1;

  if (isLoading) {
    return (<InquiryListSkeleton />);
  }

  if (isError) {
    return (
      <div className="flex justify-center p-8 text-red-500">
        Error loading inquiries
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Inquiries</CardTitle>
              <CardDescription>
                Manage and track customer inquiries
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inquiries..."
                  className="pl-8 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("New")}>
                    New
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("Quoted")}>
                    Quoted
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("Approved")}>
                    Approved
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("Scheduled")}
                  >
                    Scheduled
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("Fulfilled")}
                  >
                    Fulfilled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Product/Service</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No inquiries found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInquiries.map((inquiry: EnhancedInquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell>
                      <div className="font-medium">{inquiry.customerName}</div>
                      <div className="text-sm text-muted-foreground">
                        {inquiry.email}
                      </div>
                    </TableCell>
                    <TableCell>{inquiry.productType}</TableCell>
                    <TableCell>
                      {new Date(inquiry.preferredDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{inquiry.referenceSource}</Badge>
                    </TableCell>
                    <TableCell>
                      <InquiryStatusBadge
                        status={inquiry.status as InquiryStatus}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openDetailsDialog(inquiry)}
                          >
                            View Details
                          </DropdownMenuItem>
                          {inquiry.status === "New" && (
                            <DropdownMenuItem
                              onClick={() => openCreateQuoteDialog(inquiry.id)}
                            >
                              Create Quote
                            </DropdownMenuItem>
                          )}
                          {inquiry.status === "Quoted" && (
                            <DropdownMenuItem
                              onClick={() => handleApproveInquiry(inquiry.id)}
                            >
                              Approve Inquiry
                            </DropdownMenuItem>
                          )}
                          {inquiry.status === "Approved" && (
                            <DropdownMenuItem
                              onClick={() =>
                                openScheduleInquiryDialog(inquiry.id)
                              }
                            >
                              Schedule Inquiry
                            </DropdownMenuItem>
                          )}
                          {inquiry.status === "Scheduled" && (
                            <DropdownMenuItem
                              onClick={() => handleFulfillInquiry(inquiry.id)}
                            >
                              Fulfill Inquiry
                            </DropdownMenuItem>
                          )}
                          {(inquiry.status === "Fulfilled" ||
                            inquiry.status === "Scheduled") && (
                            <DropdownMenuItem
                              onClick={() => handleConvertToLead(inquiry.id)}
                            >
                              Convert to Lead
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    isActive={currentPage === 1}
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      setCurrentPage(1);
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                {currentPage > 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                {currentPage > 2 && (
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault();
                        setCurrentPage(currentPage - 1);
                      }}
                    >
                      {currentPage - 1}
                    </PaginationLink>
                  </PaginationItem>
                )}
                {currentPage !== 1 && currentPage !== totalPages && (
                  <PaginationItem>
                    <PaginationLink
                      isActive
                      href="#"
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
                        e.preventDefault()
                      }
                    >
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>
                )}
                {currentPage < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault();
                        setCurrentPage(currentPage + 1);
                      }}
                    >
                      {currentPage + 1}
                    </PaginationLink>
                  </PaginationItem>
                )}
                {currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                {totalPages > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      isActive={currentPage === totalPages}
                      href="#"
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault();
                        setCurrentPage(totalPages);
                      }}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                      }
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Modals/Dialogs */}
      {selectedInquiryId && (
        <>
          <CreateQuoteDialog
            open={createQuoteDialogOpen}
            onClose={() => setCreateQuoteDialogOpen(false)}
            inquiryId={selectedInquiryId}
          />

          <ScheduleInquiryDialog
            open={scheduleInquiryDialogOpen}
            onClose={() => setScheduleInquiryDialogOpen(false)}
            inquiryId={selectedInquiryId}
          />
        </>
      )}

      {selectedInquiryForDetails && (
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <InquiryDetails
              inquiry={selectedInquiryForDetails}
              onConvertToLead={() => {
                handleConvertToLead(selectedInquiryForDetails.id);
                setDetailsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}