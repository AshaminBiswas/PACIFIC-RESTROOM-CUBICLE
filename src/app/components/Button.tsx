import { motion, HTMLMotionProps } from "motion/react";
import { forwardRef } from "react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", size = "md", className = "", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl transition-all duration-300 font-medium";
    
    const variants = {
      primary: "bg-[#7FB706] text-white hover:bg-[#6fa005] hover:shadow-lg hover:shadow-[#7FB706]/20",
      secondary: "bg-[#B5F823] text-[#030213] hover:bg-[#a5e813] hover:shadow-lg hover:shadow-[#B5F823]/20",
      outline: "border-2 border-[#7FB706] text-[#7FB706] hover:bg-[#7FB706] hover:text-white",
      ghost: "text-[#7FB706] hover:bg-[#E9FDBF]",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
