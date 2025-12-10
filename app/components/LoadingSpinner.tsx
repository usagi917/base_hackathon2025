// 読み込み中スピナー（ピクセルスタイル）

'use client';

export function LoadingSpinner({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <output className={`inline-block relative ${sizeClasses[size]} ${className}`} aria-busy="true">
      <span className="absolute inset-0 bg-transparent border-4 border-transparent border-t-black border-r-black animate-spin" style={{ imageRendering: 'pixelated' }} />
      <span className="absolute inset-0 bg-transparent border-4 border-transparent border-t-current border-r-current opacity-50 animate-pulse" />
      <span className="sr-only">Loading...</span>
    </output>
  );
}
