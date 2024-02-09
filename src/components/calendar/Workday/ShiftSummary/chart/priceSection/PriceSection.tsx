//#region Dependency list
import { FunctionComponent, useState } from "react";
import FormManager from "../../../../../utils/form/FormManager";
import { Shift } from "../../../../../../classes/shift/Shift";
import { inputNumber } from "../../../../../utils/form/blocks/number/Types";
import { parsedAnswers } from "../../../../../utils/form/FormTypes";
import style from "./PriceSection.module.scss";
//#endregion

type thisProps = { shift: Shift; id: string; onEnd(shift: Shift): void };

const PriceSection: FunctionComponent<thisProps> = ({ shift, id, onEnd }) => {
    const [Loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(answers: parsedAnswers): Promise<void> {
        try {
            const total = Number(answers[`total${id}`]);
            if (isNaN(total)) throw new Error("Error getting new total");
        } catch (error) {
            setErrorMsg(
                error instanceof Error
                    ? error.message
                    : "Error parsing input values"
            );
        }
        const total = Number(answers[`total${id}`]);

        setLoading(true);

        shift.forcedTotal = total;

        const response = await shift.save();

        if (response.ok) {
            setErrorMsg("");
            onEnd(shift);
        }

        setLoading(false);

        if (!response.ok && response.error) {
            setErrorMsg(response.error.message);
            return;
        }
    }

    return (
        <FormManager
            inputs={[
                {
                    type: "number",
                    id: `total${id}`,
                    min: 0,
                    max: 24,
                    placeholder: "00",
                } as inputNumber,
            ]}
            submitCallback={handleSubmit}
            submitText="Force total"
            loading={Loading}
            serverErrorMsg={errorMsg}
            customClass={style.formClass}
        />
    );
};

export default PriceSection;
