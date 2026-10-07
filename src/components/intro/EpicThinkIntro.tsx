import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom/client";
import { SparklesCore } from "@/components/ui/sparkles";
import { ArrowRight, Cpu, Sparkles, Zap, Bot, Loader2 } from "lucide-react";

export interface EpicThinkIntroProps {
  onComplete?: () => void;
  onSkip?: () => void;
  autoAdvanceDelay?: number; // In milliseconds, 0 to disable
  className?: string;
  showSkipButton?: boolean;
}

export const EpicThinkIntro: React.FC<EpicThinkIntroProps> = ({
  onComplete,
  onSkip,
  autoAdvanceDelay = 0,
  className = "",
  showSkipButton = false,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [particleDensity, setParticleDensity] = useState(800);
  const completedRef = useRef(false);

  // Responsive particle density calculation to ensure smooth, non-crashing 60fps across devices
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      const width = window.innerWidth;
      if (width < 640) {
        setParticleDensity(320); // Mobile: optimal count to prevent mobile GPU/memory lag or crashes
      } else if (width < 1024) {
        setParticleDensity(600); // Tablet
      } else {
        setParticleDensity(950); // Desktop: rich starry starlight
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Trigger completion -> smooth transition to Login
  const triggerComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsConnecting(true);
    setTimeout(() => {
      if (typeof onComplete === "function") {
        onComplete();
      } else {
        // Internal relative route fallback
        window.location.href = "/login";
      }
    }, 450);
  }, [onComplete]);

  // Trigger skip -> immediate transition
  const triggerSkip = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (typeof onSkip === "function") {
      onSkip();
    } else if (typeof onComplete === "function") {
      onComplete();
    } else {
      window.location.href = "/login";
    }
  }, [onSkip, onComplete]);

  // Optional auto-advance timer (disabled by default)
  useEffect(() => {
    if (autoAdvanceDelay && autoAdvanceDelay > 0) {
      const timer = setTimeout(() => {
        triggerComplete();
      }, autoAdvanceDelay);
      return () => clearTimeout(timer);
    }
  }, [autoAdvanceDelay, triggerComplete]);

  return (
    <div
      className={`epic-think-intro-root relative h-[100dvh] min-h-[100dvh] w-full bg-black text-white flex flex-col justify-center items-center overflow-x-hidden overflow-y-auto sm:overflow-hidden selection:bg-indigo-500 selection:text-white ${className}`}
      role="region"
      aria-label="Epic Think AI Intro"
    >
      {/* Background ambient lighting - soft, cosmic glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] md:w-[800px] h-[200px] sm:h-[350px] md:h-[420px] bg-indigo-600/15 rounded-full blur-[100px] sm:blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[380px] md:w-[450px] h-[150px] sm:h-[220px] md:h-[250px] bg-sky-500/15 rounded-full blur-[90px] sm:blur-[130px] pointer-events-none" />
      <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[420px] md:w-[500px] h-[140px] sm:h-[180px] md:h-[200px] bg-purple-600/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      {/* Main Hero Intro - Fully responsive across mobile, tablet, and desktop */}
      <main className="relative z-20 flex flex-col items-center justify-center px-4 py-3 sm:py-6 w-full max-w-4xl mx-auto text-center my-auto">
        {/* Animated Chroma Title: Epic Think */}
        <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight relative z-20 select-none animate-text-chroma transition-all duration-300 pb-1 sm:pb-2 leading-tight">
          Epic Think
        </h1>

        {/* Laser Light Horizon & Sparkles */}
        <div className="w-full max-w-[280px] xs:max-w-[340px] sm:max-w-xl md:max-w-2xl lg:max-w-3xl h-24 xs:h-28 sm:h-36 md:h-40 relative my-1 sm:my-2">
          {/* Anamorphic core center star flare */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 xs:w-28 sm:w-44 md:w-56 h-[2px] sm:h-[3px] bg-white blur-[0.5px] rounded-full z-10 animate-beam-pulse shadow-[0_0_15px_#fff]" />

          {/* Gradients laser beams with pulsation */}
          <div className="absolute inset-x-0 top-0 mx-auto bg-gradient-to-r from-transparent via-cyan-300 to-transparent h-[1.5px] w-3/4 animate-beam-pulse" />
          <div className="absolute inset-x-0 top-0 mx-auto bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2.5px] sm:h-[3px] w-3/4 blur-[1.5px]" />
          <div className="absolute inset-x-0 top-0 mx-auto bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent h-[3px] sm:h-[4px] w-1/3 blur-sm opacity-80" />
          <div className="absolute inset-x-0 top-0 mx-auto bg-gradient-to-r from-transparent via-sky-300 to-transparent h-px w-1/4" />

          {/* Sparkles Particle Layer (Pure White Starlight Sparkles) */}
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1.2}
            particleDensity={particleDensity}
            className="w-full h-full"
            particleColor="#FFFFFF"
            speed={1.5}
          />

          {/* Radial Gradient Mask to seamlessly fade into deep black */}
          <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)] pointer-events-none" />
        </div>

        {/* High-Impact AI Agent Subtitle */}
        <p className="max-w-xl text-xs xs:text-sm sm:text-base md:text-lg text-neutral-300 font-normal mt-1 sm:mt-2 mb-3 sm:mb-5 leading-relaxed tracking-wide drop-shadow-sm px-2">
          The next-generation{" "}
          <span className="text-white font-semibold underline decoration-cyan-400 decoration-2 underline-offset-4">
            autonomous AI agent
          </span>{" "}
          built for deep cognitive reasoning, instant execution, and superhuman workflow automation.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5 mb-4 sm:mb-6 text-[10px] xs:text-[11px] sm:text-xs text-neutral-400">
          <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-neutral-900/90 border border-neutral-800">
            <Cpu className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-cyan-400" />
            <span>Deep Cognitive Logic</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-neutral-900/90 border border-neutral-800">
            <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-400" />
            <span>Instant Execution</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-neutral-900/90 border border-neutral-800">
            <Bot className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-purple-400" />
            <span>Autonomous Decision Engine</span>
          </div>
        </div>

        {/* Dynamic Color-Changing "Get Started" Button with AI Transition */}
        <div className="relative group z-30 inline-block">
          {/* Outer animated chromatic glow aura that changes colors */}
          <div className="absolute -inset-1 rounded-full blur-xl opacity-80 group-hover:opacity-100 group-hover:blur-2xl transition-all duration-500 animate-button-chroma" />

          {/* Shimmering border wrapper with continuously changing colors */}
          <div className="relative p-[2px] rounded-full animate-button-chroma shadow-2xl">
            {/* Button body with glossy obsidian glass finish */}
            <button
              onClick={triggerComplete}
              disabled={isConnecting}
              className="relative flex items-center gap-2 xs:gap-2.5 sm:gap-3 px-6 py-2.5 xs:px-8 xs:py-3 sm:px-10 sm:py-3.5 rounded-full bg-black/85 backdrop-blur-md text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 group-hover:bg-black/60 active:scale-95 cursor-pointer border border-white/25 hover:border-white/50 disabled:opacity-80"
              aria-label="Get Started with Epic Think AI"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin text-cyan-300" />
                  <span className="drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">
                    Connecting to Agent...
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-300 animate-pulse" />
                  <span className="drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1.5 text-cyan-300" />
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

// Global mount helper for standalone embedding into vanilla or SPA containers
let activeReactRoot: ReactDOM.Root | null = null;

export function mountEpicThinkIntro(
  targetElement: HTMLElement,
  props: EpicThinkIntroProps = {}
): void {
  if (activeReactRoot) {
    try {
      activeReactRoot.unmount();
    } catch {
      // ignore
    }
    activeReactRoot = null;
  }
  const root = ReactDOM.createRoot(targetElement);
  activeReactRoot = root;
  root.render(<EpicThinkIntro {...props} />);
}

export function unmountEpicThinkIntro(): void {
  if (activeReactRoot) {
    try {
      activeReactRoot.unmount();
    } catch {
      // ignore
    }
    activeReactRoot = null;
  }
}

// Bind to window for UMD / vanilla embedding
if (typeof window !== "undefined") {
  (window as any).EpicThinkIntro = {
    Component: EpicThinkIntro,
    mount: mountEpicThinkIntro,
    unmount: unmountEpicThinkIntro,
  };
}

export default EpicThinkIntro;
