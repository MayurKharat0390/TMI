"use client";

import { useState, useRef } from 'react';
import { Info } from 'lucide-react';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

export function InfoButton() {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 3000);
  };

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <Button
            className="fixed left-4 bottom-4 z-50 rounded-full p-2 hover:scale-110 transition-transform duration-200 hover:ring-2 hover:ring-[#DFBA73] hover:ring-opacity-50"
            size="icon"
            variant="outline"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Info className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-[#DFBA73] transition-all duration-200"
        >
          <p>
            Developed by{' '}
             <a
              href="https://saimehar.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#DFBA73] hover:underline transition-colors duration-200"
            >
              Sai Mehar 
            </a> and {' '}
            <a
              href="https://github.com/Dash074"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#DFBA73] hover:underline transition-colors duration-200"
            >
              Darshan Nair
            </a>.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
