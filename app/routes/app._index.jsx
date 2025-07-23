import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  List,
  InlineStack,
  Badge,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Index() {
  return (
    <Page>
      <TitleBar title="POS Loyalty Extension Dashboard" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    POS Loyalty Extension Active 🎉
                  </Text>
                  <Text variant="bodyMd" as="p">
                    Your POS loyalty extension is successfully installed and
                    configured. Staff can now register customers and manage
                    loyalty points directly from the POS interface.
                  </Text>
                </BlockStack>
                <BlockStack gap="200">
                  <Text as="h3" variant="headingMd">
                    Extension Features
                  </Text>
                  <List>
                    <List.Item>
                      <InlineStack gap="200" align="space-between">
                        <Text variant="bodyMd">
                          Customer Registration Modal
                        </Text>
                        <Badge tone="success">Active</Badge>
                      </InlineStack>
                    </List.Item>
                    <List.Item>
                      <InlineStack gap="200" align="space-between">
                        <Text variant="bodyMd">Loyalty Points Display</Text>
                        <Badge tone="success">Active</Badge>
                      </InlineStack>
                    </List.Item>
                    <List.Item>
                      <InlineStack gap="200" align="space-between">
                        <Text variant="bodyMd">Points Management</Text>
                        <Badge tone="success">Active</Badge>
                      </InlineStack>
                    </List.Item>
                    <List.Item>
                      <InlineStack gap="200" align="space-between">
                        <Text variant="bodyMd">Discount Application</Text>
                        <Badge tone="success">Active</Badge>
                      </InlineStack>
                    </List.Item>
                  </List>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    How to Use
                  </Text>
                  <List>
                    <List.Item>Open Shopify POS on your device</List.Item>
                    <List.Item>
                      Look for the "Register Customer" tile on the home screen
                    </List.Item>
                    <List.Item>
                      View customer loyalty points in customer details
                    </List.Item>
                    <List.Item>Add/redeem points and apply discounts</List.Item>
                  </List>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Point Tiers
                  </Text>
                  <List>
                    <List.Item>100 points = $5 discount</List.Item>
                    <List.Item>200 points = $10 discount</List.Item>
                    <List.Item>300 points = $15 discount</List.Item>
                  </List>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
