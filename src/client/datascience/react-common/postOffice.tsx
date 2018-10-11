// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

'use strict';

import * as React from 'react';
import { IWebPanelMessage } from '../../common/application/types';

export interface IVsCodeApi {
    // tslint:disable-next-line:no-any
    postMessage(msg: any) : void;
    // tslint:disable-next-line:no-any
    setState(state: any) : void;
    // tslint:disable-next-line:no-any
    getState() : any;
}

export interface IMessageHandler {
    // tslint:disable-next-line:no-any
    handleMessage(type: string, payload?: any) : boolean;
}

interface IPostOfficeProps {
    messageHandlers: IMessageHandler[];
}

// This special function talks to vscode from a web panel
export declare function acquireVsCodeApi(): IVsCodeApi;

export class PostOffice extends React.Component<IPostOfficeProps> {

    constructor(props: IPostOfficeProps) {
        super(props);
    }

    public static canSendMessages() {
        // tslint:disable-next-line:no-typeof-undefined
        if (typeof acquireVsCodeApi !== 'undefined') {
            return true;
        }
        return false;
    }

    public static sendMessage(message: IWebPanelMessage) {
        if (PostOffice.canSendMessages()) {
            acquireVsCodeApi().postMessage(message);
        }
    }

    public componentDidMount() {
        window.addEventListener('message', this.handleMessages);
    }

    public componentWillUnmount() {
        window.removeEventListener('message', this.handleMessages);
    }

    public render() {
        return null;
    }

    private handleMessages = async (ev: MessageEvent) => {
        if (this.props) {
            const msg = ev.data as IWebPanelMessage;
            if (msg) {
                this.props.messageHandlers.forEach((h : IMessageHandler) => {
                    h.handleMessage(msg.type, msg.payload);
                });
            }
        }
    }
}
