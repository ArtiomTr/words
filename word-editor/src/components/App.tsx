import React from 'react'
import { ThemeProvider, Theme } from "@material-ui/core"
import { ActionProps } from './common/ActionComponent';
import ActionPanel from './panels/ActionsPanel';
import './App.scss'
import MainContentPanel from './panels/MainContentPanel';
import { TempDataManager } from '../utils/TempData';
import { WordGroupDataManager } from '../utils/WordGroup';
import GroupsListPanel from './panels/GroupsListPanel';

export interface AppConfig {

    actions: ActionProps[];
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
}

export default class App extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.state = {
            tempData: new TempDataManager({ path: props.config.tmpDataFilePath }),
            wordGroups: null,
            selectedWordGroup: -1
        }
        try {
            this.state = {
                ...this.state,
                wordGroups: new WordGroupDataManager({ path: this.state.tempData.getData().lastFile })

            };
        } catch (error) {
        }
    }

    public render(): React.ReactNode {
        const {
            actions,
            theme
        } = this.props.config;
        const {
            wordGroups,
            selectedWordGroup
        } = this.state;
        return (
            <ThemeProvider theme={theme}>
                <div className="app">

                    <ActionPanel actions={actions} />

                    <MainContentPanel opened={wordGroups !== null}>

                        <GroupsListPanel
                            selected={selectedWordGroup}
                            groups={wordGroups?.getData().map((value) => value.info) ?? []}
                        />

                    </MainContentPanel>

                </div>
            </ThemeProvider>
        );

    }

}