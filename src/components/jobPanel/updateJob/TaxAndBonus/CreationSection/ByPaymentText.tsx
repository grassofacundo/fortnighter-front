//#region Dependency list
import { Dispatch, FunctionComponent, SetStateAction, useEffect } from "react";
import { BaseModifier } from "../../../../../classes/modifier/BaseModifier";

type thisProps = {
    modifier: BaseModifier;
    onSetModifier: Dispatch<SetStateAction<BaseModifier>>;
};

const ByPaymentText: FunctionComponent<thisProps> = ({
    modifier,
    onSetModifier,
}) => {
    useEffect(() => {
        if (!modifier.byPayment) {
            const modifierCopy = structuredClone(modifier);
            delete modifierCopy.byAmount;
            delete modifierCopy.byShift;
            const newModifier = new BaseModifier({
                ...modifierCopy,
                byPayment: true,
            });
            onSetModifier(newModifier);
        }
    }, [modifier, onSetModifier]);

    return <>For this payment only, </>;
};

export default ByPaymentText;
