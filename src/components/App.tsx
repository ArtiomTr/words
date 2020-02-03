import React from 'react'
import "./app.scss"
import GroupPickerPage, { WordGroup } from './GroupPickerPage'
import { HashRouter as Router, Route, Switch, withRouter, RouteComponentProps } from 'react-router-dom'
import WordsTraining from './WordsTraining';
import { ThemeProvider } from '@material-ui/core';
import theme from './MuiTheme';

interface Props extends RouteComponentProps {

}

interface State {

}

const locationAlias = new Map<string, string>([
    ["/", "groupPicker"],
    ["/words", "words"]
]);

class App extends React.Component<Props> {

    private currentPage: "groupPicker" | "words" | "404";

    public constructor(props: Props) {
        super(props);
        this.currentPage = (locationAlias.get(props.location.pathname) as any) ?? "404";
    }

    public render(): React.ReactNode {
        this.currentPage = (locationAlias.get(this.props.location.pathname) as any) ?? "404";
        return (
            <ThemeProvider theme={theme}>
                <div className="app-wrapper">
                    <WordsTraining show={this.currentPage === "words"} />
                    <GroupPickerPage show={this.currentPage === "groupPicker"} />
                </div>
            </ThemeProvider>
        );
    }

}

export default withRouter(App);