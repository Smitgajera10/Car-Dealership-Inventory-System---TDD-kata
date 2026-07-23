import { useAuth } from '../contexts/AuthContext';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6D5DFB] text-white shadow-2xl shadow-[#6D5DFB]/50 border border-white/20 hover:scale-110 hover:bg-[#5B4BE3] transition-all duration-200 group"
      title="Add New Vehicle Inventory"
    >
      <svg className="h-7 w-7 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
}
