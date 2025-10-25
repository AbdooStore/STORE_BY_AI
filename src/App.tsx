import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";
import { GameCard } from "./components/GameCard";
import { ProductCard } from "./components/ProductCard";
import { OrderForm } from "./components/OrderForm";
import { Id } from "../convex/_generated/dataModel";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50" dir="rtl">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🎮</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">متجر شحن الألعاب</h1>
              <p className="text-sm text-gray-600">شحن سريع وآمن</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span>📱 واتساب: </span>
              <a href="https://wa.me/966539398418" className="text-green-600 font-semibold hover:underline">
                +966539398418
              </a>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Content />
      </main>
      
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">تواصل معنا</h3>
            <a 
              href="https://wa.me/966539398418" 
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors"
            >
              <span>📱</span>
              <span>واتساب: +966539398418</span>
            </a>
          </div>
          <p className="text-gray-400">© 2024 متجر شحن الألعاب - جميع الحقوق محفوظة</p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGame, setSelectedGame] = useState<Id<"games"> | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Id<"products"> | null>(null);
  
  const seedGames = useMutation(api.games.seedGames);
  const allGames = useQuery(api.games.getAllGames);
  const gamesByCategory = useQuery(api.games.getGamesByCategory, 
    selectedCategory !== "all" ? { category: selectedCategory } : "skip"
  );
  const gameProducts = useQuery(api.games.getGameProducts, 
    selectedGame ? { gameId: selectedGame } : "skip"
  );
  const popularProducts = useQuery(api.games.getPopularProducts);

  const games = selectedCategory === "all" ? allGames : gamesByCategory;

  useEffect(() => {
    if (allGames && allGames.length === 0) {
      seedGames();
    }
  }, [allGames, seedGames]);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const categories = [
    { id: "all", name: "جميع الألعاب", icon: "🎮" },
    { id: "mobile", name: "ألعاب الجوال", icon: "📱" },
    { id: "pc", name: "ألعاب الكمبيوتر", icon: "💻" },
    { id: "console", name: "ألعاب الكونسول", icon: "🎯" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
        <h1 className="text-4xl font-bold mb-4">مرحباً بك في متجر شحن الألعاب</h1>
        <p className="text-xl mb-6">شحن سريع وآمن لجميع الألعاب المشهورة</p>
        <div className="flex justify-center items-center gap-2 text-lg">
          <span>⚡</span>
          <span>شحن فوري خلال دقائق</span>
          <span>•</span>
          <span>🔒</span>
          <span>آمن ومضمون</span>
          <span>•</span>
          <span>💬</span>
          <span>دعم عبر واتساب</span>
        </div>
      </div>

      <Unauthenticated>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">سجل دخولك للمتابعة</h2>
            <p className="text-gray-600">قم بتسجيل الدخول لتتمكن من الشراء والمتابعة</p>
          </div>
          <SignInForm />
        </div>
      </Unauthenticated>

      <Authenticated>
        {selectedProduct ? (
          <OrderForm 
            productId={selectedProduct} 
            onBack={() => setSelectedProduct(null)} 
          />
        ) : selectedGame ? (
          <div>
            <button
              onClick={() => setSelectedGame(null)}
              className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <span>←</span>
              <span>العودة للألعاب</span>
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gameProducts?.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onSelect={() => setSelectedProduct(product._id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* المنتجات الشائعة */}
            {popularProducts && popularProducts.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span>🔥</span>
                  <span>المنتجات الأكثر طلباً</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      game={product.game}
                      onSelect={() => setSelectedProduct(product._id)}
                      showGame={true}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* فئات الألعاب */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">تصفح حسب الفئة</h2>
              <div className="flex flex-wrap gap-4 mb-8">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {games?.map((game) => (
                  <GameCard
                    key={game._id}
                    game={game}
                    onSelect={() => setSelectedGame(game._id)}
                  />
                ))}
              </div>
            </section>
          </div>
        )}
      </Authenticated>
    </div>
  );
}
