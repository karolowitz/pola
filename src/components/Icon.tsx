type IconName =
  | "map" | "cart" | "user" | "search" | "back" | "forward" | "heart" | "heartOn"
  | "phone" | "plus" | "minus" | "close" | "trash" | "pin" | "star" | "check"
  | "sort" | "bell" | "leaf" | "sparkle" | "clock" | "edit" | "globe" | "warn";

type Props = {
  name: IconName;
  size?: number;
  stroke?: number;
  color?: string;
};

export function Icon({ name, size = 20, stroke = 1.5, color = "currentColor" }: Props) {
  const p = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: color, strokeWidth: stroke,
    strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
    "aria-hidden": true, focusable: "false" as const,
  };
  switch (name) {
    case "map": return <svg {...p}><path d="M9 6L3 4v14l6 2 6-2 6 2V6l-6-2-6 2zM9 6v14M15 6v14"/></svg>;
    case "cart": return <svg {...p}><path d="M3 4h2l1.5 13a1 1 0 001 1h11a1 1 0 001-.8L21 8H6"/><circle cx="9" cy="21" r="1"/><circle cx="18" cy="21" r="1"/></svg>;
    case "user": return <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.5 3.5-8 8-8s8 3.5 8 8"/></svg>;
    case "search": return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
    case "back": return <svg {...p}><path d="M15 18l-6-6 6-6"/></svg>;
    case "forward": return <svg {...p}><path d="M9 18l6-6-6-6"/></svg>;
    case "heart": return <svg {...p}><path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5 6 5c2 0 3.5 1 4 2 .5-1 2-2 4-2 3.5 0 5 4 3.5 7-2.5 4.5-9.5 9-9.5 9z"/></svg>;
    case "heartOn": return <svg {...p} fill={color}><path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5 6 5c2 0 3.5 1 4 2 .5-1 2-2 4-2 3.5 0 5 4 3.5 7-2.5 4.5-9.5 9-9.5 9z"/></svg>;
    case "phone": return <svg {...p}><path d="M22 16.9v3a2 2 0 01-2.2 2 19 19 0 01-8.3-2.9 19 19 0 01-6-6 19 19 0 01-3-8.4A2 2 0 014.5 3h3a2 2 0 012 1.7 12 12 0 00.7 2.8 2 2 0 01-.5 2L8.4 11a16 16 0 006 6l1.5-1.3a2 2 0 012-.4 12 12 0 002.8.6 2 2 0 011.7 2z"/></svg>;
    case "plus": return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case "minus": return <svg {...p}><path d="M5 12h14"/></svg>;
    case "close": return <svg {...p}><path d="M18 6L6 18M6 6l12 12"/></svg>;
    case "trash": return <svg {...p}><path d="M4 7h16M10 7V5a1 1 0 011-1h2a1 1 0 011 1v2M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13"/></svg>;
    case "pin": return <svg {...p}><path d="M12 22s-7-7-7-12a7 7 0 1114 0c0 5-7 12-7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>;
    case "star": return <svg {...p} fill={color}><path d="M12 2l3 7 7 .8-5.2 5 1.5 7L12 18l-6.3 3.8L7.2 15 2 10l7-.8L12 2z"/></svg>;
    case "check": return <svg {...p}><path d="M5 12l5 5 10-10"/></svg>;
    case "sort": return <svg {...p}><path d="M7 4v16M7 20l-3-3M7 20l3-3M17 20V4M17 4l-3 3M17 4l3 3"/></svg>;
    case "bell": return <svg {...p}><path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9zM10 21a2 2 0 004 0"/></svg>;
    case "leaf": return <svg {...p}><path d="M11 20A7 7 0 014 13V8a5 5 0 015-5h6a5 5 0 015 5v5a7 7 0 01-7 7h-1zM11 20V8"/></svg>;
    case "sparkle": return <svg {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/></svg>;
    case "clock": return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "edit": return <svg {...p}><path d="M17 3a2.8 2.8 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;
    case "globe": return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 010 18 15 15 0 010-18z"/></svg>;
    case "warn": return <svg {...p}><path d="M12 3l9.5 17H2.5L12 3z"/><path d="M12 10v4M12 17.5v.1"/></svg>;
  }
}

export type { IconName };
