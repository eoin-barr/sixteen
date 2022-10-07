import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";

import { GET_USER } from "../graphql";

const Success: NextPage = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_USER);

  useEffect(() => {
    if (data) {
      if (data.me.stripeId === "") {
        router.push("/subscribe");
      }
    }
  }, [data]);

  return (
    <div className='h-screen w-screen flex items-center justify-center text-gray-900'>
      {loading ? (
        <div>loading</div>
      ) : error ? (
        <div>{error.message}</div>
      ) : (
        data && (
          <div className='px-8 py-6 bg-white rounded-lg'>
            <p>
              Email: <span className='pl-9'>{data.me.email}</span>
            </p>
            <p>
              Stripe ID:{" "}
              <span className='pl-3'>****{data.me.stripeId.slice(-4)}</span>
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default Success;
