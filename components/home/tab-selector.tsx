export type TabType = 'faqs' | 'analytics' | 'reports' | 'communication'

interface TabSelectorProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function TabSelector({ activeTab, onTabChange }: TabSelectorProps) {
  const tabs = [
    { id: 'faqs' as const, label: 'FAQs' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'reports' as const, label: 'Reports' },
    { id: 'communication' as const, label: 'Communication' }
  ]

  return (
    <div className="flex gap-4 py-2">
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`text-black/80 text-sm rounded-2xl p-2 px-4 w-max cursor-pointer hover:bg-gray-400 border ${
            activeTab === tab.id ? 'bg-blue-100 border-blue-600' : 'bg-gray-100'
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  )
}
