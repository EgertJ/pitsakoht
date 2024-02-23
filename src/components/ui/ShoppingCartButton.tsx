"use client";
import React, { useState, useEffect } from "react";
import ShoppingCart from "./ShoppingCart";

export default function ShoppingCartButton() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 10) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <ShoppingCart
          className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50"
          icon
        />
      )}
    </>
  );
}
