const removeAges = (agesArray, babyExtraPlacesAmount, babyMaxAge) => {
  if (babyExtraPlacesAmount <= 0) {
    return agesArray; // No removal needed
  }

  // Create a copy of the ages array to avoid modifying the original array
  const sortedAges = [...agesArray].sort((a, b) => a - b);

  // Remove the youngest ages based on the babyExtraPlacesAmount
  let updatedAgesArray = sortedAges;

  if (sortedAges[0] <= babyMaxAge) {
    updatedAgesArray = sortedAges.slice(babyExtraPlacesAmount);
  }

  return updatedAgesArray;
};

module.exports = { removeAges };
