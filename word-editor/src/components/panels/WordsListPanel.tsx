import React from 'react'
import { Word, WordGroup } from '../../utils/WordGroup';
import { List, ListItem, ListItemText, IconButton, Icon, ListItemSecondaryAction, Typography } from '@material-ui/core';
import { FullscreenMessage } from '../common/FullscreenMessage';
import ActionButton from '../common/ActionButton';
import { WordTypeComponent } from '../common/WortTypeComponent';

interface Props {
    wordGroup?: WordGroup;
    createWord: (word: Word) => void;
    showWordDeletionPopup: (word: string, wordIndex: number) => void;
    showWordEditPopup: (word: Word, index: number) => void;
}

interface State {
    isCreatingNewWord: boolean;
}

export default class WordsListPanel extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.state = {
            isCreatingNewWord: false
        }
    }

    private openWordCreationWindow = (): void => {
        this.setState({ isCreatingNewWord: true });
    }

    private closeWordCreationWindow = (): void => {
        this.setState({ isCreatingNewWord: false });
    }

    public render(): React.ReactNode {
        const { wordGroup, createWord, showWordDeletionPopup, showWordEditPopup } = this.props;
        const { isCreatingNewWord } = this.state;
        return (
            <div className="word-list">
                {wordGroup && wordGroup.words.length === 0 &&
                    <FullscreenMessage message="Group with 0 words ಠ_ಠ" />}
                {!wordGroup &&
                    <FullscreenMessage message="Click on group from list to show words" />}
                {wordGroup &&
                    <>
                        <div className="word-list__title">
                            <Typography variant="h5">
                                {wordGroup.info.name}
                                <IconButton style={{ marginLeft: 15 }}>
                                    <Icon fontSize="small">edit</Icon>
                                </IconButton>
                            </Typography>
                            <Typography variant="body1">{wordGroup.info.description}</Typography>
                            <Typography className="word-list__title-path" variant="body1">{wordGroup.info.filename}</Typography>
                        </div>
                        <List
                            style={{ paddingBottom: 100 }}
                        >
                            {wordGroup.words.map((value: Word, index: number) =>
                                <ListItem
                                    dense
                                    key={index}
                                    button
                                    style={{ paddingRight: "75px" }}
                                >
                                    <ListItemText
                                        secondary={value.definition}
                                    >
                                        {value.word}
                                        <WordTypeComponent type={value.type} />
                                    </ListItemText>
                                    <ListItemSecondaryAction>
                                        <IconButton onClick={() => showWordEditPopup(value, index)} style={{ marginRight: 5 }} size="small" edge="end">
                                            <Icon fontSize="small">edit</Icon>
                                        </IconButton>
                                        <IconButton onClick={() => showWordDeletionPopup(value.word, index)} size="small" edge="end">
                                            <Icon fontSize="small">delete</Icon>
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>)}
                        </List>
                        <ActionButton
                            createWord={createWord}
                            active={isCreatingNewWord}
                            open={this.openWordCreationWindow}
                            close={this.closeWordCreationWindow}
                        />
                    </>
                }
            </div>
        );

    }

}