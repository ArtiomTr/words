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
import NewGroupForm from '../forms/NewGroupForm';
import { WordGroupInfo } from '../../utils/WordGroup';
import { Form } from 'formik';

interface Props {
    isOpened: boolean;
    editGroup: (values: WordGroupInfo) => void;
    close: () => void;
    values: WordGroupInfo | null;
}

export default class GroupEditPopup extends React.Component<Props> {
    public render(): React.ReactNode {
        const { isOpened, close, editGroup, values } = this.props;
        return (
            <Dialog fullWidth maxWidth="xs" open={isOpened} onClose={close}>
                {values && (
                    <NewGroupForm
                        initialValues={values}
                        onSubmit={(values: WordGroupInfo) => {
                            editGroup(values);
                            close();
                        }}
                    >
                        {form => (
                            <>
                                <DialogTitle
                                    disableTypography
                                    className="popup-title"
                                >
                                    <Typography variant="h6">
                                        Edit group
                                    </Typography>
                                    <IconButton
                                        style={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                        }}
                                        type="reset"
                                        onClick={close}
                                    >
                                        <Icon>close</Icon>
                                    </IconButton>
                                </DialogTitle>
                                <DialogContent dividers>{form}</DialogContent>
                                <DialogActions>
                                    <Form>
                                        <Button color="primary" type="submit">
                                            ok
                                        </Button>
                                        <Button
                                            type="reset"
                                            color="primary"
                                            onClick={close}
                                        >
                                            cancel
                                        </Button>
                                    </Form>
                                </DialogActions>
                            </>
                        )}
                    </NewGroupForm>
                )}
            </Dialog>
        );
    }
}
