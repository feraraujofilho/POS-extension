import React from "react";
import {
  reactExtension,
  useApi,
  Button,
} from "@shopify/ui-extensions-react/point-of-sale";

const LoyaltyAction = () => {
  const api = useApi();

  const handlePress = () => {
    api.toast.show("Loyalty action pressed");
    // Add loyalty-specific action logic here
  };

  return <Button title="Loyalty Points" onPress={handlePress} />;
};

export default reactExtension("pos.customer-details.action.render", () => (
  <LoyaltyAction />
));
