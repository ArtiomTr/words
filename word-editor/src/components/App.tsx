import React from 'react';
import { ThemeProvider, Theme } from '@material-ui/core';
import ActionPanel from './panels/ActionsPanel';
import './App.scss';
import MainContentPanel from './panels/MainContentPanel';
import { TempDataManager } from '../utils/TempData';
import { WordGroupDataManager, WordGroupInfo, Word } from '../utils/WordGroup';
import GroupsListPanel from './panels/GroupsListPanel';
import WordsListPanel from './panels/WordsListPanel';
import NewGroupPopup from './popups/NewGroupPopup';
import GroupDeletePopup from './popups/GroupDeletePopup';
import WordDeletePopup from './popups/WordDeletePopup';
import WordEditPopup from './popups/WordEditPopup';
import GroupEditPopup from './popups/GroupEditPopup';
const { dialog } = window.require('electron').remote;

interface ActionData {
    name: string;
    icon: string;
    action: string;
}

export interface AppConfig {
    actions: ActionData[];
    theme: Partial<Theme>;
    tmpDataFilePath: string;
}

interface Props {
    config: AppConfig;
}

interface State {
    tempData: TempDataManager;
    wordGroups: WordGroupDataManager | null;
    selectedWordGroup: number;
    shownPopup:
        | 'none'
        | 'groupDelete'
        | 'wordEdit'
        | 'wordDelete'
        | 'groupCreate'
        | 'groupEdit';
    popupData: any;
}

export default class App extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            tempData: new TempDataManager({
                path: props.config.tmpDataFilePath,
            }),
            wordGroups: null,
            selectedWordGroup: -1,
            shownPopup: 'none',
            popupData: null,
        };
        try {
            this.state = {
                ...this.state,
                wordGroups: new WordGroupDataManager({
                    path: this.state.tempData.getData().lastFile,
                }),
            };
        } catch (error) {}
    }

    public selectWordsGroup = (wordsGroupIndex: number) => {
        const { wordGroups } = this.state;
        wordGroups?.loadWords(wordsGroupIndex);
        this.setState({ selectedWordGroup: wordsGroupIndex });
    };

    private changePopup = (
        popup:
            | 'none'
            | 'groupDelete'
            | 'wordEdit'
            | 'wordDelete'
            | 'groupCreate'
            | 'groupEdit',
        data?: any
    ) => {
        if (data) this.setState({ shownPopup: popup, popupData: data });
        else this.setState({ shownPopup: popup });
    };

    private deleteGroup = (index: number) => {
        const { wordGroups } = this.state;
        wordGroups?.deleteGroup(index);
        this.forceUpdate();
    };

    private createGroup = (group: WordGroupInfo) => {
        const { wordGroups } = this.state;
        wordGroups?.createNewGroup(group);
        this.setState({ selectedWordGroup: -1 });
    };

    private editGroup = (group: WordGroupInfo) => {
        const { wordGroups, selectedWordGroup } = this.state;
        wordGroups?.editGroup(selectedWordGroup, group);
        this.forceUpdate();
    };

    private createWord = (word: Word) => {
        const { wordGroups, selectedWordGroup } = this.state;
        wordGroups?.createWord(word, selectedWordGroup);
        this.forceUpdate();
    };

    private deleteWord = (index: number) => {
        const { wordGroups, selectedWordGroup } = this.state;
        wordGroups?.deleteWord(selectedWordGroup, index);
        this.forceUpdate();
    };

    private editWord = (word: Word, index: number) => {
        const { wordGroups, selectedWordGroup } = this.state;
        wordGroups?.editWord(word, selectedWordGroup, index);
        this.forceUpdate();
    };

    private openNewFile = () => {
        dialog
            .showOpenDialog({
                title: 'Select new configuration file',
                properties: ['openFile'],
                filters: [
                    { name: 'JSON Files', extensions: ['json'] },
                    { name: 'All files', extensions: ['*'] },
                ],
            })
            .then((result: any) => {
                if (!result.canceled && result.filePaths.length > 0) {
                    this.state.tempData.setData({
                        lastFile: result.filePaths[0],
                    });
                    this.setState({
                        wordGroups: new WordGroupDataManager({
                            path: result.filePaths[0],
                        }),
                        selectedWordGroup: -1,
                        shownPopup: 'none',
                        popupData: null,
                    });
                    this.forceUpdate();
                }
            })
            .catch((err: any) => console.log(err));
    };

    private getActionByString = (action: string) => {
        switch (action) {
            case 'new_group':
                return () => this.changePopup('groupCreate', null);
            case 'open':
                return () => this.openNewFile();
        }
        return () => {};
    };

    public render(): React.ReactNode {
        const { actions, theme } = this.props.config;
        const {
            wordGroups,
            selectedWordGroup,
            shownPopup,
            popupData,
        } = this.state;
        return (
            <ThemeProvider theme={theme}>
                <div className="app">
                    <ActionPanel
                        actions={actions.map((value: ActionData) => {
                            return {
                                ...value,
                                onClick: this.getActionByString(value.action),
                            };
                        })}
                    />
                    <MainContentPanel opened={wordGroups !== null}>
                        <GroupsListPanel
                            changePopup={this.changePopup}
                            selected={selectedWordGroup}
                            groups={
                                wordGroups
                                    ?.getData()
                                    .map(value => value.info) ?? []
                            }
                            selectWordGroup={this.selectWordsGroup}
                        />
                        <WordsListPanel
                            wordGroup={wordGroups?.getData()[selectedWordGroup]}
                            createWord={this.createWord}
                            showWordEditPopup={(
                                wordData: Word,
                                wordId: number
                            ) =>
                                this.changePopup('wordEdit', {
                                    wordData,
                                    wordId,
                                })
                            }
                            showWordDeletionPopup={(
                                word: string,
                                wordId: number
                            ) =>
                                this.changePopup('wordDelete', { word, wordId })
                            }
                            showGroupEditPopup={() =>
                                this.changePopup(
                                    'groupEdit',
                                    wordGroups?.getData()[selectedWordGroup]
                                        .info
                                )
                            }
                        />
                    </MainContentPanel>

                    <GroupDeletePopup
                        isOpened={shownPopup === 'groupDelete'}
                        close={() => this.changePopup('none')}
                        popupData={popupData}
                        deleteGroup={this.deleteGroup}
                    />

                    <WordDeletePopup
                        isOpened={shownPopup === 'wordDelete'}
                        close={() => this.changePopup('none')}
                        popupData={popupData}
                        deleteWord={this.deleteWord}
                    />

                    <NewGroupPopup
                        isOpened={shownPopup === 'groupCreate'}
                        close={() => this.changePopup('none')}
                        createGroup={this.createGroup}
                    />

                    <GroupEditPopup
                        isOpened={shownPopup === 'groupEdit'}
                        close={() => this.changePopup('none')}
                        values={shownPopup === 'groupEdit' ? popupData : null}
                        editGroup={this.editGroup}
                    />

                    <WordEditPopup
                        isOpened={shownPopup === 'wordEdit'}
                        close={() => this.changePopup('none')}
                        editWord={this.editWord}
                        popupData={popupData}
                    />
                </div>
            </ThemeProvider>
        );
    }
}
