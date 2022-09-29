import React from 'react';
import { BiChevronRight, BiChevronLeft } from 'react-icons/bi';
import { PAGE_SIZE } from '../../pages';

interface ButtonProps {
  max: number;
  min: number;
  page: number;
  setPage: Function;
}

interface OffsetNavProps {
  data: any;
  max: number;
  setPage: Function;
  page: number;
}

function SetButton(props: ButtonProps) {
  const { min, max, setPage, page } = props;
  const base = `flex items-center justify-center md:w-9 w-7 md:px-2 px-1 py-1 rounded-md  border-black border`;

  return (
    <>
      {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((num) => (
        <button
          onClick={() => setPage(num - 1)}
          className={`${base} ${
            num - 1 === page ? 'bg-blue-500' : 'hover:border-gray-400'
          }`}
          key={num}
        >
          {num}
        </button>
      ))}
    </>
  );
}

function Gap() {
  return <div className="flex items-end justify-center w-9 text-gray-400">...</div>;
}

export default function OffsetNav(props: OffsetNavProps) {
  const { data, max, setPage, page } = props;

  return (
    <div className="absolute bottom-4 flex items-center justify-center pt-4 md:text-lg text-xs">
      <button
        disabled={!page}
        onClick={() => setPage((prev: number) => prev - 1)}
        className="flex items-center justify-center text-white md:p-2 p-1 rounded-md md:w-24 w-16 disabled:text-gray-600"
      >
        <BiChevronLeft />
        Prev
      </button>
      {max <= 10 ? (
        <>
          <SetButton setPage={setPage} page={page} min={1} max={max} />
        </>
      ) : page + 1 < 7 ? (
        page + 1 < 4 ? (
          <>
            <SetButton setPage={setPage} page={page} min={1} max={5} />
            <Gap />
            <SetButton setPage={setPage} page={page} min={max - 1} max={max} />
          </>
        ) : (
          <>
            <SetButton setPage={setPage} page={page} min={1} max={page + 3} />
            <Gap />
            <SetButton setPage={setPage} page={page} min={max - 1} max={max} />
          </>
        )
      ) : page > max - 7 ? (
        page > max - 4 ? (
          <>
            <SetButton setPage={setPage} page={page} min={1} max={2} />
            <Gap />
            <SetButton setPage={setPage} page={page} min={max - 4} max={max} />
          </>
        ) : (
          <>
            <SetButton setPage={setPage} page={page} min={1} max={2} />
            <Gap />
            <SetButton setPage={setPage} page={page} min={page - 1} max={max} />
          </>
        )
      ) : (
        <>
          <SetButton setPage={setPage} page={page} min={1} max={2} />
          <Gap />
          <SetButton setPage={setPage} page={page} min={page - 1} max={page + 3} />
          <Gap />
          <SetButton setPage={setPage} page={page} min={max - 1} max={max} />
        </>
      )}
      <button
        disabled={data.postSummary.count <= (page + 1) * PAGE_SIZE}
        onClick={() => setPage((prev: number) => prev + 1)}
        className="flex items-center justify-center text-white md:p-2 p-1 rounded-md md:w-24 w-16 disabled:text-gray-600"
      >
        Next <BiChevronRight />
      </button>
    </div>
  );
}
