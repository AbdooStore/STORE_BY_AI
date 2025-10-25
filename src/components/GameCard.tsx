import { Doc } from "../../convex/_generated/dataModel";

interface GameCardProps {
  game: Doc<"games">;
  onSelect: () => void;
}

export function GameCard({ game, onSelect }: GameCardProps) {
  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-blue-200 group"
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={game.image}
          alt={game.nameAr}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2">{game.nameAr}</h3>
        <p className="text-gray-600 text-sm mb-3">{game.descriptionAr}</p>
        <div className="flex items-center justify-between">
          <span className="text-blue-600 font-semibold">اختر المنتج</span>
          <span className="text-2xl">→</span>
        </div>
      </div>
    </div>
  );
}
