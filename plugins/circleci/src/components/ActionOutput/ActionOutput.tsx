import React, { useEffect, useState, FC } from 'react';

export const ActionOutput: FC<{ url: string }> = ({ url }) => {
    //@ts-ignore
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then((messages) => {
        messages && setMessages(messages.map(({message}: {message: string}) => message))
    });
  }, [url]);
  return <div>{messages}</div>;
};
