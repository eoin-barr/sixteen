import { NextPage } from 'next';
import { TbSend } from 'react-icons/tb';
import React, { useEffect, useState } from 'react';
import { ApolloError, useMutation } from '@apollo/client';

import { getUserId } from '../lib/auth';
import { CREATE_MESSAGE } from '../graphql/queries';
import { MessageList } from '../componenets/message';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  loading: boolean;
  handleEnter: Function;
  error: ApolloError | undefined;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  handleSubmit: React.MouseEventHandler<HTMLButtonElement>;
}

function Header() {
  return (
    <div className="HEADER topbar flex items-center justify-center h-[60px] bg-[#222C32] rounded-t-lg shadow-xl">
      <p className="text-2xl font-light text-[#9DA3AE] shadow-xl">Chats</p>
    </div>
  );
}

function Footer(props: Props) {
  const { text, handleChange, handleEnter, handleSubmit, loading, error, ...rest } =
    props;
  return (
    <div className="FOOTER flex h-[62px] bg-[#222C32] px-4 py-2 rounded-b-lg" {...rest}>
      <input
        placeholder="Type a message"
        value={text}
        onChange={handleChange}
        onKeyPress={(e) => handleEnter(e.key)}
        className="flex-1 rounded-lg mr-4 p-4 bg-[#2D3941] text-[#9DA3AE] ring-non outline-none"
      />
      <button onClick={handleSubmit} className="p-2 rounded-md ">
        {loading ? (
          'Loading'
        ) : error ? (
          'Error'
        ) : (
          <TbSend className={'h-6 w-6 text-blue-500'} />
        )}
      </button>
    </div>
  );
}

const Messages: NextPage = () => {
  const [text, setText] = useState('');
  const [uid, setUid] = useState(null);

  const pageClasses = `PAGE w-full flex flex-col items-center justify-center bg-[#111417]`;
  const chatClasses = `CHAT chats h-[calc(100vh-122px)] overflow-y-scroll flex flex-col-reverse`;

  const [createMessage, { loading, error }] = useMutation(CREATE_MESSAGE, {
    variables: {
      text,
      userId: uid,
    },
    onCompleted: () => {
      setText('');
    },
  });

  useEffect(() => {
    const getUid = async () => {
      const id = await getUserId();
      if (!id) {
        window.location.href = '/login';
      }
      setUid(id);
    };
    getUid();
  }, []);

  const handleEnter = (key: string) => {
    if (key === 'Enter' && text !== '') {
      createMessage();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async () => {
    if (!text || !uid) return;
    await createMessage()
      .then(() => {
        console.log('success');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={pageClasses}>
      <div className="COL md:w-[720px] w-screen">
        <Header />
        <div className={chatClasses}>{uid && <MessageList uid={uid} />}</div>
        <Footer
          text={text}
          error={error}
          loading={loading}
          handleEnter={handleEnter}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Messages;
