import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import MorphOrb, { type MorphOrbProps } from "./components/ui/ai-thiking-orb-and-input";
import DemoOne from "./components/ui/demo";

export {
  EpicThinkIntro,
  mountEpicThinkIntro,
  unmountEpicThinkIntro
} from "./components/intro/EpicThinkIntro";
export type { EpicThinkIntroProps } from "./components/intro/EpicThinkIntro";

export { MorphOrb, DemoOne };
export type { MorphOrbProps };

export function mountMorphOrb(el: HTMLElement, props: MorphOrbProps = {}) {
  const root = ReactDOM.createRoot(el);
  root.render(React.createElement(MorphOrb, props));
  return () => root.unmount();
}
