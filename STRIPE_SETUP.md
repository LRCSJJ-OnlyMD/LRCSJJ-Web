# LRCSJJ Stripe Payment Integration Setup Guide

## Overview

The LRCSJJ web application now uses **Stripe** as the primary payment gateway for yearly insurance payments. Each athlete must pay **150 MAD per year** for their insurance, which expires annually and needs to be renewed each season.

## Features Implemented

✅ **Yearly Insurance Payments**: 150 MAD per athlete per season  
✅ **Stripe Integration**: Secure payment processing with cards  
✅ **Payment History**: Track all payments per athlete  
✅ **Insurance Status**: Check if insurance is active/expired  
✅ **PDF Generation**: Export invoices and payment receipts  
✅ **Webhook Support**: Real-time payment status updates  
✅ **Moroccan Dirham (MAD)**: Native currency support  
✅ **Session Management**: 30-minute payment session expiry

## Stripe Setup Instructions

### 1. Create Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for a new account
3. Complete account verification

### 2. Get API Keys

1. Log into your [Stripe Dashboard](https://dashboard.stripe.com/)
2. Go to **Developers** → **API keys**
3. Copy the following keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### 3. Configure Webhook

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set endpoint URL to: `https://yourdomain.com/api/payments/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.succeeded`
5. Copy the **Webhook signing secret** (starts with `whsec_`)

### 4. Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```bash
# Stripe Configuration (REQUIRED)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (if using PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/lrcsjj_db"

# JWT Secret for authentication
JWT_SECRET=your-very-long-random-secret-key-here
```

### 5. Test the Integration

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/club-manager/payments`

3. Go to **Paiement Stripe** tab

4. Click **Payer 150,00 MAD avec Stripe**

5. You'll be redirected to Stripe Checkout (test mode)

6. Use test card: `4242 4242 4242 4242` with any future date and CVC

## API Routes Created

| Route                            | Method | Description                    |
| -------------------------------- | ------ | ------------------------------ |
| `/api/payments/create-session`   | POST   | Create Stripe checkout session |
| `/api/payments/verify-session`   | GET    | Verify payment completion      |
| `/api/payments/history`          | GET    | Get athlete payment history    |
| `/api/payments/insurance-status` | GET    | Check insurance status         |
| `/api/payments/webhook`          | POST   | Handle Stripe webhooks         |

## Payment Flow

1. **Athlete Selection**: Club manager selects athlete for insurance payment
2. **Session Creation**: System creates Stripe checkout session (150 MAD)
3. **Redirect to Stripe**: User redirected to secure Stripe payment page
4. **Payment Processing**: User enters card details and completes payment
5. **Webhook Notification**: Stripe sends webhook on payment completion
6. **Status Update**: System updates insurance status to "active"
7. **Confirmation**: User sees success page and receives confirmation

## Testing Cards (Test Mode Only)

| Card Number           | Description        |
| --------------------- | ------------------ |
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Card declined      |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0000 0000 0069` | Expired card       |

**Note**: Use any future expiry date (e.g., 12/34) and any 3-digit CVC

## Production Deployment

### 1. Replace Test Keys

1. In Stripe Dashboard, toggle to **Live** mode
2. Get live API keys (they start with `pk_live_` and `sk_live_`)
3. Update environment variables in production

### 2. Configure Webhooks for Production

1. Add production webhook endpoint
2. Use your production domain: `https://yourdomain.com/api/payments/webhook`
3. Update `STRIPE_WEBHOOK_SECRET` with live webhook secret

### 3. Currency Configuration

The system is configured for **Moroccan Dirham (MAD)**. Stripe supports MAD for:

- Card payments
- Bank transfers (in Morocco)
- Mobile wallets

## Monitoring and Analytics

### Payment Tracking

- All payments are tracked in Stripe Dashboard
- Payment history available per athlete
- Insurance status automatically calculated
- PDF receipts generated for each payment

### Key Metrics

- **Annual Revenue**: Total insurance payments collected
- **Active Policies**: Number of athletes with valid insurance
- **Expiring Soon**: Athletes whose insurance expires in 30 days
- **Payment Success Rate**: Percentage of successful payments

## Security Features

✅ **PCI Compliance**: Stripe handles all card data securely  
✅ **SSL Encryption**: All communications encrypted  
✅ **Webhook Verification**: Signatures verified for all webhooks  
✅ **Session Expiry**: Payment sessions expire after 30 minutes  
✅ **Fraud Detection**: Stripe's built-in fraud prevention

## Support and Troubleshooting

### Common Issues

1. **Payment Fails**: Check if test cards are being used correctly
2. **Webhook Not Working**: Verify webhook URL and secret
3. **Currency Issues**: Ensure MAD is enabled in Stripe account
4. **Session Expired**: Users have 30 minutes to complete payment

### Logs

Check the following for debugging:

- Browser console for client-side errors
- Server logs for API errors
- Stripe Dashboard → Events for webhook status
- Stripe Dashboard → Payments for payment status

## Migration from CMI/Cash Plus

The old CMI and Cash Plus integration has been replaced with Stripe. Benefits:

- **Easier Testing**: No need for expensive production credentials
- **Better UX**: Redirect to professional Stripe checkout
- **More Payment Methods**: Cards, Apple Pay, Google Pay
- **Better Reporting**: Comprehensive Stripe Dashboard
- **Global Support**: Stripe handles international payments

## Next Steps

Once testing is complete and you're ready for production:

1. ✅ Verify all payments work in test mode
2. ✅ Test webhook notifications
3. ✅ Generate and verify PDF receipts
4. ✅ Check insurance status logic
5. 🔄 Switch to live Stripe keys
6. 🔄 Configure production webhooks
7. 🔄 Update domain in environment variables
8. 🔄 Deploy to production

---

**Contact**: For any issues with this integration, please check the Stripe documentation or contact your development team.
