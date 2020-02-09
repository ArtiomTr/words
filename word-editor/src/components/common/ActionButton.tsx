import React from 'react'
import classNames from 'classnames'
import { IconButton, Icon, Typography } from '@material-ui/core';
import { Form } from 'formik'
import WordForm from '../forms/WordForm';

interface Props {
    active: boolean;
    open: () => void;
    close: () => void;
}

export default class ActionButton extends React.Component<Props> {

    public render(): React.ReactNode {
        const { active, open, close } = this.props;
        return (
            <WordForm
                onSubmit={(values) => console.log(values)}
            >
                {(form, { resetForm }) =>
                    <>
                        <div onClick={() => { resetForm(); close(); }} className={classNames("overlay", { active })}></div>
                        <div className="fab-shadow"></div>
                        <div className={classNames("fab", { active })}>
                            <Form>
                                <div className="fab-header">
                                    <IconButton onClick={close} type="reset" className="fab-header__close">
                                        <Icon>close</Icon>
                                    </IconButton>
                                    <Typography variant="h5" color="inherit">Create new word</Typography>
                                    <IconButton type="submit">
                                        <Icon>arrow_forward</Icon>
                                    </IconButton>
                                </div>
                                <div className="fab-content">
                                    {form}
                                </div>
                            </Form>
                            <IconButton
                                className="fab__open"
                                style={{ position: "absolute" }}
                                color="inherit"
                                onClick={open}
                            >
                                <Icon>
                                    add
                        </Icon>
                            </IconButton>
                        </div>
                    </>
                }
            </WordForm>
        );
    }

}