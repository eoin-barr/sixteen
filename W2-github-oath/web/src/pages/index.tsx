import Image from 'next/image';
import type { NextPage } from 'next';
import { AiFillGithub, AiOutlineMinus } from 'react-icons/ai';
import { useUserSession } from '../lib/hooks';

const Home: NextPage = () => {
  const { user, ...userStatus } = useUserSession();
  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center bg-black text-white">
      {userStatus.loading ? (
        <div>Loading</div>
      ) : user ? (
        <div className="flex flex-col items-center justify-center">
          <div>
            <p className="text-2xl pb-4">OAuth Login Successful</p>
          </div>
          <div className="flex flex-col items-center justify-center border border-gray-500 rounded-lg py-8 sm:px-12 px-8">
            <div className="flex items-center justify-center">
              <AiFillGithub className="" size={80} />
              <div className="ml-1 mr-2 h-[1px] w-24 bg-white" />
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
          <div className="py-8">
            <button className="bg-gray-700 p-2 rounded-lg">Logout</button>
          </div>
        </div>
      ) : (
        <div>Hmmm </div>
      )}
    </div>
  );
};

export default Home;
