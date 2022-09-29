import { useState } from 'react';
import type { NextPage } from 'next';
import { useQuery } from '@apollo/client';
import { GET_POSTS } from '../graphql/queries';
import OffsetNav from '../components/nav/offset';
import Repo from '../components/repo/repo';

export const PAGE_SIZE = 6;

const Home: NextPage = () => {
  const [page, setPage] = useState<number>(0);

  const { data, error, loading } = useQuery(GET_POSTS, {
    variables: {
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    },
  });

  const max = data ? Math.ceil(data.postSummary.count / PAGE_SIZE) : null;

  return (
    <div className="relative min-h-screen w-screen flex items-start justify-center bg-[#0D1117] pb-20">
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
                <div className="text-2xl py-4">Offset Based Pagination</div>
                {data.postSummary.posts.map((post: any) => (
                  <Repo key={post.id} id={post.id} title={post.title} />
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

