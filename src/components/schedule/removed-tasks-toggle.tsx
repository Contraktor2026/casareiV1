type RemovedTasksToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function RemovedTasksToggle({ checked, onChange }: RemovedTasksToggleProps) {
  return (
    <label className="flex items-center gap-3 rounded-full border border-[#f2d6d9] bg-[#fffdf9] px-4 py-2 text-sm text-[#7b6a70]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-[#f2d6d9] accent-[#d4537e]"
      />
      Ver removidas
    </label>
  );
}
