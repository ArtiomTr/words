import React from 'react'
import ActionComponent, { ActionProps } from '../common/ActionComponent';

interface Props {

    actions: ActionProps[];

}

export default class ActionPanel extends React.Component<Props> {

    public render(): React.ReactNode {
        const { actions } = this.props;
        return (
            <div className="app-actions">
                {actions.map((value: ActionProps, index: number) =>
                    <ActionComponent key={index} {...value} />)}
            </div>
        );

    }

}