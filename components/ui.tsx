import React from "react";

export function Button({
  children,
  onClick,
  className = "",
  variant = "primary",
  disabled = false,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const styles = {
    primary: "bg-emerald-700 text-white hover:bg-emerald-800",
    secondary: "border border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
    danger: "border border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-100",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>{children}</div>;
}

export function Input({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-2 text-right">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

export function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2 text-right">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
      >
        {children}
      </select>
    </label>
  );
}

export function Progress({ value }: { value: number }) {
  const safe = Math.min(100, Math.max(0, value || 0));
  return (
    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full bg-emerald-700 transition-all" style={{ width: `${safe}%` }} />
    </div>
  );
}

export function StatusPill({ status }: { status?: string }) {
  if (status === "done") return <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">تمت القراءة</span>;
  if (status === "excused") return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">اعتذر اليوم</span>;
  return <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">لم يقرأ بعد</span>;
}

export function MiniInfo({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-black text-slate-900">{value}</p>
    </div>
  );
}
