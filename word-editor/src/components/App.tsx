import React from 'react'
import { ThemeProvider, Theme } from "@material-ui/core"
import ActionPanel from './panels/ActionsPanel';
import './App.scss'
import MainContentPanel from './panels/MainContentPanel';
import { TempDataManager } from '../utils/TempData';
import { WordGroupDataManager, WordGroupInfo, Word } from '../utils/WordGroup';
import GroupsListPanel from './panels/GroupsListPanel';
import WordsListPanel from './panels/WordsListPanel';
import NewGroupPopup from './popups/NewGroupPopup';
import GroupDeletePopup from './popups/GroupDeletePopup';

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
    shownPopup: "none" | "groupDelete" | "wordEdit" | "wordDelete" | "groupCreate";
    popupData: any;
}

export default class App extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.state = {
            tempData: new TempDataManager({ path: props.config.tmpDataFilePath }),
            wordGroups: null,
            selectedWordGroup: -1,
            shownPopup: "none",
            popupData: null
        }
        try {
            this.state = {
                ...this.state,
                wordGroups: new WordGroupDataManager({ path: this.state.tempData.getData().lastFile })

            };
        } catch (error) {
        }
    }

    public selectWordsGroup = (wordsGroupIndex: number) => {
        const { wordGroups } = this.state;
        wordGroups?.loadWords(wordsGroupIndex);
        this.setState({ selectedWordGroup: wordsGroupIndex });
    }

    private changePopup = (popup: "none" | "groupDelete" | "wordEdit" | "wordDelete" | "groupCreate", data?: any) => {
        if (data)
            this.setState({ shownPopup: popup, popupData: data });
        else
            this.setState({ shownPopup: popup });
    }

    private deleteGroup = (index: number) => {
        const { wordGroups } = this.state;
        wordGroups?.deleteGroup(index);
        this.forceUpdate();
    }

    private createGroup = (group: WordGroupInfo) => {
        const { wordGroups } = this.state;
        wordGroups?.createNewGroup(group);
        this.setState({ selectedWordGroup: -1 });
    }

    private createWord = (word: Word) => {
        const { wordGroups, selectedWordGroup } = this.state;
        wordGroups?.createWord(word, selectedWordGroup);
        this.forceUpdate();
    }

    private deleteWord = (index: number) => {
        const { wordGroups, selectedWordGroup } = this.state;
        wordGroups?.deleteWord(selectedWordGroup, index);
        this.forceUpdate();
    }

    private getActionByString = (action: string) => {
        switch (action) {
            case "new_group":
                return () => this.changePopup("groupCreate", null);
        }
        return () => { };
    }

    public render(): React.ReactNode {
        const {
            actions,
            theme
        } = this.props.config;
        const {
            wordGroups,
            selectedWordGroup,
            shownPopup,
            popupData
        } = this.state;
        return (
            <ThemeProvider theme={theme}>
                <div className="app">
                    <ActionPanel actions={actions.map((value: ActionData) => {
                        return {
                            ...value,
                            onClick: this.getActionByString(value.action)
                        }
                    })} />
                    <MainContentPanel opened={wordGroups !== null}>
                        <GroupsListPanel
                            changePopup={this.changePopup}
                            selected={selectedWordGroup}
                            groups={wordGroups?.getData().map((value) => value.info) ?? []}
                            selectWordGroup={this.selectWordsGroup}
                        />
                        <WordsListPanel
                            wordGroup={wordGroups?.getData()[selectedWordGroup]}
                            createWord={this.createWord}
                            deleteWord={this.deleteWord}
                        />
                    </MainContentPanel>

                    <GroupDeletePopup
                        isOpened={shownPopup === "groupDelete"}
                        close={() => this.changePopup("none")}
                        popupData={popupData}
                        deleteGroup={this.deleteGroup}
                    />

                    <NewGroupPopup
                        isOpened={shownPopup === "groupCreate"}
                        close={() => this.changePopup("none")}
                        createGroup={this.createGroup}
                    />
                </div>
            </ThemeProvider>
        );

    }

}