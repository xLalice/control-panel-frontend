import React, { useState } from "react";
import {
  User,
  MapPin,
  Mail,
  Phone,
  Building2,
  FileText,
  Calendar,
  NotebookPen,
} from "lucide-react";
import { SlideInPanel } from "@/components/SlideInPanel/SlideInPanel";
import { Client } from "../../clients.schema";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsList,
  TabsContent,
  TabsTrigger,
  Separator,
  Badge,
  Button,
} from "@/components/ui";
import { ActivitiesTimeline } from "@/components/ActivitiesTImeline/ActivitiesTImeline";
import { ContactHistoryTimeline } from "@/components/ActivitiesTImeline/ContactHistoryTImeline";
import { LogContactModal } from "@/components/LogContactModal";

interface ClientDetailsPanelProps {
  client?: Client;
  isOpen: boolean;
  onClose: () => void;
}

const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  className?: string;
}> = ({ icon, label, value, className = "" }) => {
  if (!value) return null;

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="flex-shrink-0 w-5 h-5 text-gray-500 mt-0.5">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
        <p className="text-sm text-gray-900 break-words">{value}</p>
      </div>
    </div>
  );
};

const AddressDisplay: React.FC<{
  title: string;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
  icon: React.ReactNode;
}> = ({ title, street, city, state, zipCode, country, icon }) => {
  const formatAddress = () => {
    const parts = [
      street,
      [city, state, zipCode].filter(Boolean).join(", "),
      country,
    ].filter(Boolean);
    return parts.join("\n");
  };

  const hasAddress = street || city || state || zipCode || country;

  if (!hasAddress) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 text-gray-600">{icon}</div>
          <h4 className="font-medium text-gray-900">{title}</h4>
        </div>
        <div className="text-sm text-gray-500 italic">No address provided</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 text-gray-600">{icon}</div>
        <h4 className="font-medium text-gray-900">{title}</h4>
      </div>
      <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
        {formatAddress()}
      </div>
    </div>
  );
};

export const ClientDetailsPanel: React.FC<ClientDetailsPanelProps> = ({
  client,
  isOpen,
  onClose,
}) => {
  if (!client) return null;

  const [isLogContactModalOpen, setIsLogContactModalOpen] = useState(false);

  const clientName = client.clientName;
  const initials = clientName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const navigate = useNavigate();

  const handleOpenLogContactModal = () => {
    setIsLogContactModalOpen(true);
  };

  const handleCloseLogContactModal = () => {
    setIsLogContactModalOpen(false);
  };

  const headerContent = (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
        {initials}
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-1">{clientName}</h2>
        <div className="flex items-center gap-3">
          <Badge
            variant={client.status === "Active" ? "default" : "secondary"}
            className="bg-white/20 text-white border-white/30"
          >
            {client.status}
          </Badge>
          {client.company && (
            <span className="text-blue-100 text-sm">{client.company.name}</span>
          )}
        </div>
      </div>
      <Button
        onClick={handleOpenLogContactModal}
        variant="secondary"
        className="bg-white/20 text-white hover:bg-white/30"
      >
        <NotebookPen className="mr-2 h-4 w-4" />
        Log Contact
      </Button>
    </div>
  );

  return (
    <>
      <SlideInPanel
        isOpen={isOpen}
        onClose={onClose}
        headerContent={headerContent}
      >
        <Tabs defaultValue="details">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activities">Activity Timeline</TabsTrigger>
            <TabsTrigger value="contact">Contact History</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="space-y-8">
              {/* Contact Information */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <InfoRow
                    icon={<Mail />}
                    label="Email Address"
                    value={client.primaryEmail}
                  />
                  <InfoRow
                    icon={<Phone />}
                    label="Phone Number"
                    value={client.primaryPhone}
                  />
                  <InfoRow
                    icon={<Building2 />}
                    label="Company"
                    value={client.company?.name}
                  />
                </div>
              </section>

              <Separator />

              {/* Address Information */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Address Information
                </h3>
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                  <AddressDisplay
                    title="Billing Address"
                    street={client.billingAddressStreet}
                    city={client.billingAddressCity}
                    state={client.billingAddressRegion}
                    zipCode={client.billingAddressPostalCode}
                    country={client.billingAddressCountry}
                    icon={<Building2 className="w-4 h-4" />}
                  />
                  <AddressDisplay
                    title="Shipping Address"
                    street={client.shippingAddressStreet}
                    city={client.shippingAddressCity}
                    state={client.shippingAddressRegion}
                    zipCode={client.shippingAddressPostalCode}
                    country={client.shippingAddressCountry}
                    icon={<MapPin className="w-4 h-4" />}
                  />
                </div>
              </section>

              {/* Notes Section */}
              {client.notes && (
                <>
                  <Separator />
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Notes
                    </h3>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {client.notes}
                      </p>
                    </div>
                  </section>
                </>
              )}

              {/* Metadata */}
              <Separator />
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Account Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      Created
                    </p>
                    <p className="text-sm text-gray-900">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      Last Updated
                    </p>
                    <p className="text-sm text-gray-900">
                      {new Date(client.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {client.isActive !== undefined && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        Active Status
                      </p>
                      <p className="text-sm text-gray-900">
                        {client.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  )}
                  {client.convertedFromLeadId && (
                    <div
                      className="bg-gray-50 rounded-lg p-3 cursor-pointer"
                      onClick={() =>
                        navigate("/leads/", {
                          state: { leadIdToOpen: client.convertedFromLeadId },
                        })
                      }
                    >
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        Converted from Lead
                      </p>
                      <p className="text-sm text-gray-900 font-mono">
                        {client.convertedFromLeadId}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </TabsContent>
          <TabsContent value="activities">
            <ActivitiesTimeline entityId={client.id} entityType="Client" />
          </TabsContent>
          <TabsContent value="contact">
            <ContactHistoryTimeline entityId={client.id} entityType="Client" />
          </TabsContent>
        </Tabs>
      </SlideInPanel>

      {isLogContactModalOpen && (
        <LogContactModal
          isOpen={isLogContactModalOpen}
          onClose={handleCloseLogContactModal}
          entityId={client.id}
          entityType="Client"
        />
      )}
    </>
  );
};
