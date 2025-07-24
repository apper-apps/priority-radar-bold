import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Inbox", 
  title = "Nothing here yet", 
  description = "Get started by adding your first item.",
  actionLabel,
  onAction 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} className="text-primary-600" size={32} />
      </div>
      
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
        {title}
      </h3>
      
      <p className="text-neutral-600 mb-6 max-w-md">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;