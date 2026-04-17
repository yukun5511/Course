import { Home, BookOpen, Users, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TabItem {
  id: string
  label: string
  icon: typeof Home
  path: string
}

interface TabBarProps {
  tabs: TabItem[]
  currentTab: string
  onTabChange: (tab: string) => void
}

export function TabBar({ tabs, currentTab, onTabChange }: TabBarProps) {
  return (
    <nav className="tab-bar">
      {tabs.map(tab => {
        const isActive = currentTab === tab.id
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'tab-item',
              isActive && 'tab-item-active'
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
