import React from "react";

interface QuickChipsProps {
  chips: string[];
  onChipClick: (chip: string) => void;
}

export const QuickChips: React.FC<QuickChipsProps> = ({
  chips,
  onChipClick,
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
      {chips.map((chip) => (
        <button
          key={chip}
          onClick={() => onChipClick(chip)}
          className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors bg-green-50 text-green-700 hover:bg-green-100"
        >
          {chip}
        </button>
      ))}
    </div>
  );
};
