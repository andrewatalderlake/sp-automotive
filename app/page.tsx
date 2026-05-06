import { Header } from "./components/sections/Header";
import { Hero } from "./components/sections/Hero";
import { DrivingSection } from "./components/sections/DrivingSection";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <Hero />
      <DrivingSection />
    </main>
  );
}
