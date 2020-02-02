import React from 'react'
import "./app.scss"
import GroupPickerPage, { WordGroup } from './GroupPickerPage'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import WordsTraining from './WordsTraining';
import { ThemeProvider } from '@material-ui/core';
import theme from './MuiTheme';

export default class App extends React.Component {

    public render(): React.ReactNode {
        return (
            <ThemeProvider theme={theme}>
                <div className="app-wrapper">
                    <Router>
                        <Switch>
                            <Route path="/words">
                                <WordsTraining />
                            </Route>
                            <Route exact path="/">
                                <GroupPickerPage />
                            </Route>
                        </Switch>
                    </Router>
                </div>
            </ThemeProvider>
        );
    }

}