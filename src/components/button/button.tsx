"use client"

import type React from "react"
import type { CSSProperties } from "react"

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "gradient"
  | "slide-fill"
  | "ghost-heavy"
  | "ghost-side-fill"
  | "danger"
  | "success"
  | "neutral"
  | "blue"
  | "purple"
  | "amber"
  | "info"

type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  style?: CSSProperties
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  href?: string
  target?: string
  rel?: string
  variant?: ButtonVariant
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>

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
  variant = "primary",
  ...props
}: ButtonProps) {
  const baseClasses = "font-semibold py-2 px-4 rounded-lg transition-all duration-300"

  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-primary dark:hover:bg-primary/80 dark:text-primary-foreground",
    secondary: "bg-secondary hover:bg-secondary/90 text-secondary-foreground dark:bg-secondary dark:hover:bg-secondary/80 dark:text-secondary-foreground",
    outline: "border border-border hover:bg-background/10 text-foreground dark:border-border dark:hover:bg-background/20 dark:text-foreground",
    ghost: "text-foreground hover:bg-muted/30 dark:text-foreground dark:hover:bg-muted/40",
    gradient: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-teal-500 hover:to-emerald-500 text-white dark:text-white",
    "slide-fill": "relative overflow-hidden bg-foreground rounded-md text-background hover:text-background group dark:bg-foreground dark:text-background",
    "ghost-side-fill":
      "relative overflow-hidden bg-transparent p-0.5 rounded-md border-2 hover:border-transparent border-border text-foreground hover:text-background group dark:border-border dark:text-foreground dark:hover:text-background",
    "ghost-heavy": "text-foreground hover:bg-muted/40 hover:text-foreground dark:text-foreground dark:hover:bg-muted/50",
    danger: "bg-destructive hover:bg-destructive/90 text-destructive-foreground dark:bg-destructive dark:hover:bg-destructive/80 dark:text-destructive-foreground",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600",
    neutral: "bg-zinc-700 hover:bg-zinc-600 text-zinc-100 dark:bg-zinc-600 dark:hover:bg-zinc-500 dark:text-zinc-100",
    blue: "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600",
    purple: "bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-500 dark:hover:bg-violet-600",
    amber: "bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-600",
    info: "bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500 dark:hover:bg-sky-600",
  };  

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`

  const content = (
    <>
      {(variant === "slide-fill" || variant === "ghost-side-fill") && (
        <span className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-teal-500 transform -skew-x-12 -translate-x-[110%] transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:skew-x-0"></span>
      )}
      <span className="relative z-10">{children}</span>
    </>
  )

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={`${buttonClasses} inline-block`} style={style} {...props}>
        {content}
      </a>
    )
  }

  return (
    <button className={buttonClasses} style={style} onClick={onClick} disabled={disabled} type={type} {...props}>
      {content}
    </button>
  )
}

