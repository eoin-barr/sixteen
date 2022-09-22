import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Container({ children, ...rest }: Props) {
  return (
    <div className='flex w-100 justify-center' {...rest}>
      <div className='min-h-full lg:w-140 w-86 flex flex-col justify-center sm:px-6 lg:px-8'>
        {children}
      </div>
    </div>
  );
}
