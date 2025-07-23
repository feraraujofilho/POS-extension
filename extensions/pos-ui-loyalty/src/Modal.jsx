import React, { useState } from "react";
import {
  Button,
  Screen,
  Text,
  TextField,
  ScrollView,
  Section,
  Stack,
  Box,
  reactExtension,
  useApi,
  EmailField,
} from "@shopify/ui-extensions-react/point-of-sale";

const CustomerRegistrationModal = () => {
  const api = useApi();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [acceptsTerms, setAcceptsTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (!firstName.trim()) {
      api.toast.show("First name is required");
      return false;
    }
    if (!lastName.trim()) {
      api.toast.show("Last name is required");
      return false;
    }
    if (!email.trim()) {
      api.toast.show("Email is required");
      return false;
    }
    if (!email.includes("@")) {
      api.toast.show("Please enter a valid email address");
      return false;
    }
    if (!acceptsTerms) {
      api.toast.show("You must accept the terms and conditions");
      return false;
    }
    return true;
  };

  console.log(firstName, lastName, email, acceptsTerms);

  // Simplified mutation for debugging purposes
  const createCustomerSimple = async (customerData) => {
    const simplifiedRequestData = {
      query: `
        mutation customerCreate($input: CustomerInput!) {
          customerCreate(input: $input) {
            customer {
              id
              firstName
              lastName
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        input: {
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          email: customerData.email,
        },
      },
    };

    console.log("Trying simplified mutation:", simplifiedRequestData);
    return await makeGraphQLRequest(simplifiedRequestData);
  };

  const makeGraphQLRequest = async (
    requestData,
    maxRetries = 3,
    delay = 1000,
  ) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt} of ${maxRetries}`);

        const response = await fetch("shopify:admin/api/graphql.json", {
          method: "POST",
          body: JSON.stringify(requestData),
        });

        // Check if the HTTP response is ok
        if (!response.ok) {
          const errorText = await response.text();
          console.error("HTTP Error:", response.status, errorText);

          // If it's a server error and we have retries left, try again
          if (response.status >= 500 && attempt < maxRetries) {
            console.log(`Server error, retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }

          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log("Full response:", result);
        return result;
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);

        if (attempt === maxRetries) {
          throw error;
        }

        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  const handleSubmit = async () => {
    console.log("handleSubmit");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const customerData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        metafields: [
          {
            namespace: "custom",
            key: "terms_and_condition",
            value: acceptsTerms.toString(),
            type: "boolean",
          },
        ],
      };

      console.log("CUSTOMERDATA", customerData);

      const requestData = {
        query: `
          mutation customerCreate($input: CustomerInput!) {
            customerCreate(input: $input) {
              customer {
                id
                firstName
                lastName
                defaultEmailAddress {
                  emailAddress
                }
                metafield(namespace: "custom", key: "terms_and_condition") {
                  value
                }
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          input: customerData,
        },
      };

      // Try the full mutation first, fall back to simplified if it fails
      let result;
      try {
        result = await makeGraphQLRequest(requestData);
      } catch (error) {
        console.log("Full mutation failed, trying simplified version:", error);
        api.toast.show("Retrying with simplified request...");
        result = await createCustomerSimple(customerData);
      }

      // Check for GraphQL errors in the response
      if (result.errors && result.errors.length > 0) {
        console.error("GraphQL Errors:", result.errors);
        api.toast.show("GraphQL Error: " + result.errors[0].message);
        return;
      }

      // Check if data exists and has the expected structure
      if (!result.data) {
        console.error("No data in response:", result);
        api.toast.show("Error: No data received from server");
        return;
      }

      if (!result.data.customerCreate) {
        console.error("No customerCreate in response:", result.data);
        api.toast.show("Error: Invalid response structure");
        return;
      }

      // Check for user errors from the mutation
      if (
        result.data.customerCreate.userErrors &&
        result.data.customerCreate.userErrors.length > 0
      ) {
        console.error("User Errors:", result.data.customerCreate.userErrors);
        api.toast.show(
          "Error: " + result.data.customerCreate.userErrors[0].message,
        );
        return;
      }

      // Check if customer was actually created
      if (!result.data.customerCreate.customer) {
        console.error("No customer in response:", result.data.customerCreate);
        api.toast.show("Error: Customer was not created");
        return;
      }

      api.toast.show("Customer created successfully!");

      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setAcceptsTerms(false);
    } catch (error) {
      console.error("Fetch error:", error);
      api.toast.show("Network error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen name="CustomerRegistration" title="Customer Registration">
      <ScrollView>
        <Section>
          <Stack direction="vertical">
            <Text>Create New Customer</Text>

            <TextField
              label="First Name *"
              value={firstName}
              onChange={setFirstName}
              placeholder="Enter first name"
            />
            <EmailField
              label="Email"
              placeholder="example@email.com"
              helpText="Please enter a valid email"
              value={email}
              onChange={setEmail}
              required={true}
              action={{
                label: "Clear",
                onPress: () => setEmail(""),
              }}
            />

            <TextField
              label="Last Name *"
              value={lastName}
              onChange={setLastName}
              placeholder="Enter last name"
            />

            <Box>
              <Text>Terms and Conditions *</Text>
              <Text>
                This is a description of the terms and condition. By creating
                your profile, you agree to our Privacy Policy and Terms of Use.
                Your data may be used to personalize your experience, share
                updates, and communicate with you. We may collect information
                from you, our partners, and retailers, and share it securely
                within our group globally. You can access, modify, or delete
                your data anytime.
              </Text>
              <Button
                title={
                  acceptsTerms ? "✓ I agree to the T&C" : "I agree to the T&C"
                }
                onPress={() => setAcceptsTerms(!acceptsTerms)}
                type={acceptsTerms ? "primary" : "basic"}
              />
            </Box>

            <Button
              title={isSubmitting ? "Creating Customer..." : "Create Customer"}
              onPress={handleSubmit}
              type="primary"
              disabled={isSubmitting}
            />
          </Stack>
        </Section>
      </ScrollView>
    </Screen>
  );
};

export default reactExtension("pos.home.modal.render", () => (
  <CustomerRegistrationModal />
));
