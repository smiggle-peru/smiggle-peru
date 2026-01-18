function Icon({
  type,
}: {
  type: "shield" | "support" | "fast" | "check";
}) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.03]">
      {type === "shield" && (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3z"
            stroke="black"
            strokeWidth="1.5"
          />
          <path
            d="M9 12l2 2 4-4"
            stroke="black"
            strokeWidth="1.5"
          />
        </svg>
      )}

      {type === "support" && (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2a7 7 0 00-7 7v4a3 3 0 003 3h1v-6H8V9a4 4 0 118 0v1h-1v6h1a3 3 0 003-3V9a7 7 0 00-7-7z"
            stroke="black"
            strokeWidth="1.5"
          />
        </svg>
      )}

      {type === "fast" && (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 12h13l-3-3m3 3l-3 3"
            stroke="black"
            strokeWidth="1.5"
          />
          <circle cx="19" cy="12" r="2" stroke="black" strokeWidth="1.5" />
        </svg>
      )}

      {type === "check" && (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12l4 4L19 6"
            stroke="black"
            strokeWidth="1.8"
          />
        </svg>
      )}
    </div>
  );
}
