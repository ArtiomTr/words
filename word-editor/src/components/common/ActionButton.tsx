import React from 'react'
import classNames from 'classnames'
import { IconButton, Icon, Typography, TextField, Select, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { Formik, Form, Field, FieldProps } from 'formik'
import { wordTypes, type2wordAlias } from '../../utils/WordTypes';
import * as yup from 'yup'

interface Props {
    active: boolean;
    open: () => void;
    close: () => void;
}

interface State {
    labelWidth: number
}

export default class ActionButton extends React.Component<Props, State> {

    private inputLabelRef: React.RefObject<HTMLLabelElement> = React.createRef();

    public constructor(props: Props) {
        super(props);
        this.state = {
            labelWidth: 0
        }
    }

    public componentDidMount() {
        this.setState({ labelWidth: this.inputLabelRef.current?.offsetWidth ?? 0 });
    }

    public render(): React.ReactNode {
        const { active, open, close } = this.props;
        const { labelWidth } = this.state;
        return (
            <Formik
                initialValues={{
                    word: "",
                    definition: "",
                    pronunciation: "",
                    type: ""
                }}
                validationSchema={yup.object({
                    word: yup.string().required(),
                    definition: yup.string().required(),
                    type: yup.string().required().oneOf(wordTypes)
                })}
                onSubmit={(values) => {
                    console.log(values);
                }}>
                {({ values, setFieldValue, resetForm }) =>
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
                                    <Field name="word">{
                                        ({ field, form }: FieldProps) =>
                                            <TextField {...field} error={form.touched[field.name] !== undefined && form.errors[field.name] !== undefined} label="Word" variant="outlined" fullWidth={true} margin="dense" />
                                    }</Field>
                                    <Field name="definition">{
                                        ({ field, form }: FieldProps) =>
                                            <TextField {...field} error={form.touched[field.name] !== undefined && form.errors[field.name] !== undefined} label="Definition" variant="outlined" fullWidth={true} margin="dense" multiline={true} rows={4} />
                                    }</Field>
                                    <Field name="pronunciation">{
                                        ({ field, form }: FieldProps) =>
                                            <TextField {...field} error={form.touched[field.name] !== undefined && form.errors[field.name] !== undefined} label="Pronunciation" variant="outlined" fullWidth={true} margin="dense" />
                                    }</Field>
                                    <FormControl margin="dense" fullWidth={true} variant="outlined">
                                        <InputLabel ref={this.inputLabelRef} id="word-type-label">Word type</InputLabel>
                                        <Select onChange={(e: React.ChangeEvent<{ value: unknown }>) => setFieldValue("type", e.target.value)} value={values.type} labelWidth={labelWidth} labelId="word-type-label" fullWidth={true}>
                                            {wordTypes.map((value: string) =>
                                                <MenuItem key={value} value={value}>{(type2wordAlias as any)[value]}</MenuItem>)}
                                        </Select>
                                    </FormControl>
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
            </Formik>
        );
    }

}