import { ITEM_TYPES } from "./ItemValidation";

export const validateBoMs = (data, skipHeader = true, itemsTypes, fetchedBoms) => {
  const processedData = skipHeader ? data.slice(1) : data;

  const uniqueCombinations = new Set(
    fetchedBoms.map((b) => `${b.item_id}-${b.component_id}`)
  );
  const uniqueIds = new Set(fetchedBoms.map((b) => b.id));

  return processedData.map((row, index) => {
    const validationResult = validateSingleBoM(
      row,
      uniqueCombinations,
      uniqueIds,
      itemsTypes
    );
    return {
      row,
      isValid: validationResult.isValid,
      reason: validationResult.reason,
      originalIndex: skipHeader ? index + 2 : index + 1,
    };
  });
};

export const validateSingleBoM = (row, uniqueCombinations, uniqueIds, itemsTypes) => {
  const itemIds = Object.keys(itemsTypes);

  console.log(itemIds)

  if (!Array.isArray(row) || row.length < 3) {
    return {
      isValid: false,
      reason: "Insufficient data columns for Bill of Materials",
    };
  }

  const [id, item_id, component_id, quantity] = row;
  const errors = [];


  if (uniqueIds.has(id)) {
    errors.push("Duplicate ID found");
  }


  if (!item_id || !component_id) {
    errors.push("Both Item ID and Component ID are required");
  }


  if (isNaN(quantity) || quantity === '' || quantity === null) {
    errors.push("Quantity must be a valid number");
  } else {
    const quantityVal = parseFloat(quantity);
    if (
      quantityVal < BOM_CONSTANTS.MIN_QUANTITY ||
      quantityVal > BOM_CONSTANTS.MAX_QUANTITY
    ) {
      errors.push(
        `Quantity must be a number between ${BOM_CONSTANTS.MIN_QUANTITY} and ${BOM_CONSTANTS.MAX_QUANTITY}`
      );
    }
  }


  const combinationKey = `${item_id}-${component_id}`;
  if (uniqueCombinations.has(combinationKey)) {
    errors.push("Duplicate combination of item_id and component_id");
  }


  if (!itemIds.includes(item_id) || !itemIds.includes(component_id)) {
    errors.push("BoM cannot be created for items not created yet");
  }


  if (itemsTypes[item_id] === ITEM_TYPES.SELL) {
    if (itemsTypes[component_id] === ITEM_TYPES.SELL) {
      errors.push("Sell item cannot be a component in BoM");
    }
  }

  if (itemsTypes[item_id] === ITEM_TYPES.PURCHASE) {
    errors.push("Purchase item cannot be item_id in BoM");
  }

  if (itemsTypes[item_id] === ITEM_TYPES.COMPONENT) {
    if (!item_id || !component_id) {
      errors.push("Component items require both item_id and component_id");
    }
  }

  return {
    isValid: errors.length === 0,
    reason: errors.join(", "),
  };
};

export const BOM_CONSTANTS = {
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 100,
};
