//#region Dependency list
import { Dispatch, FunctionComponent, SetStateAction } from "react";
import FormUpdate from "./BaseInfoForm";
import { jobPosition } from "../../../types/job/Position";
import PricesForm from "./PricesForm/PricesForm";
import styles from "./UpdateJob.module.scss";
//#endregion

type thisProps = {
    jobPositionList: jobPosition[];
    onEnd(updatedJobPosition: jobPosition): void;
    loading: boolean;
    onSetLoading: Dispatch<SetStateAction<boolean>>;
};

const UpdateJob: FunctionComponent<thisProps> = ({
    jobPositionList,
    onEnd,
    loading,
    onSetLoading,
}) => {
    function handleFormUpdateSubmit(updatedJobPosition: jobPosition) {
        onEnd(updatedJobPosition);
    }

    return (
        <div className={styles.formContainer}>
            <FormUpdate
                jobPositionList={jobPositionList}
                onEnd={handleFormUpdateSubmit}
                loading={loading}
                onSetLoading={onSetLoading}
            />
            <PricesForm
                onSetLoading={onSetLoading}
                onEnd={handleFormUpdateSubmit}
                loading={loading}
            />
        </div>
    );
};

export default UpdateJob;
