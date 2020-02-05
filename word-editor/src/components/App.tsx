import React from 'react'
import { ThemeProvider, Theme } from "@material-ui/core"
import { ActionProps } from './common/ActionComponent';
import ActionPanel from './panels/ActionsPanel';
import './App.scss'
import MainContentPanel from './panels/MainContentPanel';
import { TempDataManager } from '../utils/TempData';

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
}

export default class App extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.state = {
            tempData: new TempDataManager(props.config.tmpDataFilePath)
        }
    }

    public render(): React.ReactNode {
        const config = this.props.config;
        const {
            actions,
            theme
        } = config;
        return (
            <ThemeProvider theme={theme}>
                <div className="app">

                    <ActionPanel actions={actions} />

                    <MainContentPanel>

                    </MainContentPanel>

                </div>
            </ThemeProvider>
        );

    }

}