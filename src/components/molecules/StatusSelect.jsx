import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const StatusSelect = ({ value, onChange, className }) => {
  const statuses = [
    { value: "todo", label: "To Do", icon: "Circle", color: "text-yellow-600" },
    { value: "in-progress", label: "In Progress", icon: "Clock", color: "text-blue-600" },
    { value: "done", label: "Done", icon: "CheckCircle", color: "text-green-600" },
    { value: "blocked", label: "Blocked", icon: "AlertCircle", color: "text-red-600" }
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "flex h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200",
        className
      )}
    >
      {statuses.map((status) => (
        <option key={status.value} value={status.value}>
          {status.label}
        </option>
      ))}
    </select>
  );
};

export default StatusSelect;