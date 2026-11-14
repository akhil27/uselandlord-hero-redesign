import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 16, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base({ ...props, fill: "currentColor", stroke: "none" })}>
      <path d="M8 5.5v13l10.5-6.5Z" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m5 12.5 4.2 4.2L19 6.8" />
    </svg>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.2 12.2 2.5 2.5 5.2-5.4" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20.2 14.1A8.4 8.4 0 0 1 9.9 3.8 8.5 8.5 0 1 0 20.2 14.1Z" />
    </svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5c.35 3.55 1.95 5.15 5.5 5.5-3.55.35-5.15 1.95-5.5 5.5-.35-3.55-1.95-5.15-5.5-5.5 3.55-.35 5.15-1.95 5.5-5.5Z" />
      <path d="M18.5 14.5c.16 1.58.87 2.29 2.45 2.45-1.58.16-2.29.87-2.45 2.45-.16-1.58-.87-2.29-2.45-2.45 1.58-.16 2.29-.87 2.45-2.45Z" />
    </svg>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M21 3 10.5 13.5" />
      <path d="M21 3 14.5 21l-4-7.5L3 9.5 21 3Z" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6.4 3.8h3l1.4 4-2 1.3a13.4 13.4 0 0 0 6.1 6.1l1.3-2 4 1.4v3a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 4.4 6a2 2 0 0 1 2-2.2Z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m4.5 7.5 7.5 6 7.5-6" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20.4 11.7a8.2 8.2 0 0 1-8.2 8.2 8.6 8.6 0 0 1-3.8-.9L3.9 20l1.1-4.3a8.1 8.1 0 0 1-1-3.9 8.2 8.2 0 0 1 8.2-8.2 8.2 8.2 0 0 1 8.2 8.1Z" />
      <path d="M8.8 7.9c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.9 2c.1.3.1.5-.1.7l-.7.8c.6 1.3 1.7 2.3 3 2.9l.8-.8c.2-.2.4-.3.7-.1l2 .9c.3.1.4.3.4.5v.5c0 .4-.2.7-.6.9-.6.3-1.3.4-2 .2a9.2 9.2 0 0 1-6.9-6.8c-.2-.6-.2-1.1.1-1.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

export function MoreIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="5" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="19" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 20V6.5L12 3l8 3.5V20" />
      <path d="M2.5 20h19M8 9h1.5M8 12.5h1.5M8 16h1.5M14.5 9H16M14.5 12.5H16M14.5 16H16" />
    </svg>
  );
}

export function PulseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 12h4l2.2-6 3.4 12 2.4-6H21" />
    </svg>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m12 3 9 4.8-9 4.8-9-4.8L12 3Z" />
      <path d="m3 12.2 9 4.8 9-4.8M3 16.5l9 4.8 9-4.8" />
    </svg>
  );
}

export function BrandMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="2" y="16" width="3.2" height="9" rx="1.2" fill="#7DC869" />
      <rect x="7.4" y="11.5" width="3.2" height="13.5" rx="1.2" fill="#4C8B41" />
      <rect x="12.8" y="7.5" width="3.2" height="17.5" rx="1.2" fill="#7DC869" />
      <rect x="18.2" y="12.5" width="3.2" height="12.5" rx="1.2" fill="#5FA253" />
      <rect x="23.6" y="5" width="3.2" height="20" rx="1.2" fill="#A9DD79" />
    </svg>
  );
}
