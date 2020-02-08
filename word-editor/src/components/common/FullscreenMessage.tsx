import React from 'react'
import { Typography } from '@material-ui/core'

interface Props {
    message: string;
}

export const FullscreenMessage: React.FunctionComponent<Props> = (props) => {
    return <div className="fs-message">
        <Typography className="fs-message__text" variant="h4" align="center">{props.message}</Typography>
    </div>
}