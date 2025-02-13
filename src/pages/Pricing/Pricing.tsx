import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  SortingState,
} from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Equipment, Steel, Aggregate } from "@/types";
import EquipmentView from "./components/EquipmentView";
import SteelView from "./components/SteelView";
import AggregateView from "./components/AggregatesView";
import { apiClient } from "@/api/api";


export interface TableViewProps<T> {
  data: T[];
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
}


// Main Dashboard Component
const PricingDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("equipment");
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["items", selectedCategory],
    queryFn: async () => {
      const response = await apiClient(`/prices/${selectedCategory}`);
      return response.data;
    },
  });

  const filteredItems = items.filter((item: Equipment | Steel | Aggregate) => {
    if (selectedCategory === "steel") {
      const steelItem = item as Steel;
      return (
        steelItem.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
        steelItem.grade.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      const equipmentItem = item as Equipment;
      return equipmentItem.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  const renderCategoryView = () => {
    switch (selectedCategory) {
      case "equipment":
        return (
          <EquipmentView
            data={filteredItems}
            sorting={sorting}
            setSorting={setSorting}
          />
        );
      case "steel":
        return (
          <SteelView
            data={filteredItems}
            sorting={sorting}
            setSorting={setSorting}
          />
        );
      case "aggregates":
        return (
          <AggregateView
            data={filteredItems}
            sorting={sorting}
            setSorting={setSorting}
          />
        );
      default:
        return (
          <EquipmentView
            data={filteredItems}
            sorting={sorting}
            setSorting={setSorting}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setSelectedCategory("equipment")}
              className={`w-full text-left px-4 py-2 rounded ${
                selectedCategory === "equipment"
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100"
              }`}
            >
              Equipment
            </button>
            <button
              onClick={() => setSelectedCategory("steel")}
              className={`w-full text-left px-4 py-2 rounded ${
                selectedCategory === "steel"
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100"
              }`}
            >
              Steel
            </button>
            <button
              onClick={() => setSelectedCategory("aggregates")}
              className={`w-full text-left px-4 py-2 rounded ${
                selectedCategory === "aggregates"
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100"
              }`}
            >
              Aggregates
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedCategory.charAt(0).toUpperCase() +
                selectedCategory.slice(1)}{" "}
              Pricing
            </CardTitle>
            <div className="flex gap-4 mt-4">
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                Loading...
              </div>
            ) : (
              renderCategoryView()
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PricingDashboard;
