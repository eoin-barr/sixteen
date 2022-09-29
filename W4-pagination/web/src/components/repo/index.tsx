import React from 'react';
import { VscRepo } from 'react-icons/vsc';
import { AiOutlineStar } from 'react-icons/ai';

interface Props {
  id: number;
  title: string;
}

function Badge({ title }: { title: string }) {
  return (
    <div className="px-2 py-1 rounded-xl text-blue-400 text-xs bg-[#172239] mx-0.5">
      {title}
    </div>
  );
}

function Access() {
  return (
    <div className="px-2 ml-2 rounded-xl text-[#CB9D35] text-xs border border-[#CB9D35] mx-0.5">
      Public archive
    </div>
  );
}

function Badges() {
  return (
    <div className="flex items-center justify-start">
      <Badge title="react-native" />
      <Badge title="typescript" />
      <Badge title="plugin" />
      <Badge title="cli" />
      <Badge title="framex" />
    </div>
  );
}

export default function Repo(props: Props) {
  const { id, title } = props;

  return (
    <div
      key={id}
      className="flex items-start justify-start md:w-[720px] w-[calc(100vw - 20px)] border border-gray-700 my-2 rounded-md p-6"
    >
      <div className="pt-0.5">
        <VscRepo className="h-5 w-5 text-gray-500" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center justify-start">
          <p className="ml-2 text-blue-400">{title}</p>
          <Access />
        </div>
        <p className="my-2">Description of the repository goes here</p>

        <Badges />
        <div className="flex items-center justify-start pt-2 text-gray-400">
          <AiOutlineStar />
          <p className="text-xs mx-2">29</p>
          <div className="flex items-center px-2 truncate">
            <div className="h-4 w-4 rounded-full bg-[#4275C3]" />
            <p className="text-xs mx-2">TypeScript</p>
            <p className="text-xs mx-2">MIT Licence</p>
            <p className="text-xs mx-2 md:flex hidden">Updated on Sep 28, 2022</p>
          </div>
        </div>
      </div>
    </div>
  );
}
