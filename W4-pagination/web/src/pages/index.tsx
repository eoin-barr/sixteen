import { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { MdOutlineGridView } from 'react-icons/md';

import { GET_REPOS } from '../graphql';
import Repo from '../components/repo';
import OffsetNav from '../components/nav/offset';

export const PAGE_SIZE = 3;

const Home: NextPage = () => {
  const router = useRouter();
  const [page, setPage] = useState<number>(0);

  const { data, error, loading } = useQuery(GET_REPOS, {
    variables: {
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    },
  });

  const max = data ? Math.ceil(data.repoSummary.count / PAGE_SIZE) : null;

  return (
    <div className="relative min-h-screen w-screen flex items-start justify-center bg-[#0D1117] pb-20">
      <div className="absolute top-6 right-2 w-10 h-10">
        <MdOutlineGridView
          onClick={() => router.push('/project')}
          className="text-gray-400 h-8 w-8 hover:text-white cursor-pointer"
        />
      </div>
      <div className="flex flex-col items-center justify-center ">
        <div className="flex flex-col items-center justify-center pt-4">
          {loading ? (
            <p>Loading</p>
          ) : error ? (
            <p>error</p>
          ) : (
            data &&
            max && (
              <div className="flex flex-col items-center justify-start px-2">
                <div className="flex justify-center items-center text-center md:text-3xl text-xl py-4 text-gray-300">
                  Offset Based Pagination - Unidirectional
                </div>
                {data.repoSummary.repos.map((repo: any) => (
                  <Repo key={repo.id} id={repo.id} title={repo.title} />
                ))}
                <OffsetNav max={max} data={data} setPage={setPage} page={page} />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
