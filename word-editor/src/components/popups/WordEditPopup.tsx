import React from 'react'
import WordForm from '../forms/WordForm';
import { Dialog, DialogTitle, Typography, IconButton, Icon, DialogContent, DialogActions, Button } from '@material-ui/core';
import { Word } from '../../utils/WordGroup';
import { Form } from 'formik';

interface Props {
    isOpened: boolean;
    close: () => void;
    editWord: (word: Word, index: number) => void;
    popupData: any;
}

export default class WordEditPopup extends React.Component<Props> {

    public render(): React.ReactNode {
        const { isOpened, close, editWord, popupData } = this.props;
        return (
            <Dialog fullWidth maxWidth="xs" open={isOpened} onClose={close}>
                <WordForm
                    initialValues={popupData?.wordData}
                    onSubmit={(values: Word) => {
                        if (popupData && popupData.wordId !== undefined && popupData.wordId !== null) {
                            editWord(values, popupData.wordId);
                            close();
                        }
                    }}
                >
                    {(form) =>
                        <>
                            <DialogTitle disableTypography className="popup-title">
                                <Typography variant="h6">Edit word</Typography>
                                <IconButton
                                    style={{
                                        position: "absolute",
                                        top: 10,
                                        right: 10
                                    }}
                                    type="reset"
                                    onClick={close}>
                                    <Icon>
                                        close
                                    </Icon>
                                </IconButton>
                            </DialogTitle>
                            <DialogContent dividers>
                                {form}
                            </DialogContent>
                            <DialogActions>
                                <Form>
                                    <Button color="primary" type="submit">
                                        ok
                                    </Button>
                                    <Button type="reset" color="primary" onClick={close}>
                                        cancel
                                    </Button>
                                </Form>
                            </DialogActions>
                        </>
                    }
                </WordForm>
            </Dialog>
        );
    }

}