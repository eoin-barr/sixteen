import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

export default function Header({ title, ...rest }: Props) {
  return (
    <div className='sm:mx-auto sm:w-full sm:max-w-md' {...rest}>
      <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
        {title}
      </h2>
    </div>
  );
}
