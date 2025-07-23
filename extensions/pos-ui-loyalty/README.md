# POS Loyalty Extension

A Shopify POS extension that provides customer loyalty points management and customer registration functionality.

## Features

### 1. Customer Registration

- **Location**: Home screen tile → Registration modal
- **Functionality**:
  - Create new customers with first name, last name, and email
  - Terms and conditions acceptance
  - Stores terms acceptance in customer metafields
  - Email marketing consent option

### 2. Loyalty Points Management

- **Location**: Customer details page
- **Functionality**:
  - Display current loyalty points balance
  - Add points (10, 50, 100 points or reset to 0)
  - Redeem points for discounts
  - Automatic point deduction when discounts are applied

## File Structure

```
src/
├── Modal.jsx                  # Customer registration modal
├── Tile.jsx                   # Home screen tile to access registration
├── CustomerDetailsBlock.tsx   # Loyalty points display and management
└── useFetchLoyaltyPoint.ts   # Hook for fetching and managing loyalty data
```

## Extension Targets

- `pos.home.tile.render` - Home screen tile for customer registration
- `pos.home.modal.render` - Customer registration modal
- `pos.customer-details.block.render` - Loyalty points management block

## Discount Tiers

The extension supports three discount tiers:

- 100 points = 5% discount
- 200 points = 10% discount
- 300 points = 15% discount

## Data Storage

- **Customer Data**: Stored in Shopify customer records
- **Loyalty Points**: Stored in customer metafield `custom.loyalty_direct_points`
- **Terms Acceptance**: Stored in customer metafield `custom.terms_and_condition`

## Usage

1. **Register New Customer**: Use the home screen tile to open registration modal
2. **Manage Points**: Navigate to customer details to view/add/use loyalty points
3. **Apply Discounts**: Click available discount buttons to apply cart discounts and deduct points

## Requirements

- Shopify POS app
- `write_customers` and `read_customers` permissions
- API version 2025-07
