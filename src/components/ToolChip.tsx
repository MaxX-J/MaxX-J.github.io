export default function ToolChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border-[1.5px] border-orange-accent bg-orange-accent/[0.08] px-3.5 py-1.5 text-xs font-medium text-orange-accent sm:text-sm">
      {label}
    </span>
  );
}
