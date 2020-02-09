import React from 'react'
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Icon } from '@material-ui/core'
import { WordGroupInfo } from '../../utils/WordGroup';

interface Props {
    groups: WordGroupInfo[];
    selected: number;
    selectWordGroup: (index: number) => void;
    changePopup: (popup: "none" | "groupDelete" | "wordEdit" | "wordDelete", data: any) => void;
}

export default class GroupsListPanel extends React.Component<Props> {

    public render(): React.ReactNode {
        const { groups, selected, selectWordGroup, changePopup } = this.props;
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
                            onClick={() => selectWordGroup(index)}
                        >
                            <ListItemText
                                primary={value.name}
                                secondary={value.filename}
                            />
                            <ListItemSecondaryAction>
                                <IconButton onClick={() => changePopup("groupDelete", { groupName: value.name, groupId: index })} size="small">
                                    <Icon fontSize="small">delete</Icon>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>)}
                </List>
            </div>
        );
    }

}