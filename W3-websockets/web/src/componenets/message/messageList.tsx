import React from 'react';
import { useQuery } from '@apollo/client';

import { MessageCard } from './messageCard';
import { GET_ALL_MESSAGES, MESSAGES_SUBSCRIPTION } from '../../graphql/queries';

export interface Message {
  id: number;
  text: string;
  userId: number;
}

export function MessageList({ uid }: { uid: number }) {
  const classes = `flex flex-col justify-end px-4 pt-2`;

  const { loading, error, data, subscribeToMore } = useQuery(GET_ALL_MESSAGES, {
    nextFetchPolicy: 'cache-first',
  });

  subscribeToMore({
    document: MESSAGES_SUBSCRIPTION,
  });

  subscribeToMore({
    document: MESSAGES_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data || prev.messages === undefined) return prev;
      const newMessage = subscriptionData.data.createMessage;

      try {
        const exists = prev.messages.find(({ id }: any) => id === newMessage.id);
        if (exists) return prev;
      } catch (e) {
        console.log('err', e);
      }
      return { ...prev, messages: [...prev.messages, newMessage] };
    },
  });

  if (loading) return <div>loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <div className={classes}>
      {data &&
        data.messages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex ${message.userId === uid ? 'self-end' : 'self-start'} `}
          >
            {message.userId !== uid && (
              <div className="w-0 h-0 border-t-[0px] border-b-[15px] border-b-transparent border-r-[15px] border-r-[#222c32]" />
            )}
            <MessageCard uid={uid} message={message} />
            {message.userId === uid && (
              <div className="w-0 h-0 border-t-[0px] border-b-[15px] border-b-transparent border-l-[15px] border-l-[#265b4c]" />
            )}
          </div>
        ))}
    </div>
  );
}
