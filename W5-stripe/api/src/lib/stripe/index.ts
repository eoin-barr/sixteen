import { Stripe } from 'stripe';

const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET || '', {
  apiVersion: '2022-08-01',
});

export const createCheckoutSession = async (
  id: bigint,
  customerID: string,
  priceID: string
) => {
  const price = await stripe.prices.retrieve(priceID);
  if (!price) {
    return null;
  }

  const request: Stripe.Checkout.SessionCreateParams = {
    line_items: [{ price: priceID, quantity: 1 }],
    mode: 'subscription',
    success_url: `${APP_URL}/payment/completed?result_status=succeeded&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/payment/cancelled?result_status=cancelled`,
    customer: customerID,
    metadata: { uid: id.toString() },
    subscription_data: {
      metadata: { uid: id.toString() },
    },
  };

  if ('trial_days' in price.metadata && request.subscription_data) {
    request.subscription_data.trial_period_days = Number(price.metadata.trial_days);
  }

  return stripe.checkout.sessions.create(request);
};

export const getCheckoutSession = async (sessionID: string) =>
  stripe.checkout.sessions.retrieve(sessionID);

const isCustomer = (
  x: string | Stripe.Customer | Stripe.DeletedCustomer | null | undefined
) => (x ? typeof (<Stripe.Customer>x).id !== 'undefined' : false);

export const upsertCustomer = async (
  id: bigint,
  email: string,
  customerID?: string | Stripe.Customer | Stripe.DeletedCustomer | null | undefined
): Promise<Stripe.Customer | Stripe.DeletedCustomer> => {
  let customer: Stripe.Customer | Stripe.DeletedCustomer | null = null;
  let parsedCustomerID: string = '';

  if (customerID) {
    if (isCustomer(customerID)) {
      parsedCustomerID = (<Stripe.Customer>customerID).id;
    } else {
      parsedCustomerID = <string>customerID;
    }

    customer = await stripe.customers.retrieve(parsedCustomerID);

    if (customer.deleted) {
      customer = null;
    }
  } else {
    const customers = await stripe.customers.search({
      query: `metadata["uid"]:'${id.toString()}'`,
    });

    if (customers && customers.data.length) {
      //TODO: this may be an ussye if somehow we accidently get more than one customer per user
      for (let i = 0; i <= customers.data.length; i += 1) {
        if (!customers.data[i].deleted) {
          customer = customers.data[i];
          break;
        }
      }
    }
  }

  if (!customer) {
    console.log('Creating new customer for user', id.toString());
    customer = await stripe.customers.create({
      email,
      metadata: { uid: id.toString() },
    });
  }

  return customer;
};

const getPrice = async (priceID: string): Promise<Stripe.Price | null> => {
  const price = await stripe.prices.retrieve(priceID);
  return price || null;
};

const isSetupIntent = (x: string | Stripe.SetupIntent | null) =>
  x ? typeof (<Stripe.SetupIntent>x).id !== 'undefined' : false;

export const getSetupIntent = async (
  id: bigint,
  customerID: string
): Promise<string | null> => {
  let setupIntent: string | null = null;
  const subscription = await upsertSubscription(id, customerID);

  if (subscription) {
    if (isSetupIntent(subscription.pending_setup_intent)) {
      setupIntent = (<Stripe.SetupIntent>subscription.pending_setup_intent).id;
    } else {
      setupIntent = <string>subscription.pending_setup_intent;
    }
  }

  return setupIntent;
};

export const upsertSetupIntent = async (
  id: bigint,
  customerID: string,
  setupIntentID?: string
) => {
  if (setupIntentID) {
    return stripe.setupIntents.retrieve(setupIntentID);
  }

  const setupIntents = await stripe.setupIntents.list({
    customer: customerID,
  });

  if (setupIntents && setupIntents.data.length > 0) {
    //TODO: May need to handle this better if we have more than one SetupIntent.
    return setupIntents.data[0];
  }

  return stripe.setupIntents.create({
    customer: customerID,
    metadata: { uid: id.toString() },
  });
};

const isPaymentMethod = (x?: string | Stripe.PaymentMethod | null) =>
  x ? typeof (<Stripe.PaymentMethod>x).id !== 'undefined' : false;

export const getSubscription = async (
  id: bigint
): Promise<Stripe.Subscription | null> => {
  let subscription: Stripe.Subscription | null = null;
  const result = await stripe.subscriptions.search({
    query: `metadata["uid"]:'${id}'`,
  });

  if (result && result.data.length) {
    //TODO: May need to handle this better if there are multiple subscriptions
    for (let i = 0; i < result.data.length; i += 1) {
      if (result.data[i].status === 'trialing' || result.data[i].status === 'active') {
        subscription = result.data[0];
      }
    }
  }

  return subscription;
};

export const upsertSubscription = async (
  id: bigint,
  customerID: string,
  paymentMehod?: string | Stripe.PaymentMethod | null
): Promise<Stripe.Subscription | null> => {
  const defaultPaymentMethod = '';
  let subscription = await getSubscription(id);

  if (!subscription) {
    subscription = await stripe.subscriptions.create({
      customer: customerID,
      items: [{ price: process.env.STRIPE_PRICE_ID }],
      default_payment_method: defaultPaymentMethod,
      metadata: { uid: id.toString() },
    });
  }
  return subscription;
};
