//#region Dependency list
import { Dispatch, FunctionComponent, SetStateAction, useEffect } from "react";
//#endregion

type thisProps = {
    onSetPayGainText: Dispatch<SetStateAction<string>>;
    payGainText: string;
};

const ByPaymentText: FunctionComponent<thisProps> = ({
    onSetPayGainText,
    payGainText,
}) => {
    useEffect(() => {
        const text = "of my total gain.";
        if (payGainText !== text) onSetPayGainText(text);
    }, [payGainText, onSetPayGainText]);

    return <>For this payment only, </>;
};

export default ByPaymentText;
