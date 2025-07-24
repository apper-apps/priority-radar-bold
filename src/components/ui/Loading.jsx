import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="space-y-6">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl border border-neutral-200 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-200 animate-pulse" />
              <div className="flex-1">
                <div className="h-3 bg-neutral-200 rounded animate-pulse mb-2" />
                <div className="h-6 bg-neutral-200 rounded animate-pulse w-16" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="bg-white rounded-xl border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-neutral-200 rounded animate-pulse" />
            <div className="h-5 bg-neutral-200 rounded animate-pulse w-32" />
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="border border-neutral-200 rounded-lg p-4 bg-neutral-50"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-neutral-200 rounded animate-pulse" />
                  <div className="h-3 bg-neutral-200 rounded animate-pulse w-3/4" />
                  <div className="flex items-center gap-2">
                    <div className="h-5 bg-neutral-200 rounded-full animate-pulse w-16" />
                    <div className="h-3 bg-neutral-200 rounded animate-pulse w-20" />
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="w-8 h-8 bg-neutral-200 rounded animate-pulse" />
                  <div className="w-8 h-8 bg-neutral-200 rounded animate-pulse" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;