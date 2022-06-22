import Stripe from 'stripe';


export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  // @ts-ignore
  apiVersion: '2020-08-27'  // to avoid ts-ignore would be required to update the dependency
});
