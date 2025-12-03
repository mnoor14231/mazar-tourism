'use client';

export default function ExperiencesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center">
            <span className="text-6xl">✨</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">تجربة</h1>

        {/* Description */}
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-xl text-gray-600">
            تجارب فريدة ومخصصة في المدينة المنورة
          </p>
          <p className="text-gray-500">
            هنا ستُبنى تجارب مخصصة للزوار بناءً على تفضيلاتهم، مع إمكانية حجز
            الفعاليات والأنشطة الخاصة.
          </p>
        </div>

        {/* Placeholder Box */}
        <div className="max-w-3xl mx-auto mt-12">
          <div className="border-4 border-dashed border-teal-200 rounded-2xl p-12 bg-teal-50/30">
            <div className="space-y-4">
              <p className="text-2xl font-semibold text-teal-700">
                قريبًا ستتمكن من تصميم تجربة خاصة بك في المدينة المنورة
              </p>
              <p className="text-gray-600">
                نعمل على توفير تجارب استثنائية لجميع الزوار
              </p>
            </div>

            {/* Features Preview */}
            <div className="grid sm:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-3">👨‍👩‍👧‍👦</div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  تجارب عائلية
                </h3>
                <p className="text-sm text-gray-600">
                  أنشطة مناسبة لجميع أفراد العائلة
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-3">🎭</div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  فعاليات ثقافية
                </h3>
                <p className="text-sm text-gray-600">
                  برامج تعريفية بتاريخ وثقافة المدينة
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-3">📅</div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  حجز مباشر
                </h3>
                <p className="text-sm text-gray-600">
                  احجز تجربتك بسهولة وسرعة
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

