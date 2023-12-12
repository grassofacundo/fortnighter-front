//TO-DO Don't send the whole answer object to the client, only send the requested value
//TO-DO try to fin a workaround with the loading and server error thing
//TO-DO adjust the error coordinates on resize
//TO-DO make some general styles
//TO-DO Implement mobile support

import { FunctionComponent, useEffect, useReducer, useState } from "react";
import Form from "./Form";
import {
    formAnswersType,
    formCallback,
    inputField,
} from "../../../types/form/FormTypes";
import { checkbox } from "../../../types/form/CheckboxTypes";

type thisProps = {
    inputs: inputField[];
    updateAnswers?: (answers: formAnswersType[]) => void;
    submitCallback: formCallback;
    Loading?: boolean;
    submitText?: string;
    serverErrorMsg?: string;
};

const FormManager: FunctionComponent<thisProps> = ({
    inputs,
    updateAnswers,
    submitCallback,
    Loading,
    submitText,
    serverErrorMsg,
}) => {
    const [formAnswers, dispatch] = useReducer(
        fieldsReducer,
        getDefaultValues(inputs)
    );
    const [serverError, setServerError] = useState<string>("");

    useEffect(() => {
        if (!Loading && serverErrorMsg) setServerError(serverErrorMsg);
        if (!serverErrorMsg) setServerError("");
    }, [Loading, serverErrorMsg]);

    useEffect(() => {
        inputs.forEach((input) => {
            input.isOptional = input.type === "checkbox" || input.isOptional;
        });
    }, [inputs]);

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
                if (updateAnswers) updateAnswers(addedAnswers);
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
                if (updateAnswers) updateAnswers(changedAnswers);
                return changedAnswers;
            }
            case "deleted": {
                const deletedAnswers = sanitizedAnswers.filter(
                    (f) => f.id !== action.id
                );
                if (updateAnswers) updateAnswers(deletedAnswers);
                return deletedAnswers;
            }
            default: {
                throw Error("Unknown action: " + action.type);
            }
        }
    }
    return (
        <div>
            <Form
                inputs={inputs}
                submitCallback={submitCallback}
                Loading={Loading}
                updateAnswer={updateAnswer}
                formAnswers={formAnswers}
                submitText={submitText ?? "Submit"}
                serverErrorMsg={serverError}
                resetServerError={() => setServerError("")}
            />
        </div>
    );
};

export default FormManager;
