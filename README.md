# POS Loyalty Extension

A Shopify POS extension that provides customer loyalty points management and registration functionality directly from the point of sale interface.

[Demo](https://screenshot.click/POS_UI_EXTENSION.mp4)

## 🚀 Features

### Customer Registration

- **Home Screen Tile**: Easy access to customer registration from POS home
- **Registration Modal**: Capture customer details (name, email, terms acceptance)
- **Automatic Storage**: Customer data saved with metafields for loyalty tracking

### Loyalty Points Management

- **Points Display**: View current loyalty points in customer details
- **Points Management**: Add points (10, 50, 100) or reset to 0
- **Discount Redemption**: Automatic discount application when points are redeemed
- **Point Tiers**: 100 points = $5, 200 points = $10, 300 points = $15

## 🏗️ Project Structure

### Extension (`/extensions/pos-ui-loyalty/`)

```
src/
├── Modal.jsx                  # Customer registration modal
├── Tile.jsx                   # Home screen access tile
├── CustomerDetailsBlock.tsx   # Loyalty points management
└── useFetchLoyaltyPoint.ts    # Loyalty data hook
```

### App (`/app/`)

```
routes/
├── app._index.jsx            # Loyalty dashboard (admin)
├── app.jsx                   # App layout and navigation
├── auth.$.jsx                # OAuth authentication
├── auth.login/               # Login flow
├── _index/                   # Public landing page
└── webhooks.*.jsx            # App lifecycle webhooks
```

## 🛠️ Installation & Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Setup Database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Add your Shopify app credentials

4. **Deploy Extension**
   ```bash
   npm run deploy
   ```

## 🎯 Usage

### For Store Staff

1. Open Shopify POS
2. Look for "Register Customer" tile on home screen
3. Fill out customer registration form
4. View/manage loyalty points in customer details

### For Store Owners

1. Access the loyalty dashboard from the Shopify admin
2. Monitor extension status and configuration
3. View point tier settings

## 🔧 Technical Details

- **Framework**: Remix + React
- **Database**: Prisma (SQLite)
- **UI Components**: Shopify Polaris + POS UI Extensions
- **Authentication**: Shopify OAuth
- **Extensions API**: Shopify POS Extensions 2025-07

## 📝 Configuration

### Point Tiers

Modify point tiers in `useFetchLoyaltyPoint.ts`:

```typescript
export const discountTiers: DiscountTier[] = [
  { pointsRequired: 100, discountValue: 5 },
  { pointsRequired: 200, discountValue: 10 },
  { pointsRequired: 300, discountValue: 15 },
];
```

### Extension Permissions

Required scopes in `shopify.app.toml`:

- `write_customers` (customer creation)
- `read_customer_metafields` (loyalty points storage)
- `write_customer_metafields` (loyalty points updates)

## 🚢 Deployment

The extension automatically deploys when you push changes. Monitor deployment status in the Shopify admin under "Apps & Extensions".
