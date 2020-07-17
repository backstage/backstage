import React from 'react';
import ReactDOM from 'react-dom';
import { useAsync } from 'react-use';

import { useApi, githubAuthApiRef } from '@backstage/core';

import {
    Card
} from '@material-ui/core';

export const HelloWorld = ({element}: {element: HTMLElement}) => {
    const githubApi = useApi(githubAuthApiRef);

    const status = useAsync(async () => {
        const token = await githubApi.getAccessToken('repo');
        console.log(token)
    });

    console.log(element)
    return element ? ReactDOM.createPortal((
        <div>Hej!</div>
    ), element) : null;
    /*return (
        <div>Hej!</div>
    );*/
};