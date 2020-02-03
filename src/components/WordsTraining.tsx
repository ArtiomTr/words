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

class RandomWordGenerator {

    private words: Word[];
    private possibilities: number[];

    public constructor(words: Word[]) {
        this.words = words;
        this.possibilities = words.map(
            () =>
                0.5
        )
    }

    public recalcPossibilities = (val: { word: string, guessed: boolean }) => {
        let index = 0;
        for (let i = 0; i < this.words.length; i++) {
            if (val.word === this.words[i].word) {
                index = i;
                break;
            }
        }
        let tmp = this.possibilities[index];
        this.possibilities[index] *= (val.guessed ? 0.8 : 1.2);
        let diff = tmp - this.possibilities[index];
        this.possibilities = this.possibilities.map((value: number, index: number) => {
            if (index === index)
                return value;
            else
                return value + (diff * (value / (this.possibilities.length * 0.5)));
        });
    }

    public getRandom = (): Word => {
        const rand = Math.random() * this.words.length * 0.5;
        let cur = 0;
        for (let i = 0; i < this.possibilities.length; i++) {
            const possibility = this.possibilities[i];
            if (cur < rand && cur + possibility > rand) {
                return this.words[i];
            }
            cur += possibility;
        }
        return this.words[0];
    }

}

export default class WordsTraining extends React.Component<Props, State> {

    private group: WordGroup | null = null;
    private lastGroup: string = "";
    private randomGenerator: RandomWordGenerator | null = null;

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
        this.refreshGroup();
    }

    private refreshGroup = () => {
        const groupStr = localStorage.getItem("words_group");
        if (groupStr && groupStr !== this.lastGroup) {
            this.lastGroup = groupStr;
            this.group = JSON.parse(groupStr);
            this.loadWords(this.group!.filename);
        }

    }

    private loadWords = async (filename: string) => {
        const words = await Axios.get(`https://raw.githubusercontent.com/ArtiomTr/words/api/words/${filename}`);
        this.randomGenerator = new RandomWordGenerator(words.data);
        this.setState({ words: words.data, loaded: true });
    }

    private pickWord = () => {
        this.setState({
            currentWord: this.randomGenerator?.getRandom() ?? null,
            showAns: false,
            guessWordVal: ""
        }, () => console.log(this.state.currentWord?.word));
    }

    public render(): React.ReactNode {
        const { show } = this.props;
        const { currentWord, loaded, started, guessWordVal, showAns } = this.state;
        this.refreshGroup();
        return (
            <div className={classNames("app-box", { "app-box-show": show })}>
                <div className="app-box-container">
                    <div className="app-box-container__title">
                        <IconButton
                            style={{
                                marginRight: 10
                            }}
                            color="inherit"
                            onClick={() => {
                                this.setState({ started: false });
                                window.location.href = window.location.href.substring(0, window.location.href.indexOf("/#/") + 3)

                            }}
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
                                        const guessed = guessWordVal.trim().toLowerCase() === currentWord.word.trim().toLowerCase();
                                        this.randomGenerator?.recalcPossibilities({ word: currentWord.word, guessed })
                                        this.setState({ showAns: guessed ? "correct" : "incorrect" });
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