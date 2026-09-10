"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type Variant = "primary" | "secondary" | "ghost";

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  icon?: boolean;
  event?: string;
  eventProps?: Record<string, string | number | boolean>;
}

type LinkProps = CommonProps & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "href" | "className" | "children"
  >;

type ButtonProps = CommonProps & { href?: undefined } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "children"
  >;

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-teal text-ink hover:bg-teal-soft outline-teal",
  secondary:
    "border border-border text-paper hover:border-teal hover:text-teal outline-teal",
  ghost: "text-paper hover:text-teal outline-teal",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

export function Button(props: LinkProps | ButtonProps) {
  const {
    children,
    variant = "primary",
    className = "",
    icon = false,
    event,
    eventProps,
    ...rest
  } = props;

  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`;

  const handleClick = () => {
    if (event) trackEvent(event, eventProps);
  };

  if ("href" in props && props.href) {
    const { href, onClick, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };
    return (
      <Link
        href={href}
        className={classes}
        onClick={(e) => {
          handleClick();
          onClick?.(e);
        }}
        {...anchorRest}
      >
        {children}
        {icon && <ArrowRight className="size-4" aria-hidden="true" />}
      </Link>
    );
  }

  const { onClick, ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      className={classes}
      onClick={(e) => {
        handleClick();
        onClick?.(e);
      }}
      {...buttonRest}
    >
      {children}
      {icon && <ArrowRight className="size-4" aria-hidden="true" />}
    </button>
  );
}
