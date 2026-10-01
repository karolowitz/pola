import { Component, type ErrorInfo, type ReactNode } from "react";
import { C } from "@/design/tokens";

type Props = { children: ReactNode };
type State = { error: Error | null };

/** Pusty ekran to najgorszy możliwy błąd prototypu — łapiemy i pokazujemy co się stało. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[Pola] Błąd renderowania:", error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div style={{ padding: "64px 28px", maxWidth: 640, margin: "0 auto" }}>
        <h1 className="serif-display" style={{ fontSize: 30, color: C.ink }}>Coś się posypało.</h1>
        <p style={{ fontSize: 14, color: C.inkSoft, marginTop: 10, lineHeight: 1.5 }}>
          Ten ekran nie mógł się wyrenderować. Szczegóły poniżej.
        </p>
        <pre style={{
          marginTop: 16, padding: 14, background: C.sand, borderRadius: 12,
          fontSize: 11.5, color: C.rust, whiteSpace: "pre-wrap", overflow: "auto", maxHeight: 280,
        }}>{error.message}</pre>
        <button onClick={() => this.setState({ error: null })} style={{
          marginTop: 18, padding: "14px 22px", background: C.mustard,
          color: C.ink, borderRadius: 12, fontSize: 14.5, fontWeight: 700, minHeight: 44,
        }}>Spróbuj ponownie</button>
      </div>
    );
  }
}
