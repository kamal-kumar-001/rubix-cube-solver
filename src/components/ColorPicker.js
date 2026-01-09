const COLORS = [
  { key: 'W', class: 'bg-white border' },
  { key: 'Y', class: 'bg-yellow-400' },
  { key: 'G', class: 'bg-green-500' },
  { key: 'B', class: 'bg-blue-500' },
  { key: 'O', class: 'bg-orange-500' },
  { key: 'R', class: 'bg-red-500' },
];

export default function ColorPicker({ selected, onSelect }) {
  return (
    <div className="flex gap-2 justify-center">
      {COLORS.map(c => (
        <button
          key={c.key}
          onClick={() => onSelect(c.key)}
          className={`
            w-8 h-8 rounded border-2
            ${c.class}
            ${selected === c.key ? 'border-black scale-110' : 'border-transparent'}
          `}
        />
      ))}
    </div>
  );
}
