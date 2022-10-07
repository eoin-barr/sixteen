import { NextPage } from "next";
import React from "react";
import StripeCheckout from "react-stripe-checkout";

const TakeMoney: NextPage = () => {
  const a = " a";
  return (
    <StripeCheckout
      token={(token) => {
        console.log(token);
      }}
      stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
    />
  );
};

export default TakeMoney;
