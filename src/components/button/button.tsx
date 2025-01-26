import React, { CSSProperties } from "react";

type ButtonVariant = 
  | "simple"
  | "outline"
  | "ghost"
  | "gradient"
  | "slide-fill"
  | "ghost-heavy"
  | "ghost-side-fill"
  | "secondary"
  | "fill";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  href?: string;
  target?: string;
  rel?: string;
  variant?: ButtonVariant;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> & 
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function Button({
  children,
  onClick,
  className = "",
  style,
  disabled,
  type = "button",
  href,
  target,
  rel,
  variant,
  ...props
}: ButtonProps) {
  const baseClasses = "font-semibold py-2 px-4 rounded-lg transition-all duration-300";

  const variantClasses: Record<ButtonVariant, string> = {
    simple: "bg-blue-500 hover:bg-boldcol",
    secondary: "bg-transparent text-blue-500 hover:bg-blue-500 hover:text-white border-2 border-blue",
    outline: "border border-muted-foreground hover:border-[#00ADB5] hover:bg-[#00ADB5] hover:text-foreground",
    ghost: "text-foreground hover:bg-[#00ADB5]/20",
    gradient: "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white",
    "slide-fill": "relative overflow-hidden bg-foreground rounded-md text-[#000] dark:text-background hover:text-background group",
    "ghost-side-fill": "relative overflow-hidden bg-transparent p-0.5 rounded-md border-2 hover:border-transparent border-neutral-500/10 text-[#000] text-foreground hover:text-background group",
    fill: "bg-transparent hover:bg-blue-500 text-background hover:text-white border-2 border-blue-500",
    "ghost-heavy": "text-foreground hover:bg-muted-foreground/20 hover:text-foreground",
  };

  const buttonClasses = `${baseClasses} ${variant ? variantClasses[variant] : ""} ${className}`;

  const content = (
    <>
      {(variant === "slide-fill" || variant === "ghost-side-fill") && (
        <span className="absolute inset-0 bg-gradient-to-tr from-[#00ADB5] to-[#00dfa0] transform -skew-x-12 -translate-x-[110%] transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:skew-x-0"></span>
      )}
      <span className="relative z-10">{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={`${buttonClasses} inline-block`}
        style={style}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={buttonClasses}
      style={style}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {content}
    </button>
  );
}
