import React from "react";
import {
  Tile,
  reactExtension,
  useApi,
} from "@shopify/ui-extensions-react/point-of-sale";

const LoyaltyTile = () => {
  const api = useApi();

  const handlePress = () => {
    // Try using presentModal instead of navigate
    try {
      api.action.presentModal();
    } catch (error) {
      api.toast.show("Modal navigation failed: " + error.message);
    }
  };

  return (
    <Tile
      title="Register Customer"
      subtitle="Create new customer account"
      onPress={handlePress}
      // Make the tile always enabled for testing
      enabled={true}
    />
  );
};

export default reactExtension("pos.home.tile.render", () => <LoyaltyTile />);
