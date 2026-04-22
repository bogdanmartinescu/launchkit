import Link from "next/link";

/**
 * Inline SVG replicas of the Apple App Store and Google Play Store download
 * badges. Self-hosted so we have no external runtime dependency and can tint
 * them to match the current theme.
 *
 * Both badges render as native links when `href` is provided; when it's empty
 * they render as inert buttons so the template stays deployable without store
 * URLs configured yet.
 */

type BadgeProps = {
  href?: string;
  className?: string;
  /**
   * "light" (default) = dark pill with white text — reads well on any
   *                     background. Matches Apple/Google brand guidelines.
   * "outline"        = transparent pill with currentColor outline. Useful on
   *                    already-dark brand-tinted backgrounds.
   */
  variant?: "light" | "outline";
  ariaLabel?: string;
};

const base =
  "inline-flex items-center gap-2.5 h-14 px-5 rounded-xl transition-all duration-200 select-none";

function wrapperStyle(variant: BadgeProps["variant"]): React.CSSProperties {
  if (variant === "outline") {
    return {
      background: "transparent",
      border: "1.5px solid currentColor",
      color: "inherit",
    };
  }
  return {
    background: "#000",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
  };
}

export function AppStoreBadge({ href, className, variant = "light", ariaLabel }: BadgeProps) {
  const content = (
    <>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="w-7 h-7 flex-shrink-0"
        fill="currentColor"
      >
        <path d="M17.564 12.77c-.025-2.532 2.069-3.74 2.163-3.802-1.177-1.723-3.014-1.958-3.667-1.986-1.562-.159-3.05.921-3.845.921-.794 0-2.019-.899-3.32-.874-1.71.025-3.285.994-4.167 2.526-1.776 3.075-.454 7.627 1.28 10.122.847 1.22 1.858 2.588 3.189 2.54 1.28-.053 1.764-.827 3.314-.827 1.548 0 1.984.827 3.336.801 1.379-.025 2.253-1.243 3.098-2.468.977-1.418 1.379-2.79 1.403-2.86-.03-.014-2.694-1.033-2.72-4.092l-.064-.001zM15.02 5.319c.712-.862 1.193-2.061 1.063-3.253-1.026.042-2.267.683-3.002 1.545-.66.761-1.236 1.976-1.081 3.148 1.144.091 2.313-.58 3.02-1.44z" />
      </svg>
      <div className="flex flex-col items-start leading-none">
        <span className="text-[10px] font-medium opacity-80">Download on the</span>
        <span className="text-[18px] font-semibold tracking-tight mt-0.5">App Store</span>
      </div>
    </>
  );

  const style = wrapperStyle(variant);
  const cls = `${base} hover:opacity-90 ${className ?? ""}`;

  if (!href) {
    return (
      <span
        role="button"
        aria-label={ariaLabel ?? "Download on the App Store"}
        aria-disabled="true"
        className={`${cls} cursor-not-allowed opacity-60`}
        style={style}
      >
        {content}
      </span>
    );
  }

  const external = /^https?:\/\//.test(href);
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel ?? "Download on the App Store"}
      className={cls}
      style={style}
    >
      {content}
    </Link>
  );
}

export function PlayStoreBadge({ href, className, variant = "light", ariaLabel }: BadgeProps) {
  const content = (
    <>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="w-7 h-7 flex-shrink-0"
      >
        <defs>
          <linearGradient id="gplay-a" x1="21.8" y1="33.29" x2="5.018" y2="16.508" gradientTransform="matrix(1 0 0 -1 0 26)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#00a0ff" />
            <stop offset=".007" stopColor="#00a1ff" />
            <stop offset=".26" stopColor="#00beff" />
            <stop offset=".512" stopColor="#00d2ff" />
            <stop offset=".76" stopColor="#00dfff" />
            <stop offset="1" stopColor="#00e3ff" />
          </linearGradient>
          <linearGradient id="gplay-b" x1="21.19" y1="21.77" x2="-2.98" y2="21.77" gradientTransform="matrix(1 0 0 -1 0 26)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffe000" />
            <stop offset=".409" stopColor="#ffbd00" />
            <stop offset=".775" stopColor="orange" />
            <stop offset="1" stopColor="#ff9c00" />
          </linearGradient>
          <linearGradient id="gplay-c" x1="23.46" y1="19.88" x2="3.524" y2="-.056" gradientTransform="matrix(1 0 0 -1 0 26)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ff3a44" />
            <stop offset="1" stopColor="#c31162" />
          </linearGradient>
          <linearGradient id="gplay-d" x1="5.068" y1="39.23" x2="13.97" y2="30.328" gradientTransform="matrix(1 0 0 -1 0 26)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#32a071" />
            <stop offset=".069" stopColor="#2da771" />
            <stop offset=".476" stopColor="#15cf74" />
            <stop offset=".801" stopColor="#06e775" />
            <stop offset="1" stopColor="#00f076" />
          </linearGradient>
        </defs>
        <path d="M3.609 1.814a1.994 1.994 0 0 0-.473 1.406v17.561c0 .554.182 1.017.486 1.392l.061.053L13.49 12.46v-.208L3.683 1.75z" fill="url(#gplay-a)" />
        <path d="M17.043 15.627l-3.553-3.375v-.208l3.555-3.486.08.053 4.209 2.396c1.203.683 1.203 1.799 0 2.482l-4.209 2.388z" fill="url(#gplay-b)" />
        <path d="M17.123 15.574l-3.633-3.468L3.609 22.13c.396.42 1.051.472 1.789.053z" fill="url(#gplay-c)" />
        <path d="M17.123 8.625L5.398 1.97c-.738-.42-1.393-.368-1.789.053l9.881 10.034z" fill="url(#gplay-d)" />
      </svg>
      <div className="flex flex-col items-start leading-none">
        <span className="text-[10px] font-medium opacity-80">GET IT ON</span>
        <span className="text-[18px] font-semibold tracking-tight mt-0.5">Google Play</span>
      </div>
    </>
  );

  const style = wrapperStyle(variant);
  const cls = `${base} hover:opacity-90 ${className ?? ""}`;

  if (!href) {
    return (
      <span
        role="button"
        aria-label={ariaLabel ?? "Get it on Google Play"}
        aria-disabled="true"
        className={`${cls} cursor-not-allowed opacity-60`}
        style={style}
      >
        {content}
      </span>
    );
  }

  const external = /^https?:\/\//.test(href);
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel ?? "Get it on Google Play"}
      className={cls}
      style={style}
    >
      {content}
    </Link>
  );
}

/**
 * Convenience: render both badges in a responsive row.
 */
export function StoreBadgesRow({
  appStoreUrl,
  playStoreUrl,
  variant = "light",
  className,
}: {
  appStoreUrl?: string;
  playStoreUrl?: string;
  variant?: BadgeProps["variant"];
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className ?? ""}`}>
      <AppStoreBadge href={appStoreUrl} variant={variant} />
      <PlayStoreBadge href={playStoreUrl} variant={variant} />
    </div>
  );
}
