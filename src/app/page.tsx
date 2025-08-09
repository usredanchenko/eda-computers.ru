"use client";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Builds from "@/components/sections/Builds";
import History from "@/components/sections/History";
import Contact from "@/components/sections/Contact";
import ConfiguratorModal from "@/components/ui/ConfiguratorModal";
import CartDrawer from "@/components/ui/CartDrawer";
import { useConfiguratorUI } from "@/store/ui";
export default function Page() {
  const ui = useConfiguratorUI();
  return (
    <main className="pb-20 md:pb-0">
      <Hero />
      <Features />
      <Builds />
      <History />
      <Contact />
      {ui.isConfiguratorOpen && <ConfiguratorModal />}
      {ui.isCartOpen && <CartDrawer />}
    </main>
  );
}