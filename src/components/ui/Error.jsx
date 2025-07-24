import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" className="text-red-600" size={32} />
      </div>
      
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
        Something went wrong
      </h3>
      
      <p className="text-neutral-600 text-center mb-6 max-w-md">
        {message || "We encountered an error while loading your data. Please try again."}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} className="flex items-center gap-2">
          <ApperIcon name="RefreshCw" size={16} />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;