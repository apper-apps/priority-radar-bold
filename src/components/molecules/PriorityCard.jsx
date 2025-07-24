import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PriorityCard = ({ priority, onStatusChange, onDelete, showActions = true }) => {
  const statusConfig = {
    todo: { color: "border-l-yellow-500", bg: "bg-yellow-50" },
    "in-progress": { color: "border-l-blue-500", bg: "bg-blue-50" },
    done: { color: "border-l-green-500", bg: "bg-green-50" },
    blocked: { color: "border-l-red-500", bg: "bg-red-50" }
  };

  const config = statusConfig[priority.status] || statusConfig.todo;

  const handleStatusCycle = () => {
    const statusOrder = ["todo", "in-progress", "done"];
    const currentIndex = statusOrder.indexOf(priority.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    onStatusChange(priority.Id, nextStatus);
  };

  return (
    <Card className={cn("border-l-4 card-hover", config.color, config.bg)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-neutral-900 mb-2 truncate">
              {priority.title}
            </h3>
            {priority.description && (
              <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                {priority.description}
              </p>
            )}
            <div className="flex items-center gap-2">
              <Badge variant={priority.status}>
                {priority.status.replace("-", " ").toUpperCase()}
              </Badge>
              <span className="text-xs text-neutral-500">
                {new Date(priority.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          {showActions && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleStatusCycle}
                className="h-8 w-8 p-0"
              >
                <ApperIcon name="RotateCw" size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(priority.Id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriorityCard;