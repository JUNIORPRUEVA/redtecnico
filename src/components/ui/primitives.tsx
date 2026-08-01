import * as React from "react";
import { cn } from "@/lib/utils";

/* ============================================
   Card
   ============================================ */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-xl border border-gray-200 bg-white shadow-sm", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 p-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-gray-500", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center p-5 pt-0", className)} {...props} />;
}

/* ============================================
   Label
   ============================================ */
export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-sm font-medium leading-none text-gray-800", className)}
      {...props}
    />
  );
}

/* ============================================
   Badge
   ============================================ */
type BadgeVariant = "default" | "secondary" | "success" | "warning" | "destructive" | "info" | "outline";

const badgeVariants: Record<BadgeVariant, string> = {
  default: "bg-blue-100 text-blue-800 border-blue-200",
  secondary: "bg-gray-100 text-gray-700 border-gray-200",
  success: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-amber-100 text-amber-800 border-amber-200",
  destructive: "bg-red-100 text-red-800 border-red-200",
  info: "bg-cyan-100 text-cyan-800 border-cyan-200",
  outline: "bg-white text-gray-700 border-gray-300",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

/* ============================================
   Textarea
   ============================================ */
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

/* ============================================
   Skeleton
   ============================================ */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-gray-200", className)} {...props} />;
}

/* ============================================
   Separator
   ============================================ */
export function Separator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("h-px w-full bg-gray-200", className)} {...props} />;
}

/* ============================================
   Progress
   ============================================ */
export function Progress({ value = 0, className }: { value?: number; className?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-gray-200", className)}>
      <div
        className="h-full rounded-full bg-blue-700 transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

/* ============================================
   Avatar
   ============================================ */
export function Avatar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200", className)}
      {...props}
    />
  );
}

export function AvatarFallback({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex h-full w-full items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-800", className)}
      {...props}
    />
  );
}

/* ============================================
   Switch
   ============================================ */
export function Switch({
  checked,
  onCheckedChange,
  disabled,
  className,
  "aria-label": ariaLabel,
}: {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-blue-700" : "bg-gray-300",
        className
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

/* ============================================
   Checkbox
   ============================================ */
export function Checkbox({
  checked,
  onCheckedChange,
  disabled,
  className,
  "aria-label": ariaLabel,
}: {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "border-blue-700 bg-blue-700 text-white" : "border-gray-300 bg-white",
        className
      )}
    >
      {checked && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

/* ============================================
   Radio Group
   ============================================ */
export function RadioGroup({
  value,
  onValueChange,
  className,
  children,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div role="radiogroup" className={cn("flex flex-col gap-2", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement<{ value?: string; checked?: boolean; onSelect?: () => void }>(child)) {
          return React.cloneElement(child, {
            checked: child.props.value === value,
            onSelect: () => onValueChange?.(child.props.value ?? ""),
          });
        }
        return child;
      })}
    </div>
  );
}

export function RadioGroupItem({
  value: _value,
  checked,
  onSelect,
  className,
  children,
}: {
  value: string;
  checked?: boolean;
  onSelect?: () => void;
  className?: string;
  children?: React.ReactNode;
}) {

  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        checked ? "border-blue-700 bg-blue-50" : "border-gray-300 bg-white hover:bg-gray-50",
        className
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
          checked ? "border-blue-700" : "border-gray-400"
        )}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-blue-700" />}
      </span>
      {children}
    </button>
  );
}

/* ============================================
   Tabs
   ============================================ */
export function Tabs({
  value: _value,
  onValueChange: _onValueChange,
  className,
  children,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("w-full", className)}>{children}</div>;
}


export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1", className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({
  value: _value,
  active,
  onClick,
  className,
  children,
}: {
  value: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) {

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        active ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mt-4", className)}>{children}</div>;
}

/* ============================================
   Dialog (modal)
   ============================================ */
export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange?.(false)}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white shadow-xl">
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function DialogHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function DialogTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h2 className={cn("text-lg font-semibold", className)}>{children}</h2>;
}

export function DialogDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn("text-sm text-gray-500", className)}>{children}</p>;
}

export function DialogFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mt-6 flex justify-end gap-2", className)}>{children}</div>;
}

