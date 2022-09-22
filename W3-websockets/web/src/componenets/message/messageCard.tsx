import React from 'react';
import { Message } from './messageList';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  message: Message;
  uid: number;
}

export function MessageCard(props: Props) {
  const { message, uid, ...rest } = props;
  const isOwner = message.userId === uid;
  const classes = `flex flex-col items-start justify-start text-white py-2 px-4 `;

  return (
    <div
      className={`relative mb-4 flex rounded-b-lg ${
        isOwner ? 'bg-[#265b4c] rounded-l-lg ' : 'bg-[#222c32] rounded-r-lg'
      }`}
    >
      <div className={classes} {...rest}>
        <div className="flex items-start justify-start">
          <h4>{message.text}</h4>
        </div>
      </div>
    </div>
  );
}
