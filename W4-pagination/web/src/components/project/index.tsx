import React from 'react';
import Image from 'next/image';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  project: any;
  className?: string;
}

export default function ProjectCard(props: Props) {
  const { project, className, ...rest } = props;
  console.log(project);
  return (
    <div className=" py-8 rounded-lg">
      <Image
        height={320}
        width={213}
        src={project.image}
        alt={'project'}
        className="rounded-lg"
      />
    </div>
  );
}
