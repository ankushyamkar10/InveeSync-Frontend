'use client'
export const usePendingJobs = (items = [], boms = []) => {
  const pendingJobs = [];


  const sellItems = items.filter((entry) => entry.type === "sell");
  if (sellItems.length === 0 || !sellItems.some((entry) => entry.id)) {
    pendingJobs.push({
      type: "sell_item",
      title: "Sell Items",
      description:
        "Sell items must have at least one entry with a valid item_id.",
      severity: "medium",
    });
  }


  const purchaseItems = items.filter((entry) => entry.type === "purchase");
  if (
    purchaseItems.length === 0 ||
    !purchaseItems.some((entry) => entry.component_id)
  ) {
    pendingJobs.push({
      type: "purchase_item",
      title: "Purchase Items",
      description:
        "Purchase items must have at least one entry with a valid component_id.",
      severity: "medium",
    });
  }


  boms.forEach((entry) => {
    if (!entry.item_id || !entry.component_id) {
      pendingJobs.push({
        type: "component_item",
        title: "Component Item",
        description:
          "Component items must have both a valid item_id and a valid component_id.",
        severity: "high",
      });
    }
  });

  return pendingJobs;
};
