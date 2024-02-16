//#region Dependency list
import { Dispatch, FunctionComponent, SetStateAction, useState } from "react";
import FormUpdate from "./FormUpdate";
import styles from "./UpdateJob.module.scss";
import HourPrice from "./HourPrice/HourPrice";
import TaxAndBonusPanel from "./TaxAndBonus/TaxAndBonusPanel";
//#endregion

type thisProps = {
    loading: boolean;
    onSetLoading: Dispatch<SetStateAction<boolean>>;
};

const UpdateJob: FunctionComponent<thisProps> = ({ loading, onSetLoading }) => {
    const [isHourPriceActive, setIsHourPriceActive] = useState<boolean>(true);
    const [hide, setHide] = useState<boolean>(false);

    return (
        <div className={styles.formContainer}>
            <FormUpdate loading={loading} onSetLoading={onSetLoading} />
            <div className={styles.textFormsContainer}>
                {!hide && (
                    <button
                        className={styles.changeSectionButton}
                        onClick={() => setIsHourPriceActive((bool) => !bool)}
                    >
                        {isHourPriceActive
                            ? "Set tax or bonus"
                            : "Set hour price"}
                    </button>
                )}
                {isHourPriceActive ? (
                    <HourPrice onSetLoading={onSetLoading} loading={loading} />
                ) : (
                    <TaxAndBonusPanel onSetHide={setHide} />
                )}
            </div>
        </div>
    );
};

export default UpdateJob;
