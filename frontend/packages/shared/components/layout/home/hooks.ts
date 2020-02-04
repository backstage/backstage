import { useEffect, useState } from 'react';
import StackOverflowClient from 'shared/apis/stackOverflow/StackOverflowClient';

type UnansweredQuestion = {
  title: string;
  link: string;
};

export function useStackOverflowQuestions(): UnansweredQuestion | undefined {
  const [questions, setQuestions] = useState<UnansweredQuestion[]>([]);

  useEffect(() => {
    StackOverflowClient.fetch(`questions/unanswered`).then(data => {
      setQuestions(data.items);
    });
  }, []);

  if (!questions || questions.length === 0) {
    return undefined;
  }

  return questions[Math.floor(Math.random() * questions.length)];
}
