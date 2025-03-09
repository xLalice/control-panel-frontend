import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InquiryStatusBadge } from './InquiryStatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Phone, Mail, MapPin, Package, Truck, User, Building, Clock } from 'lucide-react';
import { Inquiry, InquiryStatus } from '../types';
import { Link } from 'react-router-dom'; // Added for navigation to lead details

interface InquiryDetailsProps {
  inquiry: Inquiry;
  onConvertToLead: (inquiryId: string) => void;
}

export const InquiryDetails: React.FC<InquiryDetailsProps> = ({ inquiry, onConvertToLead }) => {
  // Format dates properly
  const formattedPreferredDate = typeof inquiry.preferredDate === 'string'
    ? new Date(inquiry.preferredDate).toLocaleDateString()
    : inquiry.preferredDate.toLocaleDateString();

  const formattedCreatedAt = typeof inquiry.createdAt === 'string'
    ? new Date(inquiry.createdAt).toLocaleDateString()
    : inquiry.createdAt.toLocaleDateString();

  return (
    <>
      <DialogHeader>
        <div className="flex justify-between items-center">
          <div>
            <DialogTitle className="text-xl">Inquiry Details</DialogTitle>
            <DialogDescription>
              Inquiry #{inquiry.id} - <InquiryStatusBadge status={inquiry.status as InquiryStatus} />
            </DialogDescription>
          </div>
          {/* Conditionally render button based on whether a lead is connected */}
          {inquiry.relatedLeadId ? (
            <Link to={`/leads/${inquiry.relatedLeadId}`}>
              <Button variant="outline">View Connected Lead</Button>
            </Link>
          ) : (
            <Button variant="outline" onClick={() => onConvertToLead(inquiry.id)}>
              Convert to Lead
            </Button>
          )}
        </div>
      </DialogHeader>

      <Tabs defaultValue="details" className="mt-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Name:</span> {inquiry.customerName}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{inquiry.phoneNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{inquiry.email}</span>
                  </div>
                  {inquiry.isCompany && (
                    <div className="mt-4">
                      <h4 className="font-semibold flex items-center mb-1">
                        <Building className="h-5 w-5 mr-2" />
                        Company
                      </h4>
                      <div>
                        <span className="font-medium">Name:</span> {inquiry.companyName}
                      </div>
                      <div>
                        <span className="font-medium">Address:</span> {inquiry.companyAddress}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Order Request
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Product/Service:</span> {inquiry.productType}
                  </div>
                  <div>
                    <span className="font-medium">Quantity:</span> {inquiry.quantity}
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold flex items-center mb-1">
                      <Truck className="h-5 w-5 mr-2" />
                      Delivery Details
                    </h4>
                    <div>
                      <span className="font-medium">Method:</span> {inquiry.deliveryMethod}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{inquiry.deliveryLocation}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{formattedPreferredDate}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">Additional Information</h3>
                <Badge variant="outline">{inquiry.referenceSource}</Badge>
              </div>
              <div className="mt-2">
                <span className="font-medium">Remarks:</span>
                <p className="mt-1 whitespace-pre-line">{inquiry.remarks || "No remarks provided."}</p>
              </div>
              <div className="mt-4 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Created on {formattedCreatedAt}</span>
              </div>
            </CardContent>
          </Card>

          {inquiry.relatedLead && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Connected Lead</h3>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Lead ID:</span> {inquiry.relatedLead.id}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{' '}
                    <Badge>{inquiry.relatedLead.status}</Badge>
                  </div>
                  <div>
                    <span className="font-medium">Contact Person:</span>{' '}
                    {inquiry.relatedLead.contactPerson || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {inquiry.relatedLead.email || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {inquiry.relatedLead.phone || 'N/A'}
                  </div>
                  {inquiry.relatedLead.company && (
                    <div>
                      <span className="font-medium">Company:</span> {inquiry.relatedLead.company.name}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};