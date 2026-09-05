const categoryBaseValues = {
  1: 500,
  2: 150,
  3: 700,
  4: 600,
  5: 1500,
  6: 1000,
  7: 800,
  8: 1200,
  9: 300,
  10: 200,
  11: 1300,
  12: 300,
  13: 700,
};
const conditionMultipliers = {
  NEW: 1.0,
  LIKE_NEW: 0.9,
  GOOD: 0.75,
  FAIR: 0.55,
};
const brandMultipliers = {
  premium: 1.5,
  high: 1.3,
  mid: 1.1,
  budget: 0.9,
  generic: 0.8,
};
const premiumBrands = [
  "gucci",
  "prada",
  "versace",
  "armani",
  "burberry",
  "louis vuitton",
  "balenciaga",
  "dior",
  "chanel",
  "hugo boss",
  "lacoste",
];
const highBrands = [
  "nike",
  "adidas",
  "puma",
  "levi's",
  "levis",
  "tommy hilfiger",
  "calvin klein",
  "lacoste",
  "ralph lauren",
  "reebok",
  "massimo dutti",
  "superdry",
  "gant",
  "united colors of benetton",
  "selected homme",
  "marks & spencer",
  "diesel",
];
const midBrands = [
  "zara",
  "h&m",
  "uniqlo",
  "gap",
  "mango",
  "marks & spencer",
  "max",
  "Wrogn",
  "mufti",
  "westside",
  "spykar",
];
const budgetBrands = [
  "roadster",
  "flying machine",
  "dennis lingo",
  "highlander",
  "bewakoof",
  "ramraj",
  "indian garage",
  "indian terrain",
  "pantaloons",
  "HERE&NOW",
  "denim club",
];
function getBrandMultiplier(brand) {
  if (!brand) {
    return brandMultipliers.generic;
  }

  const normalizedBrand = brand.trim().toLowerCase();

  if (premiumBrands.includes(normalizedBrand)) {
    return brandMultipliers.premium;
  }

  if (highBrands.includes(normalizedBrand)) {
    return brandMultipliers.high;
  }

  if (midBrands.includes(normalizedBrand)) {
    return brandMultipliers.mid;
  }

  if (budgetBrands.includes(normalizedBrand)) {
    return brandMultipliers.budget;
  }

  // Unknown brand
  return brandMultipliers.generic;
}

// ------------------------------------
// CALCULATE CLOTHING VALUE
// ------------------------------------

function calculateClothingValue({ categoryId, brand, condition }) {
  const baseValue = categoryBaseValues[categoryId];

  if (!baseValue) {
    throw new Error("Invalid clothing category");
  }

  const normalizedCondition = condition?.trim().toUpperCase();

  const conditionMultiplier = conditionMultipliers[normalizedCondition];

  if (!conditionMultiplier) {
    throw new Error("Invalid clothing condition");
  }

  const brandMultiplier = getBrandMultiplier(brand);

  const estimatedValue = baseValue * brandMultiplier * conditionMultiplier;

  return {
    baseValue,

    brandMultiplier,

    conditionMultiplier,

    estimatedValue: Math.round(estimatedValue),
  };
}

// ------------------------------------
// EXPORT
// ------------------------------------

module.exports = {
  calculateClothingValue,
};
