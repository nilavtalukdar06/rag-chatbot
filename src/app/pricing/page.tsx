"use client";

import { Navbar } from "@/components/navbar";
import { PricingTable } from "@clerk/nextjs";

export default function PricingPage() {
  return (
    <div className="max-w-3xl mx-auto w-full">
      <Navbar />
      <div className="w-full my-12 p-4">
        <PricingTable />
      </div>
    </div>
  );
}
