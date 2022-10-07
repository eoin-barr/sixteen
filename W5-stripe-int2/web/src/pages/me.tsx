import React from "react";
import { NextPage } from "next";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../graphql";

const Me: NextPage = () => {
  const { data, loading, error } = useQuery(GET_USER);
  return (
    <div className='flex items-center justify-center bg-blue-500'>
      {error
        ? error.message
        : loading
        ? "loading..."
        : data
        ? `Email: ${data.me.email}`
        : ""}
      <>{console.log(data)}</>
    </div>
  );
};

export default Me;
