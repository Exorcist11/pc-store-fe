"use client";
import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface ProductTabsProps {
  tabs: Tab[];
}

export default function ProductTabs({ tabs }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="mt-8">
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 font-semibold ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={activeTab === tab.id ? "block" : "hidden"}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
