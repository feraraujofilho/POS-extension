import React, { useEffect, useState } from 'react';

import {
  reactExtension,
  POSBlock,
  Text,
  POSBlockRow,
  useApi,
  // Button,
} from '@shopify/ui-extensions-react/point-of-sale';
// import { useFetchLoyaltyPoints } from './useFetchLoyaltyPoint';
import type { DirectApiRequestBody } from '@shopify/ui-extensions/point-of-sale';


export const DISCOUNT_NAME = 'Loyalty-Direct';


const fetchLoyaltyPoints = async (customerId: number) => {
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

  return res.json();

}


// 2. Implement the `CustomerDetailsBlock` component
const CustomerDetailsBlock = () => {
  const [pointsTotal, setPointsTotal] = useState<number | null>(0);
  // 3. Setup the api
  const api = useApi<'pos.customer-details.block.render'>();

  // 4. Fetch the loyalty points and filter available discounts using the useFetchLoyaltyPoints hook
  /* const {loading, pointsTotal, availableDiscounts} = useFetchLoyaltyPoints(
    api.customer.id,
  ); */

  useEffect(() => {
    async function getProductInfo() {
      const result = await fetchLoyaltyPoints(api.customer.id);
      setPointsTotal(result.data.customer.metafield.value);
    }
    getProductInfo();
  }, [api.customer.id]);


  // 5. Implement the applyDiscount function
  /* const applyDiscount = (discountValue: number, pointsRequired: number) => {
    if (pointsTotal) {
      api.cart.applyCartDiscount(
        'Percentage',
        `${DISCOUNT_NAME}.${pointsTotal - pointsRequired}`,
        String(discountValue),
      );

      api.toast.show(`${discountValue}% off applied`);
    } else {
      api.toast.show(`Error applying discount`);
    }
  }; */

  // 7. Handle error and loading states
  /* if (loading) {
    return (
      <POSBlock>
        <POSBlockRow>
          <Text>Loading...</Text>
        </POSBlockRow>
      </POSBlock>
    );
  } */

  if (pointsTotal === null) {
    return (
      <POSBlock>
        <POSBlockRow>
          <Text color="TextWarning">Unable to fetch loyalty points.</Text>
        </POSBlockRow>
      </POSBlock>
    );
  }

  // 6. Render the CustomerDetailsBlock component to display available points and discounts
  return (
    <POSBlock>
      <POSBlockRow>
        <Text>Customer ID: {api.customer.id}</Text>
        {/* <Text>Points Total: {pointsTotal}</Text> */}
        {/* <Text>Available Discounts: {availableDiscounts.length}</Text> */}
        <Text
          variant="body"
          color={pointsTotal > 0 ? 'TextSuccess' : 'TextWarning'}
        >
          Point balance: {pointsTotal}
        </Text>
      </POSBlockRow>
      {/* {availableDiscounts.length > 0 ? (
        <POSBlockRow>
          <Text variant="body">Available Discounts:</Text>
          {availableDiscounts.map((tier, index) => (
            <POSBlockRow key={`${tier.pointsRequired}-${index}`}>
              <Button
                title={`Redeem $${tier.discountValue} discount (${tier.pointsRequired} points)`}
                type="primary"
                onPress={() =>
                  applyDiscount(tier.discountValue, tier.pointsRequired)
                }
              />
            </POSBlockRow>
          ))}
        </POSBlockRow>
      ) : (
        <POSBlockRow>
          <Text variant="body" color="TextWarning">
            No available discounts.
          </Text>
        </POSBlockRow>
      )} */}
    </POSBlock>
  );
};

// 1. Render the CustomerDetailsBlock component at the `pos.customer-details.block.render` target
export default reactExtension('pos.customer-details.block.render', () => (
  <CustomerDetailsBlock />
));
