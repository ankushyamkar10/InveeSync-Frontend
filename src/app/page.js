'use client'
import Image from "next/image";
import Sidebar from "./components/Sidebar";
import PendingSetup from "./components/PendingSetup";
import Landing from "./components/Landing";
import { useState } from "react";

export default function Home() {
  const [activeItem, setActiveItem] = useState("Tenant Configuration");

  console.log(activeItem)

  return (
    <div className="bg-white flex justify-between md:h-screen flex-col md:flex-row">
      <div className="md:w-[80%] flex md:items-center flex-col md:flex-row">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem}/>
        <Landing activeItem={activeItem} setActiveItem={setActiveItem}/>
      </div>
      <PendingSetup />
    </div>
  );
}
