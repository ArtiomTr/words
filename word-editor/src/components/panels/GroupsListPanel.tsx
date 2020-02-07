import React from 'react'
import { List, ListItem, ListItemText } from '@material-ui/core'
import { WordGroupInfo } from '../../utils/WordGroup';

interface Props {
    groups: WordGroupInfo[];
    selected: number;
}

export default class GroupsListPanel extends React.Component<Props> {

    public render(): React.ReactNode {
        const { groups, selected } = this.props;
        return (
            <div className="group-list">
                <List
                    dense
                    disablePadding
                >
                    {groups.map((value: WordGroupInfo, index: number) =>
                        <ListItem
                            button
                            dense
                            key={index}
                            selected={index === selected}
                        >
                            <ListItemText
                                primary={value.name}
                                secondary={value.filename}
                            />
                        </ListItem>)}
                </List>
            </div>
        );
    }

}