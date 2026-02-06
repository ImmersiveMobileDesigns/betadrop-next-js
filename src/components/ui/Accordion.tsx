"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ question, answer, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className="group glass rounded-2xl overflow-hidden mb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-6 text-left cursor-pointer focus:outline-none"
      >
        <h3 className="text-lg font-medium text-white pr-4">{question}</h3>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-white/40 transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 text-white/60 leading-relaxed border-t border-white/5 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AccordionProps {
  items: { q: string; a: string }[];
  className?: string;
}


import { StaggerContainer, StaggerItem } from '../animations/Stagger';

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <StaggerContainer className={className}>
      {items.map((item, index) => (
        <StaggerItem key={index}>
          <AccordionItem
            question={item.q}
            answer={item.a}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
          />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
