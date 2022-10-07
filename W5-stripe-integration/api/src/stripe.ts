import { Stripe } from 'stripe';

export const stripe = new Stripe(
  'sk_test_51LovB5DCvNoFkjEwUmD8gkjPK2I5lg1Ucykpkks9Tztsz3EvWh0Fzkyu682j2r2JrTXSa5igo1FwLOm6IM3GhVdS00Gmowjeo8',
  {
    apiVersion: '2022-08-01',
  }
);
