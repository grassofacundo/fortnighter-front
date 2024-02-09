//TO-DO Don't send the whole answer object to the client, only send the requested value
//TO-DO try to fin a workaround with the loading and server error thing
//TO-DO adjust the error coordinates on resize
//TO-DO make some general styles
//TO-DO Implement mobile support

import {
    FunctionComponent,
    useCallback,
    useEffect,
    useReducer,
    useState,
    ReactNode,
} from "react";
import Form from "./Form";
import { formAnswersType, inputField, parsedAnswers } from "./FormTypes";
import { checkbox } from "./blocks/checkbox/Types";

type thisProps = {
    inputs: inputField[];
    updateAnswers?: (answers: parsedAnswers) => void;
    submitCallback: (answers: parsedAnswers) => Promise<void>;
    loading?: boolean;
    disabled?: boolean;
    submitText?: string;
    serverErrorMsg?: string;
    children?: ReactNode;
    customClass?: CSSModuleClasses[string];
};

const FormManager: FunctionComponent<thisProps> = ({
    inputs,
    updateAnswers,
    submitCallback,
    loading,
    disabled,
    submitText,
    serverErrorMsg,
    children,
    customClass,
}) => {
    const [formAnswers, dispatch] = useReducer(
        fieldsReducer,
        getDefaultValues(inputs)
    );
    const [serverError, setServerError] = useState<string>("");

    function getDefaultValues(inputs: inputField[]): formAnswersType[] {
        const inputValues: formAnswersType[] = [];
        inputs.forEach((input) => {
            if (input.type === "checkbox") {
                const checkbox = input as checkbox;
                inputValues.push({
                    id: checkbox.id,
                    value: !!checkbox.checked,
                });
            } else if (input.defaultValue) {
                inputValues.push({
                    id: input.id,
                    value: input.defaultValue,
                });
            }
        });
        return inputValues;
    }

    const getParsedAnswers = useCallback((): parsedAnswers => {
        const parsedAnswers: parsedAnswers = {};
        formAnswers.forEach(
            (answer) => (parsedAnswers[answer.id] = answer.value)
        );
        return parsedAnswers;
    }, [formAnswers]);

    function handleCallback() {
        const parsedAnswers = getParsedAnswers();
        submitCallback(parsedAnswers);
    }

    //#region Reducer methods
    function updateAnswer(answer: formAnswersType): void {
        if (answer.value == null || answer.value === "") {
            handleDeleteAnswer(answer.id);
            return;
        }

        let isOnForm = false;
        for (const storedAnswer of formAnswers) {
            if (answer.id === storedAnswer.id) {
                isOnForm = true;
                break;
            }
        }
        if (isOnForm) {
            handleChangeAnswer(answer);
        } else {
            handleAddAnswer(answer);
        }
    }

    function handleAddAnswer({ id, value, error }: formAnswersType) {
        dispatch({
            type: "added",
            id,
            value,
            error,
        });
    }

    function handleChangeAnswer({ id, value, error }: formAnswersType) {
        dispatch({
            type: "changed",
            id,
            value,
            error,
        });
    }

    function handleDeleteAnswer(id: string) {
        dispatch({
            type: "deleted",
            id,
        });
    }

    function fieldsReducer(formAnswers: formAnswersType[], action: any) {
        //Eliminate possible duplicates IDs
        let index = 0;
        const duplicatedAnswers = [];
        const length = formAnswers.length;
        for (let i = 0; i < length - 1; i++) {
            for (let j = i + 1; j < length; j++) {
                if (formAnswers[i].id === formAnswers[j].id) {
                    duplicatedAnswers[index] = i;
                    index++;
                }
            }
        }
        const sanitizedAnswers: formAnswersType[] = JSON.parse(
            JSON.stringify(formAnswers)
        );
        if (index > 0) {
            duplicatedAnswers.forEach((dAnswerIndex) =>
                sanitizedAnswers.splice(dAnswerIndex, 1)
            );
        }

        switch (action.type) {
            case "added": {
                const addedAnswers = [
                    ...sanitizedAnswers,
                    {
                        id: action.id,
                        value: action.value,
                        error: action.error,
                    },
                ];
                return addedAnswers;
            }
            case "changed": {
                const changedAnswers = sanitizedAnswers.map((f) => {
                    if (f.id === action.id) {
                        return {
                            id: action.id,
                            value: action.value,
                            error: action.error,
                        };
                    } else {
                        return f;
                    }
                });
                return changedAnswers;
            }
            case "deleted": {
                const deletedAnswers = sanitizedAnswers.filter(
                    (f) => f.id !== action.id
                );
                return deletedAnswers;
            }
            default: {
                throw Error("Unknown action: " + action.type);
            }
        }
    }
    //#endregion

    useEffect(() => {
        if (!loading && serverErrorMsg) setServerError(serverErrorMsg);
        if (!serverErrorMsg) setServerError("");
    }, [loading, serverErrorMsg]);

    useEffect(() => {
        inputs.forEach((input) => {
            input.isOptional = input.type === "checkbox" || input.isOptional;
        });
    }, [inputs]);

    useEffect(() => {
        if (updateAnswers) updateAnswers(getParsedAnswers());
    }, [updateAnswers, getParsedAnswers]);

    return (
        <div className={customClass}>
            <Form
                inputs={inputs}
                submitCallback={handleCallback}
                loading={loading}
                updateAnswer={updateAnswer}
                formAnswers={formAnswers}
                submitText={submitText ?? "Submit"}
                serverErrorMsg={serverError}
                resetServerError={() => setServerError("")}
                children={children}
                disabled={disabled}
            />
        </div>
    );
};

export default FormManager;
