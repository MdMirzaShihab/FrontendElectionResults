export default function PublicFooter() {
  return (
    <footer className="border-t border-sage-200 dark:border-sage-800 bg-sage-50 dark:bg-sage-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-olive-500 dark:text-olive-400">
          <span>Bangladesh Election Results Tracker</span>
          <span className="text-xs text-olive-400 dark:text-olive-500">
            Demo — Presentation Mode — Not real data
          </span>
        </div>
      </div>
    </footer>
  )
}
