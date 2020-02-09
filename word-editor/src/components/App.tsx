import React from 'react'
import { ThemeProvider, Theme, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, Icon, TextField } from "@material-ui/core"
import ActionPanel from './panels/ActionsPanel';
import './App.scss'
import MainContentPanel from './panels/MainContentPanel';
import { TempDataManager } from '../utils/TempData';
import { WordGroupDataManager, WordGroup, WordGroupInfo } from '../utils/WordGroup';
import GroupsListPanel from './panels/GroupsListPanel';
import WordsListPanel from './panels/WordsListPanel';
import { Formik, Field, FieldProps, Form } from 'formik';
import * as yup from "yup"

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
        let { wordGroups } = this.state;
        let data = wordGroups?.getData();
        if (data) {
            data.splice(index, 1);
            wordGroups?.setData(data);
            this.setState({ wordGroups });
        }
    }

    private createGroup = (group: WordGroupInfo) => {
        let { wordGroups } = this.state;
        let data = wordGroups?.getData();
        if (data) {
            data.push({
                info: group,
                words: [],
                loaded: false
            });
            wordGroups?.setData(data);
            this.setState({ wordGroups });
        }
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
                        />
                    </MainContentPanel>

                    <Dialog open={shownPopup === "groupDelete"} onClose={() => this.changePopup("none")}>
                        <DialogTitle disableTypography className="popup-title">
                            <Typography variant="h6">Confirm group deletion</Typography>
                            <IconButton
                                style={{
                                    position: "absolute",
                                    top: 10,
                                    right: 10
                                }}
                                onClick={() => this.changePopup("none")}>
                                <Icon>
                                    close
                                </Icon>
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            Do you really want to delete "{(popupData && typeof popupData.groupName === "string") ? popupData.groupName : ""}" group?
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" onClick={() => {
                                this.changePopup("none")
                                if (popupData.groupId)
                                    this.deleteGroup(popupData.groupId);
                            }}>
                                ok
                            </Button>
                            <Button color="primary" onClick={() => this.changePopup("none")}>
                                cancel
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog fullWidth maxWidth="xs" open={shownPopup === "groupCreate"} onClose={() => this.changePopup("none")}>
                        <Formik
                            initialValues={{
                                filename: "",
                                name: "",
                                description: ""
                            }}
                            validationSchema={yup.object().shape({
                                filename: yup.string().required(),
                                name: yup.string().required(),
                                description: yup.string().required()
                            })}
                            onSubmit={(values, actions) => {
                                this.createGroup(values);
                                actions.resetForm();
                                this.changePopup("none");
                            }}>
                            {({ resetForm }) =>
                                <>
                                    <DialogTitle disableTypography className="popup-title">
                                        <Typography variant="h6">Create new group</Typography>
                                        <IconButton
                                            style={{
                                                position: "absolute",
                                                top: 10,
                                                right: 10
                                            }}
                                            type="reset"
                                            onClick={() => this.changePopup("none")}>
                                            <Icon>
                                                close
                                            </Icon>
                                        </IconButton>
                                    </DialogTitle>
                                    <DialogContent dividers>
                                        <Field name="name">{
                                            ({ field, form }: FieldProps) =>
                                                <TextField {...field} error={form.touched[field.name] !== undefined && form.errors[field.name] !== undefined} label="Group name" variant="outlined" fullWidth={true} margin="dense" />
                                        }</Field>
                                        <Field name="description">{
                                            ({ field, form }: FieldProps) =>
                                                <TextField {...field} error={form.touched[field.name] !== undefined && form.errors[field.name] !== undefined} label="Description" variant="outlined" fullWidth={true} margin="dense" multiline={true} rows={4} />
                                        }</Field>
                                        <Field name="filename">{
                                            ({ field, form }: FieldProps) =>
                                                <TextField {...field} error={form.touched[field.name] !== undefined && form.errors[field.name] !== undefined} label="Filename" variant="outlined" fullWidth={true} margin="dense" />
                                        }</Field>
                                    </DialogContent>
                                    <DialogActions>
                                        <Form>
                                            <Button color="primary" type="submit">
                                                ok
                                            </Button>
                                        </Form>
                                        <Button type="reset" color="primary" onClick={() => this.changePopup("none")}>
                                            cancel
                                        </Button>
                                    </DialogActions>
                                </>
                            }
                        </Formik>
                    </Dialog>
                </div>
            </ThemeProvider>
        );

    }

}