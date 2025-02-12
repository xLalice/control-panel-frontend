import React, { useState } from "react";
import { createReport } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Report } from "@/types";

interface ReportFormProps {
  onAdd: (newReport: Report) => void;
} 

export default function ReportForm({ onAdd }: ReportFormProps) {
  const [form, setForm] = useState({ date: "", department: "", taskDetails: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!form.date || !form.department || !form.taskDetails.trim()) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const newReport = await createReport(form);
      onAdd(newReport);
      setForm({ date: "", department: "", taskDetails: "" });
    } catch (err) {
      setError("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg p-6 rounded-lg">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Submit a Report</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Field */}
          <div className="flex flex-col">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>

          {/* Department Dropdown */}
          <div className="flex flex-col">
            <Label>Department</Label>
            <Select
              name="department"
              onValueChange={(value) => setForm({ ...form, department: value })}
            >
              <SelectTrigger className="w-full mt-1">Select Department</SelectTrigger>
              <SelectContent>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Task Details */}
          <div className="flex flex-col">
            <Label htmlFor="taskDetails">Task Details</Label>
            <Input
              id="taskDetails"
              name="taskDetails"
              type="text"
              value={form.taskDetails}
              onChange={handleChange}
              placeholder="Enter task details..."
              required
              className="mt-1"
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
