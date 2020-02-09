import React from 'react'
import { Formik, Field, FieldProps, FormikActions, FormikProps } from 'formik';
import { TextField, FormControl, InputLabel, Select, MenuItem, InputAdornment, CircularProgress } from '@material-ui/core';
import { typeColorAlias, type2wordAlias, wordTypes } from '../../utils/WordTypes';
import { Word } from '../../utils/WordGroup';
import { getAutofillValues } from '../../utils/AutofillUtil'
import * as yup from 'yup';

interface Props {
    children?: (form: React.ReactNode, actions: FormikActions<Word>) => React.ReactNode;
    initialValues?: Word;
    onSubmit: (values: Word) => void;
}

interface State {
    labelWidth: number;
    loadingAutofill: boolean;
}

export default class WordForm extends React.Component<Props, State> {

    private inputLabelRef: React.RefObject<HTMLLabelElement> = React.createRef();
    private actions: FormikProps<Word> | null = null;

    public constructor(props: Props) {
        super(props);
        this.state = {
            labelWidth: 0,
            loadingAutofill: false
        }
    }

    public componentDidMount() {
        this.setState({ labelWidth: this.inputLabelRef.current?.offsetWidth ?? 0 });
    }

    private async pasteAutofillValues(word: string) {
        this.setState({ loadingAutofill: true });
        const out = await getAutofillValues(word);
        this.setState({ loadingAutofill: false });
        if (out.definition && !this.actions?.values.definition.length)
            this.actions?.setFieldValue("definition", out.definition);
        if (out.pronunciation && !this.actions?.values.pronunciation?.length)
            this.actions?.setFieldValue("pronunciation", out.pronunciation);
        if (out.type && !this.actions?.values.type.length)
            this.actions?.setFieldValue("type", out.type);
    }

    private renderForm(): React.ReactNode {
        const { labelWidth, loadingAutofill } = this.state;
        return (
            <>
                <Field name="word">{
                    ({ field, form }: FieldProps) =>
                        <TextField
                            {...field}
                            onBlur={(e: React.FocusEvent) => {
                                field.onBlur(e);
                                this.pasteAutofillValues(field.value);
                            }}
                            error={form.touched[field.name] && form.errors[field.name] !== undefined}
                            label="Word"
                            variant="outlined"
                            fullWidth={true}
                            margin="dense"
                            InputProps={{
                                endAdornment: loadingAutofill &&
                                    <InputAdornment position="end">
                                        <CircularProgress size={18} thickness={4} variant="indeterminate" />
                                    </InputAdornment>
                            }}
                        />
                }</Field>
                <Field name="definition">{
                    ({ field, form }: FieldProps) =>
                        <TextField {...field} error={form.touched[field.name] && form.errors[field.name] !== undefined} label="Definition" variant="outlined" fullWidth={true} margin="dense" multiline={true} rows={4} />
                }</Field>
                <Field name="pronunciation">{
                    ({ field, form }: FieldProps) =>
                        <TextField {...field} error={form.touched[field.name] && form.errors[field.name] !== undefined} label="Pronunciation" variant="outlined" fullWidth={true} margin="dense" />
                }</Field>
                <Field name="type">{
                    ({ field, form }: FieldProps) =>
                        <FormControl margin="dense" fullWidth={true} variant="outlined">
                            <InputLabel error={form.touched[field.name] && form.errors[field.name] !== undefined} ref={this.inputLabelRef} id="word-type-label">Word type</InputLabel>
                            <Select
                                {...field}
                                error={form.touched[field.name] && form.errors[field.name] !== undefined}
                                labelWidth={labelWidth}
                                labelId="word-type-label"
                                fullWidth={true}
                                renderValue={(value: unknown) =>
                                    <div className="word-type-value">
                                        <span
                                            className="word-type-value__color"
                                            style={{
                                                backgroundColor: (typeColorAlias as any)[value as string] ?? typeColorAlias.UNKNWN
                                            }}
                                        ></span>
                                        <span
                                            className="word-type-value__text"
                                        >{(type2wordAlias as any)[value as string] ?? type2wordAlias.UNKNWN}</span>
                                    </div>}
                            >
                                {wordTypes.map((value: string) =>
                                    <MenuItem key={value} value={value}>
                                        {<div className="word-type-value">
                                            <span
                                                className="word-type-value__color"
                                                style={{
                                                    backgroundColor: (typeColorAlias as any)[value] ?? typeColorAlias.UNKNWN
                                                }}
                                            ></span>
                                            <span
                                                className="word-type-value__text"
                                            >{(type2wordAlias as any)[value] ?? type2wordAlias.UNKNWN}</span>
                                        </div>}
                                    </MenuItem>)}
                            </Select>
                        </FormControl>
                }</Field>

            </>
        );
    }

    public render(): React.ReactNode {
        const { children, initialValues, onSubmit } = this.props;
        return (
            <Formik
                initialValues={initialValues ?? {
                    word: "",
                    definition: "",
                    pronunciation: "",
                    type: ""
                }}
                validationSchema={yup.object().shape({
                    word: yup.string().required(),
                    definition: yup.string().required(),
                    type: yup.string().required().oneOf(wordTypes)
                })}
                onSubmit={(values, actions) => {
                    onSubmit(values);
                    actions.resetForm();
                    actions.setSubmitting(false);
                }}
            >
                {(actions) => {
                    this.actions = actions;
                    return children ? children(this.renderForm(), actions) : this.renderForm()
                }}
            </Formik>
        );
    }

}