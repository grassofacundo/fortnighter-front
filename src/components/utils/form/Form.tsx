import {
    useState,
    FunctionComponent,
    useEffect,
    FormEvent,
    useRef,
    useMemo,
} from "react";
import { createPortal } from "react-dom";
import InOutAnim from "../InOutAnim";
import Text from "./blocks/text/Text";
import InputNumber from "./blocks/number/InputNumber";
import Tel from "./blocks/tel/Tel";
import Password from "./blocks/password/Password";
import Mail from "./blocks/mail/Mail";
import Radio from "./blocks/radio/Radio";
import styles from "./Form.module.scss";
import Spinner from "../../blocks/spinner/Spinner";
import Checkbox from "./blocks/checkbox/Checkbox";
import DateInput from "./blocks/date/DateInput";

type thisProps = {
    inputs: inputField[];
    submitCallback: formCallback;
    Loading?: boolean;
    updateAnswer: (answer: formAnswersType) => void;
    formAnswers: formAnswersType[];
    submitText: string;
    serverErrorMsg?: string;
    resetServerError: () => void;
};

const Form: FunctionComponent<thisProps> = ({
    inputs,
    submitCallback,
    Loading,
    updateAnswer,
    formAnswers,
    submitText,
    serverErrorMsg,
    resetServerError,
}) => {
    const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [showError, setShowError] = useState<boolean>(false);
    const formRef = useRef<HTMLFormElement>(null);
    const errorPorUpRef = useRef<HTMLDivElement>(null);

    function updateAnswerAndHideError(answer: formAnswersType): void {
        setShowError(false);
        updateAnswer(answer);
    }

    function clearErrors() {
        //setError(null);
        resetServerError();
    }

    const getEmptyAnswers = useMemo((): inputField[] => {
        const requiredAnswers = inputs.filter((input) => !input.isOptional);
        const unansweredFields = inputs.filter(
            (input) => !formAnswers.some((answer) => answer.id === input.id)
        );
        const unansweredAndRequired = requiredAnswers.filter((input) =>
            unansweredFields.some((unanswered) => unanswered.id === input.id)
        );
        return unansweredAndRequired;
    }, [formAnswers, inputs]);

    const hasFormErrors = useMemo(() => {
        const erroredFields = formAnswers.filter((answer) => answer.error);
        return getEmptyAnswers.length > 0 || erroredFields.length > 0;
    }, [formAnswers, getEmptyAnswers]);

    function hasServerError() {
        return serverErrorMsg;
    }

    function getError(): error | void {
        const errorObj: error = {
            message: "",
            field: null,
        };

        if (serverErrorMsg) {
            const button = formRef.current?.lastChild as HTMLElement;
            errorObj.message = serverErrorMsg;
            errorObj.field = button ?? formRef.current;
        }

        //First, check if there is any empty field
        const emptyFields = getEmptyAnswers;
        if (!errorObj.message && emptyFields.length > 0) {
            errorObj.message = "Please, complete this field";

            if (emptyFields.at(0)?.id)
                errorObj.field = document.getElementById(
                    emptyFields.at(0)?.id as string
                );
        }

        //If not empty field, check for errored ones
        if (!errorObj.message) {
            const erroredFields = formAnswers.filter((answer) => answer.error);
            if (erroredFields.length <= 0 || erroredFields == null) return;

            const firstError = erroredFields.at(0);

            if (!firstError || !firstError.id || !firstError?.error) return;
            errorObj.message = firstError.error;
            errorObj.field = document.getElementById(firstError.id);
        }

        //Lastly, set coordinates and update error state
        return errorObj;
    }

    function setCoordinates(field: HTMLElement | null): void {
        if (!field) return;
        const { right, bottom } = field.getBoundingClientRect();

        const errorParent = errorPorUpRef?.current?.parentElement;
        const root = document.querySelector("#root") ?? document.body;
        const bottomVal = root.clientHeight - bottom;
        const leftVal = right + 35;
        if (errorParent) {
            errorParent.style.setProperty("--errorBottom", `${bottomVal}px`);
            errorParent.style.setProperty("--errorLeft", `${leftVal}px`);
        }
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (hasFormErrors || hasServerError()) {
            setShowError(true);
            return;
        }

        submitCallback(formAnswers);
    }

    //Adjust error pop up position
    useEffect(() => {
        if (showError) {
            const error = getError();
            if (error) {
                setCoordinates(error.field);
                setErrorMsg(error.message);
            }
        }
    }, [showError]);

    //Check if form is ready for submit
    useEffect(() => {
        setSubmitEnabled(!hasFormErrors && !Loading);
    }, [formAnswers, inputs, Loading, hasFormErrors]);

    useEffect(() => {
        if (serverErrorMsg) setShowError(true);
    }, [serverErrorMsg]);

    return (
        <>
            <form
                onSubmit={(event) => handleSubmit(event)}
                className={styles.form}
                ref={formRef}
            >
                {inputs.map((inputFields) => {
                    switch (inputFields.type) {
                        /*case "title":
                            const inputTitle = inputFields as inputTitle;
                            return (
                                <div key={inputTitle.title}>
                                    <h2>{inputTitle.title}</h2>
                                    <p>{inputTitle.text}</p>
                                </div>
                            );*/
                        case "text": {
                            const inputText = inputFields as text;
                            return (
                                <Text
                                    key={inputText.id}
                                    fields={inputText}
                                    formAnswers={formAnswers}
                                    onUpdateAnswer={updateAnswerAndHideError}
                                />
                            );
                        }
                        case "number": {
                            const inputNumber = inputFields as text;
                            return (
                                <InputNumber
                                    key={inputNumber.id}
                                    fields={inputNumber}
                                    formAnswers={formAnswers}
                                    onUpdateAnswer={updateAnswerAndHideError}
                                />
                            );
                        }
                        case "customDate": {
                            const inputDate = inputFields as dateInput;
                            return (
                                <DateInput
                                    key={inputDate.id}
                                    fields={inputDate}
                                    formAnswers={formAnswers}
                                    onUpdateAnswer={updateAnswerAndHideError}
                                />
                            );
                        }
                        case "tel": {
                            const inputTel = inputFields as tel;
                            return (
                                <Tel
                                    key={inputTel.id}
                                    fields={inputTel}
                                    formAnswers={formAnswers}
                                    onUpdateAnswer={updateAnswerAndHideError}
                                />
                            );
                        }
                        case "password": {
                            const inputPassword = inputFields as password;
                            return (
                                <Password
                                    key={inputPassword.id}
                                    fields={inputPassword}
                                    formAnswers={formAnswers}
                                    onUpdateAnswer={updateAnswerAndHideError}
                                />
                            );
                        }
                        case "mail": {
                            const inputMail = inputFields as mail;
                            return (
                                <Mail
                                    key={inputMail.id}
                                    fields={inputMail}
                                    formAnswers={formAnswers}
                                    onUpdateAnswer={updateAnswerAndHideError}
                                />
                            );
                        }
                        case "radio": {
                            const inputRadio = inputFields as radio;
                            return (
                                <Radio
                                    key={inputRadio.id}
                                    fields={inputRadio}
                                    formAnswers={formAnswers}
                                    onUpdateAnswer={updateAnswerAndHideError}
                                />
                            );
                        }
                        case "checkbox": {
                            const inputCheckbox = inputFields as checkbox;
                            return (
                                <Checkbox
                                    key={inputCheckbox.id}
                                    fields={inputCheckbox}
                                    formAnswers={formAnswers}
                                    onUpdateAnswer={updateAnswerAndHideError}
                                />
                            );
                        }
                        default:
                            break;
                    }
                })}
                {!hasFormErrors && (
                    <button type="submit" disabled={!submitEnabled}>
                        {Loading ? <Spinner /> : submitText}
                    </button>
                )}
                {hasFormErrors && (
                    <button type="button" onClick={() => setShowError(true)}>
                        {submitText}
                    </button>
                )}
            </form>
            {createPortal(
                <InOutAnim
                    inState={showError}
                    customClass={styles.errorMessageWrapper}
                    onExitEvent={() => clearErrors()}
                >
                    <div className={styles.errorPorUp} ref={errorPorUpRef}>
                        <p className={styles.message}>{errorMsg}</p>
                    </div>
                </InOutAnim>,
                document.querySelector("#root") ?? document.body
            )}
        </>
    );
};

export default Form;
