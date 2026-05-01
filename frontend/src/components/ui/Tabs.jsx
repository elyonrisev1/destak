import { useState } from 'react'
import { cn } from '../../utils/helpers'

export default function Tabs({ tabs, defaultTab = 0 }) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <div className="w-full">
      {/* Tab List */}
      <div className="flex border-b border-surface-200 mb-6 overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={tab.id || index}
            onClick={() => setActiveTab(index)}
            className={cn(
              'px-6 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2',
              activeTab === index
                ? 'border-accent text-accent'
                : 'border-transparent text-gray-400 hover:text-white'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {tabs[activeTab]?.content}
      </div>
    </div>
  )
}