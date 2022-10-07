import { useMutation } from "@apollo/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import { CREATE_STRIPE_SUBSCRIPTION } from "../graphql";

const TakeMoney: NextPage = () => {
  const router = useRouter();
  const [tid, setTid] = useState("");

  const [createStripeSubscription, { data, loading, error }] = useMutation(
    CREATE_STRIPE_SUBSCRIPTION,
    {
      variables: {
        source: tid,
      },
      onCompleted: (d) => {
        console.log(d);
        router.push("/success");
      },
    }
  );

  useEffect(() => {
    if (tid === "") {
      return;
    }
    createStripeSubscription();
  }, [tid]);

  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      {loading ? (
        <p>loading...</p>
      ) : error ? (
        <p>{error.message}</p>
      ) : (
        <StripeCheckout
          token={async (token) => {
            console.log("TID", token.id);
            setTid(token.id);
          }}
          stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
        />
      )}
    </div>
  );
};

export default TakeMoney;
