import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface OrderFormProps {
  productId: Id<"products">;
  onBack: () => void;
}

export function OrderForm({ productId, onBack }: OrderFormProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    gameUsername: "",
    gameId: "",
    additionalInfo: "",
  });

  const createOrder = useMutation(api.orders.createOrder);
  const product = useQuery(api.games.getGameProducts, "skip");
  
  // الحصول على تفاصيل المنتج
  const allProducts = useQuery(api.games.getPopularProducts);
  const currentProduct = allProducts?.find(p => p._id === productId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerPhone || !formData.gameUsername) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      const orderId = await createOrder({
        productId,
        ...formData,
      });

      // إنشاء رسالة واتساب
      const whatsappMessage = `
🎮 *طلب شحن جديد*

📋 *تفاصيل الطلب:*
• رقم الطلب: ${orderId}
• المنتج: ${currentProduct?.nameAr}
• السعر: ${currentProduct?.price} ${currentProduct?.currency}

👤 *بيانات العميل:*
• الاسم: ${formData.customerName}
• الهاتف: ${formData.customerPhone}
• الإيميل: ${formData.customerEmail || "غير محدد"}

🎯 *بيانات اللعبة:*
• اسم المستخدم: ${formData.gameUsername}
• معرف اللعبة: ${formData.gameId || "غير محدد"}
• معلومات إضافية: ${formData.additionalInfo || "لا توجد"}

⏰ *وقت التسليم المتوقع:* ${currentProduct?.deliveryTimeAr}
      `.trim();

      const whatsappUrl = `https://wa.me/966539398418?text=${encodeURIComponent(whatsappMessage)}`;
      
      toast.success("تم إنشاء الطلب بنجاح! سيتم تحويلك لواتساب لإتمام الطلب");
      
      // فتح واتساب بعد ثانيتين
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 2000);
      
      onBack();
    } catch (error) {
      toast.error("حدث خطأ في إنشاء الطلب");
      console.error(error);
    }
  };

  if (!currentProduct) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">جاري تحميل تفاصيل المنتج...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
      >
        <span>←</span>
        <span>العودة</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">تأكيد الطلب</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">المنتج:</span> {currentProduct.nameAr}</p>
            <p><span className="font-semibold">السعر:</span> {currentProduct.price} {currentProduct.currency}</p>
            <p><span className="font-semibold">وقت التسليم:</span> {currentProduct.deliveryTimeAr}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الاسم الكامل *
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أدخل اسمك الكامل"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                رقم الهاتف *
              </label>
              <input
                type="tel"
                required
                value={formData.customerPhone}
                onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+966xxxxxxxxx"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="example@email.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                اسم المستخدم في اللعبة *
              </label>
              <input
                type="text"
                required
                value={formData.gameUsername}
                onChange={(e) => setFormData({...formData, gameUsername: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="اسم المستخدم"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                معرف اللعبة (إن وجد)
              </label>
              <input
                type="text"
                value={formData.gameId}
                onChange={(e) => setFormData({...formData, gameId: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Player ID"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              معلومات إضافية
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="أي معلومات إضافية تريد إضافتها..."
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-yellow-600 text-xl">⚠️</span>
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">تنبيه مهم:</p>
                <p>بعد الضغط على "تأكيد الطلب" سيتم تحويلك لواتساب لإتمام عملية الدفع والشحن. تأكد من صحة جميع البيانات قبل المتابعة.</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>📱</span>
            <span>تأكيد الطلب والمتابعة عبر واتساب</span>
          </button>
        </form>
      </div>
    </div>
  );
}
