import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAttendance } from "../hooks/useAttendance";
import { AllowedIP } from "../types";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";

interface IPManagementProps {
  userId?: string;
}

export const IPManagement: React.FC<IPManagementProps> = ({ userId }) => {
  const [newIP, setNewIP] = useState("");
  const [description, setDescription] = useState("");
  const { useAllowedIPsQuery, useManageAllowedIPsMutation } = useAttendance();

  const { data: allowedIPs = [], isLoading } = useAllowedIPsQuery(userId);
  const manageIPsMutation = useManageAllowedIPsMutation();

  const handleAddIP = () => {
    if (!newIP) {
      toast.error("Please enter an IP address");
      return;
    }

    // Simple IP validation
    const ipRegex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(newIP)) {
      toast.error("Please enter a valid IP address");
      return;
    }

    manageIPsMutation.mutate(
      {
        action: "add",
        ipAddress: newIP,
        userId: userId || "",
        description: description,
      },
      {
        onSuccess: () => {
          setNewIP("");
          setDescription("");
        },
      }
    );
  };

  const handleDeleteIP = (ip: AllowedIP) => {
    manageIPsMutation.mutate({
      action: "remove",
      ipAddress: ip.ipAddress,
      userId: ip.userId,
      id: ip.id,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>IP Whitelist Management</CardTitle>
        <CardDescription>
          Manage allowed IP addresses for employee login
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ipAddress">IP Address</Label>
              <Input
                id="ipAddress"
                placeholder="e.g., 192.168.1.1"
                value={newIP}
                onChange={(e) => setNewIP(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="e.g., Office WiFi"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleAddIP} disabled={manageIPsMutation.isPending}>
            Add IP Address
          </Button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Allowed IP Addresses</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP Address</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Added Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : allowedIPs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No allowed IP addresses found
                  </TableCell>
                </TableRow>
              ) : (
                allowedIPs.map((ip) => (
                  <TableRow key={ip.id}>
                    <TableCell>{ip.ipAddress}</TableCell>
                    <TableCell>{ip.description || "N/A"}</TableCell>
                    <TableCell>
                      {new Date(ip.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteIP(ip)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
