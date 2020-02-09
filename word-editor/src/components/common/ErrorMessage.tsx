import React from 'react'
import { Icon, Typography } from '@material-ui/core'
import "./ErrorMessage.scss"

interface Props {
    children: string;
}

export const ErrorMessage: React.FunctionComponent<Props> = (props) => {
    const { children } = props;
    return (
        <div className="error-message">
            <Icon color="inherit">
                error
            </Icon>
            <Typography color="inherit" className="error-message__text">
                {children}
            </Typography>
        </div>
    );
}