import React from 'react'
import { type2wordAlias, typeColorAlias } from '../../utils/WordTypes';

interface Props {
    type: string;
}

export const WordTypeComponent: React.FunctionComponent<Props> = (props) => {
    return (
        <span
            className="word-type"
            style={{
                backgroundColor: (typeColorAlias as any)[props.type] ?? typeColorAlias.UNKNWN
            }}
        >
            {(type2wordAlias as any)[props.type] ?? type2wordAlias.UNKNWN}
        </span>
    );
}