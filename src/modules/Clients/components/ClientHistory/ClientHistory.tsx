import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { apiClient } from "@/api/api";
import { ActivityLogItem, ContactHistoryItem } from "./clientHistory.types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import { getMethodColor, getMethodIcon, getActionColor } from "./clientHistory.utils";
import { Activity, MessageSquare, Search, User, Clock } from "lucide-react";
import {format} from 'date-fns';

interface InteractionHistoryProps {
  clientId?: string;
  clientName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const InteractionHistoryDialog: React.FC<InteractionHistoryProps> = ({
  clientId,
  clientName,
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string>("all");
  const [selectedAction, setSelectedAction] = useState<string>("all");

  const { data: contactHistory, isLoading: contactHistoryLoading } = useQuery<ContactHistoryItem[]>({
    queryKey: ["interactionHistory", clientId],
    enabled: isOpen && !!clientId,
    queryFn: async () => {
      const response = await apiClient.get(`/clients/${clientId}/contact-history`);
      return response.data;
    },
  });

  const { data: activityLog, isLoading: activityLogLoading } = useQuery<ActivityLogItem[]>({
    queryKey: ["activityLog", clientId],
    enabled: isOpen && !!clientId,
    queryFn: async () => {
      const response = await apiClient.get(`/clients/${clientId}/activity-log`);
      return response.data;
    },
  });

  const filteredContactHistory = contactHistory?.filter(item => {
    const matchesSearch = 
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.outcome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMethod = selectedMethod === "all" || item.method.toLowerCase() === selectedMethod;
    
    return matchesSearch && matchesMethod;
  });

  const filteredActivityLog = activityLog?.filter(item => {
    const matchesSearch = 
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = selectedAction === "all" || item.action.toLowerCase() === selectedAction;
    
    return matchesSearch && matchesAction;
  });

  const uniqueMethods = Array.from(new Set(contactHistory?.map(item => item.method.toLowerCase())));
  const uniqueActions = Array.from(new Set(activityLog?.map(item => item.action.toLowerCase())));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Interaction History - {clientName}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="contact" className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="contact" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Contact History ({filteredContactHistory?.length})
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Activity Log ({filteredActivityLog?.length})
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search interactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <TabsContent value="contact" className="flex-1 overflow-hidden">
              <div className="flex gap-4 mb-4">
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Methods</option>
                  {uniqueMethods.map(method => (
                    <option key={method} value={method}>
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {contactHistoryLoading ? (
                    <div className="text-center py-8 text-gray-500">Loading...</div>
                  ) : filteredContactHistory?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No contact history found
                    </div>
                  ) : (
                    filteredContactHistory?.map((item) => (
                      <Card key={item.id} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge className={`flex items-center gap-1 ${getMethodColor(item.method)}`}>
                                {getMethodIcon(item.method)}
                                {item.method}
                              </Badge>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="w-4 h-4" />
                                {item.user.name}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              {format(new Date(item.timestamp), 'MMM dd, yyyy HH:mm')}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div>
                              <h4 className="font-medium text-gray-900">Summary</h4>
                              <p className="text-gray-700">{item.summary}</p>
                            </div>
                            {item.outcome && (
                              <div>
                                <h4 className="font-medium text-gray-900">Outcome</h4>
                                <p className="text-gray-700">{item.outcome}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="activity" className="flex-1 overflow-hidden">
              <div className="flex gap-4 mb-4">
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Actions</option>
                  {uniqueActions.map(action => (
                    <option key={action} value={action}>
                      {action.charAt(0).toUpperCase() + action.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {activityLogLoading ? (
                    <div className="text-center py-8 text-gray-500">Loading...</div>
                  ) : filteredActivityLog?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No activity log found
                    </div>
                  ) : (
                    filteredActivityLog?.map((item) => (
                      <Card key={item.id} className="border-l-4 border-l-green-500">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge className={`${getActionColor(item.action)}`}>
                                {item.action.replace('_', ' ').toUpperCase()}
                              </Badge>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="w-4 h-4" />
                                {item.user.name}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              {format(new Date(item.createdAt), 'MMM dd, yyyy HH:mm')}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div>
                              <h4 className="font-medium text-gray-900">Description</h4>
                              <p className="text-gray-700">{item.description}</p>
                            </div>
                            {item.metadata && Object.keys(item.metadata).length > 0 && (
                              <div>
                                <h4 className="font-medium text-gray-900">Details</h4>
                                <div className="bg-gray-50 p-3 rounded-md">
                                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {JSON.stringify(item.metadata, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};