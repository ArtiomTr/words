import React from 'react';
import {
    Dialog,
    DialogTitle,
    Typography,
    IconButton,
    Icon,
    DialogContent,
    DialogActions,
    Button,
} from '@material-ui/core';

interface Props {
    isOpened: boolean;
    close: () => void;
    popupData: any;
    deleteWord: (index: number) => void;
}

export default class WordDeletePopup extends React.Component<Props> {
    public render(): React.ReactNode {
        const { isOpened, close, popupData, deleteWord } = this.props;
        return (
            <Dialog open={isOpened} onClose={close}>
                <DialogTitle disableTypography className="popup-title">
                    <Typography variant="h6">Confirm word deletion</Typography>
                    <IconButton
                        style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                        }}
                        onClick={close}
                    >
                        <Icon>close</Icon>
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    Do you really want to delete "
                    {popupData && typeof popupData.word === 'string'
                        ? popupData.word
                        : ''}
                    " word?
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => {
                            close();
                            if (
                                popupData.wordId !== undefined &&
                                popupData.wordId !== null
                            )
                                deleteWord(popupData.wordId);
                        }}
                    >
                        ok
                    </Button>
                    <Button color="primary" onClick={close}>
                        cancel
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}