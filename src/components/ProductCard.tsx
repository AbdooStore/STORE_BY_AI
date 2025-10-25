import { Doc } from "../../convex/_generated/dataModel";

interface ProductCardProps {
  product: Doc<"products">;
  game?: Doc<"games"> | null;
  onSelect: () => void;
  showGame?: boolean;
}

export function ProductCard({ product, game, onSelect, showGame = false }: ProductCardProps) {
  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200 group relative overflow-hidden"
    >
      {product.isPopular && (
        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
          الأكثر طلباً
        </div>
      )}
      
      {product.originalPrice && (
        <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
          خصم {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
        </div>
      )}

      <div className="p-6">
        {showGame && game && (
          <div className="mb-3 pb-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">{game.nameAr}</span>
          </div>
        )}
        
        <h3 className="font-bold text-xl text-gray-800 mb-2">{product.nameAr}</h3>
        <p className="text-gray-600 text-sm mb-4">{product.descriptionAr}</p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.originalPrice && (
                <span className="text-gray-400 line-through text-sm">
                  {product.originalPrice} {product.currency}
                </span>
              )}
              <span className="text-2xl font-bold text-blue-600">
                {product.price} {product.currency}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>⚡</span>
            <span>التسليم خلال: {product.deliveryTimeAr}</span>
          </div>
          
          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 group-hover:shadow-lg">
            اشتري الآن
          </button>
        </div>
      </div>
    </div>
  );
}
