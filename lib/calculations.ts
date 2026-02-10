import { EmployeeCategory, Indicator, IPCRData } from '../types';

export const calculateIndicatorAverage = (ind: Indicator): number => {
  const values = [ind.q, ind.e, ind.t].filter(v => v !== null && v !== undefined && v > 0) as number[];
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return Number((sum / 3).toFixed(2)); // Standard rounding
};

export const calculateSectionAverage = (indicators: Indicator[]): number => {
  const validIndicators = indicators.filter(i => 
    (i.q !== null || i.e !== null || i.t !== null) && 
    (calculateIndicatorAverage(i) > 0)
  );
  
  if (validIndicators.length === 0) return 0;
  
  const sum = validIndicators.reduce((acc, curr) => acc + calculateIndicatorAverage(curr), 0);
  return Number((sum / validIndicators.length).toFixed(2));
};

export const getWeights = (category: EmployeeCategory) => {
  switch (category) {
    case EmployeeCategory.DIRECTOR_UNIT_HEAD:
      return { core: 60, strategic: 30, support: 0, other: 10 };
    case EmployeeCategory.OFFICE_STAFF:
      return { core: 50, strategic: 20, support: 20, other: 10 };
    case EmployeeCategory.DRIVER:
      return { core: 50, strategic: 0, support: 10, other: 20, passenger: 20 }; // simplified for now
    default:
      return { core: 50, strategic: 20, support: 20, other: 10 };
  }
};

export const calculateFinalRating = (data: IPCRData) => {
  const weights = getWeights(data.category);
  
  const coreAvg = calculateSectionAverage(data.coreFunctions);
  const stratAvg = calculateSectionAverage(data.strategicFunctions);
  const suppAvg = calculateSectionAverage(data.supportFunctions);
  const otherAvg = calculateSectionAverage(data.otherFunctions);

  const coreWeighted = (coreAvg * weights.core) / 100;
  const stratWeighted = (stratAvg * weights.strategic) / 100;
  const suppWeighted = (suppAvg * weights.support) / 100;
  const otherWeighted = (otherAvg * weights.other) / 100;

  let total = coreWeighted + stratWeighted + suppWeighted + otherWeighted;
  
  // Designation Logic
  let designationRating = 0;
  let finalWithDesignation = total;
  
  if (data.hasDesignation) {
    // Assuming the designation rating is input separately or calculated from a separate form
    // For this simulation, we'll mock it as equal to the base rating for simplicity 
    // or we would need a field for "Designation Rating".
    // Let's assume designation rating is 4.5 for simulation purposes if checked
    designationRating = 4.5; 
    finalWithDesignation = (total * 0.70) + (designationRating * 0.30);
  }

  return {
    coreAvg, stratAvg, suppAvg, otherAvg,
    coreWeighted, stratWeighted, suppWeighted, otherWeighted,
    totalBase: Number(total.toFixed(2)),
    finalRating: Number(finalWithDesignation.toFixed(2)),
    designationRating,
    weights
  };
};

export const getAdjectivalRating = (score: number): string => {
  if (score >= 4.5) return "Outstanding";
  if (score >= 3.5) return "Very Satisfactory";
  if (score >= 2.5) return "Satisfactory";
  if (score >= 1.5) return "Unsatisfactory";
  return "Poor";
};