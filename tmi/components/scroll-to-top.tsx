"use client";

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from './ui/button';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return isVisible ? (
    <Button
      className="fixed bottom-4 right-4 z-50 rounded-full p-2 transition-all hover:scale-110"
      onClick={scrollToTop}
      size="icon"
      variant="outline"
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  ) : null;
}