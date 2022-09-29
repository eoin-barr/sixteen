import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { MdOutlineGridView } from 'react-icons/md';
import InfiniteScroll from 'react-infinite-scroll-component';

import { ALL_PROJETS } from '../graphql';
import ProjectCard from '../components/project';
import { FillLoadingSpinner } from '../components/loading';

const ProjectsPage: NextPage = () => {
  const router = useRouter();

  const { loading, error, data, fetchMore } = useQuery(ALL_PROJETS, {
    variables: {
      first: 4,
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;
  if (data.projects.length < 1) {
    return <div>No projects to see :/ </div>;
  }

  const { endCursor, hasNextPage } = data.projects.pageInfo;

  function loadMore() {
    fetchMore({
      // eslint-disable-next-line radix
      variables: { after: parseInt(endCursor) },
      updateQuery: (prevResult: any, { fetchMoreResult }) => {
        fetchMoreResult.projects.edges = [
          ...prevResult.projects.edges,
          ...fetchMoreResult.projects.edges,
        ];
        return fetchMoreResult;
      },
    });
  }

  return (
    <div className="relative flex flex-col items-center justify-start py-6 bg-[#0D1117] px-2">
      <div className="absolute top-6 right-2 w-10 h-10">
        <MdOutlineGridView
          onClick={() => router.push('/')}
          className="text-gray-400 h-8 w-8 hover:text-white cursor-pointer"
        />
      </div>
      <div>
        <h2 className="max-w-[720px] md:text-3xl text-lg text-center text-gray-300 pt-2">
          Cursor Based Pagination - Infinite Scroll
        </h2>
      </div>
      <div className="w-150">
        <InfiniteScroll
          dataLength={data?.projects.edges.length}
          next={loadMore}
          hasMore={hasNextPage}
          loader={<FillLoadingSpinner className="mt-n-80" color="border-white" />}
          className="flex flex-col justify-start items-center overflow-y-scroll"
        >
          {data?.projects.edges.map(({ node }: any) => (
            <ProjectCard project={node} key={node.id} />
          ))}
          {!hasNextPage && (
            <p className="my-10 text-center font-medium text-white">
              You have reached the end
            </p>
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ProjectsPage;
