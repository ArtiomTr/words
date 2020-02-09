import React from 'react'
import { ButtonBase, Icon, Typography } from '@material-ui/core'

export interface ActionProps {

    name: string;
    icon: string;
    onClick: () => void;

}

export default class ActionComponent extends React.Component<ActionProps> {

    public render(): React.ReactNode {
        const { name, icon, onClick } = this.props;
        return (
            <ButtonBase onClick={onClick} className="app-actions__action">
                <Icon>{icon}</Icon>
                <Typography className="app-panel__action-name">{name}</Typography>
            </ButtonBase>
        );

    }

}