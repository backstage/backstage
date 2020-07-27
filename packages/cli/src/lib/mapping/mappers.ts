/*
 * Copyright 2020 DFDS A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import inquirer, { Answers, Question } from 'inquirer';
import { Command } from 'commander';

export async function mapInqueryAnswersFromCommanderOptions(questions: Question[], cmd: Command) : Promise<Answers>{
  if(questions.length == 0)
    return [];

  let answers: Answers = {};
  const filteredQuestions: Question[] = [];

  questions.forEach((question: Question) => {
    const questionName: string | undefined = question.name?.toString();  

    if(questionName)
    {
      if(!cmd.hasOwnProperty(questionName))
      {
        filteredQuestions.push(question);
      }
      else
      {
        answers[questionName] = cmd[questionName];
      }
    }
  });

  if(filteredQuestions.length > 0)
  {
    answers = {
      ...answers,
      ...await inquirer.prompt(filteredQuestions)
    };
  }  
  
  return answers;
}