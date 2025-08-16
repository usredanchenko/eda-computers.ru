'use client';

import { motion } from 'framer-motion';

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{
    id: string;
    label: string;
    count: number;
    icon: string;
  }>;
}

export default function AdminTabs({ activeTab, onTabChange, tabs }: AdminTabsProps) {
  return (
    <div className="flex space-x-1 mb-6 bg-dark-900/50 backdrop-blur-sm p-1 rounded-xl border border-neon-cyan/20">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            activeTab === tab.id
              ? 'bg-gradient-to-r from-neon-cyan to-neon-pink text-dark-950 font-semibold shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-dark-800/50'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-lg">{tab.icon}</span>
          <span className="hidden sm:block">{tab.label}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            activeTab === tab.id
              ? 'bg-dark-950/20 text-dark-950'
              : 'bg-dark-700 text-gray-300'
          }`}>
            {tab.count}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

