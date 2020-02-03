import React from 'react'
import { Paper, Button, CircularProgress, Typography, OutlinedInput, IconButton, Icon, Link } from '@material-ui/core';
import Axios from 'axios';
import { WordGroup } from './GroupPickerPage';
import classNames from 'classnames';

interface Word {
    word: string;
    definition: string;
    pronunciation: string;
    type: string;
}

interface Props {
    show: boolean;
}

interface State {

    words: Word[];
    loaded: boolean;
    started: boolean;
    currentWord: Word | null;
    guessWordVal: string;
    showAns: "correct" | "incorrect" | false;

}

export default class WordsTraining extends React.Component<Props, State> {

    private group: WordGroup | null = null;

    public constructor(props: Props) {
        super(props);
        this.state = {
            words: [],
            loaded: false,
            started: false,
            currentWord: null,
            guessWordVal: "",
            showAns: false
        }
        const groupStr = localStorage.getItem("words_group");
        if (groupStr)
            this.group = JSON.parse(groupStr);
        this.loadWords();
    }

    private loadWords = async () => {
        const words = await Axios.get("https://raw.githubusercontent.com/ArtiomTr/words/api/words/" + this.group?.filename);

        this.setState({ words: words.data, loaded: true });
    }

    private pickWord = () => {
        const { words } = this.state;
        this.setState({
            currentWord: words[Math.floor(Math.random() * words.length)],
            showAns: false,
            guessWordVal: ""
        })
    }

    public render(): React.ReactNode {
        const { show } = this.props;
        const { currentWord, loaded, started, guessWordVal, showAns } = this.state;
        return (
            <div className={classNames("app-box", { "app-box-show": show })}>
                <div className="app-box-container">
                    <div className="app-box-container__title">
                        <IconButton
                            style={{
                                marginRight: 10
                            }}
                            color="inherit"
                            onClick={() =>
                                window.location.href = window.location.href.substring(0, window.location.href.indexOf("/#/") + 3)}
                        >
                            <Icon color="inherit">arrow_back</Icon>
                        </IconButton>
                        <Typography variant="h4" style={{ margin: "10px 0" }}>{this.group?.name}</Typography>
                    </div>
                    {
                        started && currentWord ?
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!showAns) {
                                        this.setState({ showAns: guessWordVal.trim().toLowerCase() === currentWord.word.trim().toLowerCase() ? "correct" : "incorrect" });
                                    } else {
                                        this.pickWord();
                                    }
                                }}
                            >
                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}>
                                    {!showAns ? <OutlinedInput
                                        fullWidth={true}
                                        onChange={
                                            (e: React.ChangeEvent<HTMLInputElement>) =>
                                                this.setState({ guessWordVal: e.target.value })
                                        }
                                        margin="dense" />
                                        :
                                        <div style={{
                                            display: "flex",
                                            width: "100%"
                                        }}>
                                            {showAns === "correct" ?
                                                <Icon color="secondary">check_circle</Icon>
                                                :
                                                <Icon style={{ color: "#B00020" }}>cancel</Icon>}
                                            <Typography style={{ width: "100%", marginLeft: "10px" }} color={showAns === "correct" ? "secondary" : "error"}>{currentWord.word}</Typography>
                                        </div>
                                    }
                                    <IconButton
                                        style={{
                                            marginLeft: 10
                                        }}
                                        type="submit"
                                    >
                                        <Icon fontSize="small">arrow_forward</Icon>
                                    </IconButton>
                                </div>
                                <Typography className="word-definition">{currentWord.definition}</Typography>
                            </form>
                            :
                            <Button onClick={() => {
                                if (loaded) {
                                    this.setState({ started: true })
                                    this.pickWord();
                                }
                            }} color="primary" variant="contained">
                                {loaded ?
                                    "Begin"
                                    : <CircularProgress color="inherit" variant="indeterminate" />
                                }
                            </Button>
                    }
                </div>
            </div>
        );
    }

}