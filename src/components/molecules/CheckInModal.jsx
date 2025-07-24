import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CheckInModal = ({ isOpen, onClose, onSubmit, existingPriorities = [] }) => {
  const [priorities, setPriorities] = useState(
    existingPriorities.length > 0 ? existingPriorities : [{ title: "", description: "" }]
  );
  const [mood, setMood] = useState("neutral");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moods = [
    { value: "focused", label: "Focused", icon: "Zap", color: "text-green-600" },
    { value: "neutral", label: "Neutral", icon: "Minus", color: "text-neutral-600" },
    { value: "struggling", label: "Struggling", icon: "AlertTriangle", color: "text-red-600" }
  ];

  const addPriority = () => {
    if (priorities.length < 3) {
      setPriorities([...priorities, { title: "", description: "" }]);
    }
  };

  const removePriority = (index) => {
    setPriorities(priorities.filter((_, i) => i !== index));
  };

  const updatePriority = (index, field, value) => {
    const updated = [...priorities];
    updated[index][field] = value;
    setPriorities(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const validPriorities = priorities.filter(p => p.title.trim());
    if (validPriorities.length === 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit({
        priorities: validPriorities,
        mood,
        note: note.trim() || null
      });
      onClose();
    } catch (error) {
      console.error("Check-in failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl"
        >
          <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 font-display">
                  Daily Check-in
                </h2>
                <p className="text-sm text-neutral-600 mt-1">
                  Set your priorities for today (1-3 focuses)
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <ApperIcon name="X" size={18} />
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Today's Priorities
              </label>
              <div className="space-y-4">
                {priorities.map((priority, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-neutral-200 rounded-lg p-4 bg-neutral-50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-3">
                        <Input
                          placeholder={`Priority ${index + 1} title...`}
                          value={priority.title}
                          onChange={(e) => updatePriority(index, "title", e.target.value)}
                          required={index === 0}
                        />
                        <Textarea
                          placeholder="Optional description or notes..."
                          value={priority.description}
                          onChange={(e) => updatePriority(index, "description", e.target.value)}
                          rows={2}
                        />
                      </div>
                      {priorities.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePriority(index)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {priorities.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPriority}
                  className="mt-3 w-full"
                >
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Add Priority ({priorities.length}/3)
                </Button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                How are you feeling?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {moods.map((moodOption) => (
                  <button
                    key={moodOption.value}
                    type="button"
                    onClick={() => setMood(moodOption.value)}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200",
                      mood === moodOption.value
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                    )}
                  >
                    <ApperIcon name={moodOption.icon} size={18} className={moodOption.color} />
                    <span className="text-sm font-medium">{moodOption.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Additional Notes (Optional)
              </label>
              <Textarea
                placeholder="Any additional thoughts, blockers, or context for today..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !priorities.some(p => p.title.trim())}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Check" size={16} className="mr-2" />
                    Complete Check-in
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckInModal;