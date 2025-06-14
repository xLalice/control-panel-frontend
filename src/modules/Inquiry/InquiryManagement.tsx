import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InquiryList } from './components/InquiryList/InquiryList';
import { AddInquiryForm } from './InquiryCreateForm/AddInquiryForm';
import InquiryStats from './components/InquiryStats';
export function InquiryManagement() {
  const [activeTab, setActiveTab] = useState('list');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleInquiryAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('list');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Inquiry Management</h2>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Inquiry List</TabsTrigger>
            <TabsTrigger value="add">Add Inquiry</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="space-y-4">
            <InquiryList refreshTrigger={refreshTrigger} />
          </TabsContent>
          <TabsContent value="add" className="space-y-4">
            <AddInquiryForm onInquiryAdded={handleInquiryAdded} />
          </TabsContent>
          <TabsContent value="stats" className="space-y-4">
            <InquiryStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}