import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/DashbaordLayout";

import { getCategories } from "../../services/clothingServices";
import { calculateClothingValue } from "../../services/valueServices";

const ValueCalculator = () => {
  // ------------------------------------
  // STATE
  // ------------------------------------

  const [categories, setCategories] = useState([]);

  const [categoryId, setCategoryId] = useState("");
  const [brand, setBrand] = useState("");
  const [clothingCondition, setClothingCondition] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const {user} = localStorage.getItem("user");
  // ------------------------------------
  // LOAD CATEGORIES
  // ------------------------------------

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);

        const response = await getCategories();

        if (response.data.success) {
          setCategories(response.data.categories || []);
        }
      } catch (error) {
        console.log("LOAD CATEGORIES ERROR:", error);

        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // ------------------------------------
  // CALCULATE VALUE
  // ------------------------------------

  const handleCalculate = async () => {
    if (!categoryId) {
      toast.error("Please select a category");

      return;
    }

    if (!clothingCondition) {
      toast.error("Please select clothing condition");

      return;
    }

    try {
      setCalculating(true);

      const response = await calculateClothingValue({
        category_id: Number(categoryId),

        brand: brand.trim(),

        clothing_condition: clothingCondition,
      });

      if (response.data.success) {
        setResult(response.data);

        toast.success("Swap value calculated successfully");
      }
    } catch (error) {
      console.log("VALUE CALCULATION ERROR:", error);

      toast.error(
        error.response?.data?.message || "Failed to calculate swap value",
      );
    } finally {
      setCalculating(false);
    }
  };

  // ------------------------------------
  // RESET
  // ------------------------------------

  const handleReset = () => {
    setCategoryId("");
    setBrand("");
    setClothingCondition("");
    setResult(null);
  };

  // ------------------------------------
  // UI
  // ------------------------------------

  return (
    <DashboardLayout showNavbar={true} user={user}>
      <div className="mx-auto max-w-5xl">
        {/* -------------------------------- */}
        {/* PAGE HEADER */}
        {/* -------------------------------- */}

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Swap Value Calculator
          </h1>

          <p className="mt-2 text-gray-500">
            Estimate the fair swap value of your clothing based on its category,
            brand and condition.
          </p>
        </div>

        {/* -------------------------------- */}
        {/* MAIN CARD */}
        {/* -------------------------------- */}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* ============================== */}
          {/* INPUT SECTION */}
          {/* ============================== */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Clothing Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter the details of your clothing item.
            </p>

            <div className="mt-6 space-y-5">
              {/* CATEGORY */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Category
                </label>

                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setResult(null);
                  }}
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-gray-400"
                >
                  <option value="">
                    {loading ? "Loading categories..." : "Select category"}
                  </option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* BRAND */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Brand
                </label>

                <input
                  type="text"
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                    setResult(null);
                  }}
                  placeholder="e.g. Nike, Levi's, Zara"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-700 outline-none transition focus:border-gray-400"
                />

                <p className="mt-2 text-xs text-gray-400">
                  You can enter any brand. Unknown brands are handled
                  automatically.
                </p>
              </div>

              {/* CONDITION */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Condition
                </label>

                <select
                  value={clothingCondition}
                  onChange={(e) => {
                    setClothingCondition(e.target.value);
                    setResult(null);
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-gray-400"
                >
                  <option value="">Select condition</option>

                  <option value="NEW">New</option>

                  <option value="LIKE_NEW">Like New</option>

                  <option value="GOOD">Good</option>

                  <option value="FAIR">Fair</option>
                </select>
              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCalculate}
                  disabled={calculating}
                  className="flex-1 rounded-xl bg-black px-5 py-3 font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {calculating ? "Calculating..." : "Calculate Value"}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* ============================== */}
          {/* RESULT SECTION */}
          {/* ============================== */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Estimated Swap Value
            </h2>

            {!result ? (
              <div className="flex min-h-75 items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl">💰</div>

                  <p className="mt-4 font-semibold text-gray-700">
                    Your estimated value will appear here
                  </p>

                  <p className="mt-2 max-w-sm text-sm text-gray-400">
                    Select a category, enter the brand and choose the clothing
                    condition.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-8">
                {/* VALUE */}

                <div className="rounded-2xl bg-gray-50 p-6 text-center">
                  <p className="text-sm font-medium text-gray-500">
                    Estimated Swap Value
                  </p>

                  <p className="mt-2 text-5xl font-extrabold text-gray-900">
                    ₹{result.value}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Suggested value for your clothing item
                  </p>
                </div>

                {/* BREAKDOWN */}

                <div className="mt-6">
                  <h3 className="font-bold text-gray-900">Value Breakdown</h3>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                      <span className="text-sm text-gray-500">
                        Category Base Value
                      </span>

                      <span className="font-bold text-gray-900">
                        ₹{result.breakdown.baseValue}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                      <span className="text-sm text-gray-500">
                        Brand Multiplier
                      </span>

                      <span className="font-bold text-gray-900">
                        ×{result.breakdown.brandMultiplier}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                      <span className="text-sm text-gray-500">
                        Condition Multiplier
                      </span>

                      <span className="font-bold text-gray-900">
                        ×{result.breakdown.conditionMultiplier}
                      </span>
                    </div>
                  </div>
                </div>

                {/* FORMULA */}

                <div className="mt-6 rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Calculation
                  </p>

                  <p className="mt-2 text-sm font-medium text-gray-700">
                    ₹{result.breakdown.baseValue}
                    {" × "}
                    {result.breakdown.brandMultiplier}
                    {" × "}
                    {result.breakdown.conditionMultiplier}
                    {" = "}
                    <span className="font-bold text-gray-900">
                      ₹{result.value}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ValueCalculator;
