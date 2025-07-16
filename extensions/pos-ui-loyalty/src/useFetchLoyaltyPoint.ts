import type { DirectApiRequestBody } from "@shopify/ui-extensions/point-of-sale";
import { useEffect, useState } from "react";

// 1. Define discount tiers and available discounts
interface DiscountTier {
  pointsRequired: number;
  discountValue: number;
}

export const discountTiers: DiscountTier[] = [
  { pointsRequired: 100, discountValue: 5 },
  { pointsRequired: 200, discountValue: 10 },
  { pointsRequired: 300, discountValue: 15 },
];

// 3. Implement the useFetchLoyaltyPoints hook
export const useFetchLoyaltyPoints = (customerId: number) => {
  const [pointsTotal, setPointsTotal] = useState<number | null>(0);
  const [availableDiscounts, setAvailableDiscounts] = useState<DiscountTier[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPoints() {
      try {
        const points = await fetchLoyaltyPoints(customerId);
        setPointsTotal(points);

        if (points) {
          setAvailableDiscounts(
            discountTiers.filter((tier) => points >= tier.pointsRequired),
          );
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    fetchPoints();
  }, [customerId, pointsTotal]);

  return {
    pointsTotal,
    availableDiscounts,
    loading,
  };
};

// 2. Fetch the loyalty points using a Direct API query on the customer metafield
export const fetchLoyaltyPoints = async (customerId: number) => {
  const requestBody: DirectApiRequestBody = {
    query: `#graphql
      query Customer($customerId: ID!) {
          customer(id: $customerId) {
            id
            amountSpent {
              amount
            }
            metafields(first: 5) {
              edges {
                node {
                  id
                  namespace
                  key
                  value
                }
              }
            }
            metafield(namespace:"custom", key: "loyalty_direct_points") {
              value
            }
          }
        }
      `,
    variables: {
      customerId: `gid://shopify/Customer/${customerId}`,
    },
  };
  const res = await fetch("shopify:admin/api/graphql.json", {
    method: "POST",
    body: JSON.stringify(requestBody),
  });
  const json = await res.json();

  /* const result = await fetch("shopify:admin/api/graphql.json", {
    method: "POST",
    body: JSON.stringify({
      query: `
        query Customer($customerId: ID!) {
          customer(id: $customerId) {
            id
            amountSpent {
              amount
            }
            metafields(first: 5) {
              edges {
                node {
                  id
                  namespace
                  key
                  value
                }
              }
            }
            metafield(namespace:"custom", key: "loyalty_direct_points") {
              value
            }
          }
        }
      `,
      variables: {
        customerId: `gid://shopify/Customer/${customerId}`,
      },
    }),
  });

  const json = await result.json(); */

  if (json.errors) {
    console.error("GraphQL Errors:", json.errors);
    json.errors.forEach((error: any) => {
      console.error("GraphQL Error Details:", error);
    });
    return null;
  }

  if (!res.ok) {
    console.error("Network Error:", res.statusText);
    return null;
  }

  if (json.data.customer.metafield === null) {
    return 0;
  }

  return Number(json.data.customer.metafield.value);
};
