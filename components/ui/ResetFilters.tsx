
const ResetFilters = ({onReset}:{onReset: () => void}) => {
  return (
    <button
        onClick={onReset}
        className="flex items-center gap-2 text-sm text-[#dc2626] hover:text-red-700 transition-colors px-3 py-1"
    >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
        </svg>
        Reset Filters
    </button>
  )
}

export default ResetFilters
