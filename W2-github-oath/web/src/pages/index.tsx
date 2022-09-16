import type { NextPage } from 'next';
import { useUserSession } from '../lib/hooks';

const Home: NextPage = () => {
  const { user, ...userStatus } = useUserSession();
  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center bg-blue-500">
      {userStatus.loading ? (
        <div>Loading</div>
      ) : user ? (
        <div>Logged in</div>
      ) : (
        <div>Hmmm </div>
      )}
    </div>
  );
};

export default Home;
