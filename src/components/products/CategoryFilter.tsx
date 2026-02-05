import clsx from 'clsx';

interface CategoryFilterProps {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={clsx(
          'px-4 py-2 rounded-full text-sm font-medium transition-all',
          selected === null
            ? 'bg-brand-gold text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        )}
      >
        All
      </button>
      
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={clsx(
            'px-4 py-2 rounded-full text-sm font-medium transition-all',
            selected === category
              ? 'bg-brand-gold text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}