import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import InfiniteScroll from 'react-infinite-scroll-component';
import React, { useEffect, useState, useRef, useCallback } from 'react';

import ProjectCard from '../components/project';
import { ALL_PROJETS } from '../graphql/queries';
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

  const handleClick = () => {
    router.push('/login');
  };

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

  const handleScroll = (e: any) => {
    const scrollHeight = e.target.documentElement.scrollHeight;
    const currentHeight = Math.ceil(
      e.target.documentElement.scrollTop + window.innerHeight
    );
    if (currentHeight + 1 >= scrollHeight) {
      loadMore();
    }
  };

  return (
    <div className="flex flex-col items-center justify-start py-6 bg-black">
      <div>
        <h2 className="text-3xl text-white">Unilateral Pagination - Infinite Scroll</h2>
      </div>
      <div className="w-150">
        <InfiniteScroll
          dataLength={data?.projects.edges.length}
          next={loadMore}
          hasMore={hasNextPage}
          loader={<FillLoadingSpinner className="mt-n-80" color="border-white" />}
          className="flex flex-col justify-start items-center overflow-y-scroll"
        >
          {data?.projects.edges.map(({ node }: any, index: any) => (
            <ProjectCard project={node} key={node.id} />
          ))}
          {!hasNextPage && (
            <p className="my-10 text-center font-medium text-white">
              You have reached the end
            </p>
          )}
        </InfiniteScroll>
        {/* {hasNextPage ? (
          <button
            className='px-4 py-2 bg-blue-500 text-white rounded my-10'
            onClick={() => loadMore()}
          >
            more
          </button>
        ) : (
          <p className='my-10 text-center font-medium'>
            You have reached the end
          </p>
        )} */}
      </div>
    </div>
  );
};

export default ProjectsPage;
