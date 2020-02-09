import React from 'react'
import { Formik, Field, FieldProps } from 'formik';
import * as yup from 'yup'
import { TextField } from '@material-ui/core';
import { formatFilePath } from '../../utils/FilePathFormatter';
import { WordGroupInfo } from '../../utils/WordGroup';
import { ErrorMessage } from '../common/ErrorMessage';

interface Props {
    children?: (form: React.ReactNode) => React.ReactNode;
    onSubmit: (values: WordGroupInfo) => void;
}

interface State {
    customErrorMessage?: string;
}

export default class NewGroupForm extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.state = {};
    }

    private renderForm(): React.ReactNode {
        const { customErrorMessage } = this.state;
        return (
            <>
                {customErrorMessage &&
                    <ErrorMessage>
                        {customErrorMessage}
                    </ErrorMessage>}
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
                        <TextField
                            {...field}
                            onBlur={(e: React.FocusEvent) => {
                                field.onBlur(e);
                                form.setFieldValue(field.name, formatFilePath(field.value));
                            }}
                            error={form.touched[field.name] !== undefined && form.errors[field.name] !== undefined}
                            label="Filename"
                            variant="outlined"
                            fullWidth={true}
                            margin="dense"
                        />
                }</Field>
            </>
        )
    }

    public render(): React.ReactNode {
        const { children, onSubmit } = this.props;
        return (
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
                    try {
                        onSubmit(values);
                        actions.resetForm();
                    } catch (error) {
                        this.setState({ customErrorMessage: error.message });
                        actions.setSubmitting(false);
                    }
                }}>
                {children ? children(this.renderForm()) : this.renderForm()}
            </Formik>
        );
    }

}