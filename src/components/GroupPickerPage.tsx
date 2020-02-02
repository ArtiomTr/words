import React from 'react'
import { Typography, Paper, List, ListItem, ListItemText, CircularProgress } from "@material-ui/core"
import axios from 'axios'

interface Props {
}

export interface WordGroup {
    filename: string,
    name: string,
    description: string,
}

interface State {
    wordGroups: WordGroup[];
    loaded: boolean
}

export default class GroupPickerPage extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.state = {
            wordGroups: [],
            loaded: false
        }
        this.loadWordGroups();
    }

    private loadWordGroups = async () => {
        const res = await axios.get("https://raw.githubusercontent.com/ArtiomTr/words/api/groups.json");
        this.setState({ wordGroups: res.data, loaded: true });
    }

    public render(): React.ReactNode {
        const { wordGroups, loaded } = this.state;
        return (
            <Paper className="app-box" elevation={3}>
                <Typography variant="h4">Choose words group</Typography>
                {loaded ?
                    <List>
                        {wordGroups.map((value: WordGroup) =>
                            <ListItem
                                key={value.filename}
                                button
                                onClick={() => {
                                    localStorage.setItem("words_group", JSON.stringify(value));
                                    window.location.href = window.location.href + "words";
                                }}
                            >
                                <ListItemText primary={value.name} secondary={value.description} />
                            </ListItem>)}
                    </List>
                    : <CircularProgress variant="indeterminate" />
                }
            </Paper>

        );
    }

}