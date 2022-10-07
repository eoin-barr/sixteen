import { useMutation } from "@apollo/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { REGISTER } from "../graphql";

const Home: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [register, { loading, error, data }] = useMutation(REGISTER, {
    variables: {
      email,
      password,
    },
  });

  useEffect(() => {
    if (!error && data) {
      router.push("/login");
    }
  }, [data]);

  const handleSubmit = () => {
    if (!email || !password) {
      return;
    }
    register();
  };

  return (
    <div className='flex items-center justify-center mt-6'>
      <div className='flex flex-col'>
        <div className='flex items-center justify-center text-2xl text-gray-800 py-2'>
          Register
        </div>
        <div className='py-2'>
          <input
            value={email}
            type={"email"}
            placeholder='email'
            onChange={(e) => setEmail(e.target.value)}
            className={
              "rounded-lg p-2 bg-white placeholder-gray-400 text-gray-900 focus:ring-0 caret-purple2 border-0 ring-0  focus:outline-none focus:ring-0"
            }
          />
        </div>
        <div className='py-2'>
          <input
            type='password'
            value={password}
            placeholder='password'
            onChange={(e) => setPassword(e.target.value)}
            className={
              "rounded-lg p-2 bg-white placeholder-gray-400 text-gray-900 focus:ring-0 caret-purple2 border-0 ring-0  focus:outline-none focus:ring-0"
            }
          />
        </div>
        <div className='py-2'>
          <button
            onClick={handleSubmit}
            className='rounded-lg p-2 bg-gray-400 w-[193px] bg-blue1 hover:bg-blue2 '
          >
            {loading ? "Loading" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
