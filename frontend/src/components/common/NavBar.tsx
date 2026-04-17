import { ChevronLeft, MoreHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface NavBarProps {
  title: string
  showBack?: boolean
  onBack?: () => void
  rightContent?: React.ReactNode
}

export function NavBar({ title, showBack = true, onBack, rightContent }: NavBarProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <header className="nav-bar">
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={handleBack}
            className="p-1 -ml-1 rounded-lg hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <h1 className="text-base font-semibold">{title}</h1>
      
      <div className="flex items-center gap-2">
        {rightContent || (
          <button className="p-1 rounded-lg hover:bg-muted transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  )
}
