//#region Dependency list
import { Dispatch, FunctionComponent, SetStateAction } from "react";
import InputNumber from "../../../../utils/form/blocks/number/InputNumber";
import { formAnswersType } from "../../../../utils/form/FormTypes";
import { inputNumber } from "../../../../utils/form/blocks/number/Types";
import { BaseModifier } from "../../../../../classes/modifier/BaseModifier";
//#endregion

type thisProps = {
    modifier: BaseModifier;
    onSetModifier: Dispatch<SetStateAction<BaseModifier>>;
};

const ByShiftText: FunctionComponent<thisProps> = ({
    modifier,
    onSetModifier,
}) => {
    function handleChange(answer: formAnswersType) {
        try {
            const forEvery = Number(answer.value);
            const modifierCopy = structuredClone(modifier);
            delete modifierCopy.byAmount;
            delete modifierCopy.paymentId;
            const newModifier = new BaseModifier({
                ...modifierCopy,
                byShift: { forEvery },
            });
            onSetModifier(newModifier);
        } catch (error) {
            alert(error);
        }
    }

    return (
        <>
            For every
            <InputNumber
                formAnswers={[]}
                onUpdateAnswer={handleChange}
                fields={
                    {
                        type: "number",
                        id: "shiftsWorked",
                        min: 1,
                        placeholder: "1",
                        defaultValue: modifier.byShift?.forEvery,
                    } as inputNumber
                }
            />
            worked shift.
        </>
    );
};

export default ByShiftText;