/* ============================================
   Sheet (bottom sheet / sidebar)
   ============================================ */
export function Sheet({
  open,
  onOpenChange,
  side = "bottom",
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "bottom" | "right" | "left";
  children: React.ReactNode;
}) {
  if (!open) return null;
  const position =
    side === "bottom"
      ? "items-end"
      : side === "right"
      ? "justify-end"
      : "justify-start";
  return (
    <div className={`fixed inset-0 z-50 flex ${position}`}>
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange?.(false)}
        aria-hidden="true"
      />
      <div
        className={`relative z-10 bg-white shadow-xl ${
          side === "bottom"
            ? "w-full max-h-[85vh] overflow-y-auto rounded-t-2xl"
            : "h-full w-full max-w-sm overflow-y-auto"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export function SheetHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("p-5 pb-2", className)}>{children}</div>;
}

export function SheetTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h2 className={cn("text-lg font-semibold", className)}>{children}</h2>;
}

export function SheetDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn("text-sm text-gray-500", className)}>{children}</p>;
}

export function SheetContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

/* ============================================
   Alert Dialog
   ============================================ */
export function AlertDialog({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={() => onOpenChange?.(false)} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">{children}</div>
    </div>
  );
}

export function AlertDialogTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h2 className={cn("text-lg font-semibold", className)}>{children}</h2>;
}

export function AlertDialogDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn("mt-2 text-sm text-gray-500", className)}>{children}</p>;
}

export function AlertDialogFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mt-6 flex justify-end gap-2", className)}>{children}</div>;
}

/* ============================================
   Select (simple)
   ============================================ */
export function Select({
  value,
  onValueChange,
  className,
  children,
  placeholder,
  disabled,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onValueChange?.(e.target.value)}
      disabled={disabled}
      className={cn(
        "flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >

      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
  );
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>;
}

/* ============================================
   Tooltip (simple)
   ============================================ */
export function Tooltip({ content, children }: { content: string; children: React.ReactNode }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
        {content}
      </span>
    </span>
  );
}

/* ============================================
   Scroll Area
   ============================================ */
export function ScrollArea({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("overflow-y-auto", className)}>{children}</div>;
}

/* ============================================
   Popover (simple)
   ============================================ */
export function Popover({
  open,
  onOpenChange,
  trigger,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div onClick={() => onOpenChange?.(!open)}>{trigger}</div>
      {open && (
        <div className="absolute z-50 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
}

/* ============================================
   Accordion
   ============================================ */
export function Accordion({ type: _type = "single", className, children }: { type?: "single" | "multiple"; className?: string; children: React.ReactNode }) {
  return <div className={cn("w-full", className)}>{children}</div>;
}

export function AccordionItem({ value: _value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  return <div className={cn("border-b", className)}>{children}</div>;
}


export function AccordionTrigger({
  onClick,
  className,
  children,
}: {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("flex w-full items-center justify-between py-4 text-left text-sm font-medium", className)}
    >
      {children}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function AccordionContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("pb-4 text-sm text-gray-600", className)}>{children}</div>;
}

/* ============================================
   Dropdown Menu (simple)
   ============================================ */
export function DropdownMenu({
  open,
  onOpenChange,
  trigger,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div onClick={() => onOpenChange?.(!open)}>{trigger}</div>
      {open && (
        <div className="absolute right-0 z-50 mt-2 min-w-[180px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownMenuItem({
  onClick,
  className,
  children,
}: {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100", className)}
    >
      {children}
    </button>
  );
}

/* ============================================
   Toast (simple)
   ============================================ */
export function Toast({
  open,
  title,
  description,
  variant = "default",
}: {
  open?: boolean;
  title: string;
  description?: string;
  variant?: "default" | "success" | "destructive";
}) {
  if (!open) return null;
  const bg =
    variant === "success" ? "bg-green-600" : variant === "destructive" ? "bg-red-600" : "bg-gray-900";
  return (
    <div className="fixed bottom-20 left-1/2 z-[60] -translate-x-1/2">
      <div className={`${bg} rounded-lg px-4 py-3 text-white shadow-lg`}>
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="mt-1 text-xs opacity-90">{description}</p>}
      </div>
    </div>
  );
}
