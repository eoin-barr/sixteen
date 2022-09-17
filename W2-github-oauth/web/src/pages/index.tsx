import Image from 'next/image';
import type { NextPage } from 'next';
import { AiFillGithub } from 'react-icons/ai';
import { HiCheckCircle } from 'react-icons/hi';

import { useUserSession } from '../lib/hooks';
import { logout } from '../lib/auth';
import Loading from '../components/loading';

const Home: NextPage = () => {
  const { user, ...userStatus } = useUserSession();
  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center bg-purple1 text-white">
      {userStatus.loading ? (
        <Loading />
      ) : user ? (
        <div className="flex flex-col items-center justify-center">
          <div>
            <p className="text-2xl pb-8">OAuth Login Successful</p>
          </div>
          <div className="relative flex flex-col items-center justify-center rounded-lg py-8 sm:px-12 px-8 bg-purple4">
            <div className="absolute top-[3.75rem] left-[46%] right-[54%] bg-purple4 h-4 w-5 rounded-full">
              <HiCheckCircle className="h-6 w-6 text-green-500 bg-purpl-2" />
            </div>
            <div className="flex items-center justify-center">
              <AiFillGithub className="" size={80} />
              <div className="ml-1 border-t border-dashed border-t-[1px] mr-2 h-0 w-24 bg-purple5" />
              <Image
                className="rounded-full"
                src={user.githubAvatarUrl}
                alt={'profile'}
                height={80}
                width={80}
              />
            </div>
            <div className="pt-4">
              <div>
                <p className="text-md">
                  Username: <span className="pl-3">{user.githubUsername}</span>
                </p>
              </div>
              <div>
                <p className="text-md">
                  Email: <span className="pl-12">{user.email}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="py-10">
            <button
              onClick={logout}
              className="w-[100%] bg-purple2 hover:bg-purple3 p-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div>Error</div>
      )}
    </div>
  );
};

export default Home;
