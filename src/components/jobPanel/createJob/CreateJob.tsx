//#region Dependency list
import { FunctionComponent, useState, Dispatch, SetStateAction } from "react";
import { BaseJob } from "../../../classes/job/BaseJobPosition";
import { Job } from "../../../classes/job/JobPosition";
import FormCreate from "./FormCreate";
import styles from "./CreateJob.module.scss";
import { priceStructure, workDayStructure } from "../../../types/job/Position";
import TextFormCreate from "./textFormCreate/TextFormCreate";
import { getDaysBetweenDates } from "../../../services/dateService";
//#endregion

export type formData = {
    name: string;
    companyName?: string;
    startDate: Date;
    endDate: Date;
};
export type textFormData = {
    prices: priceStructure;
    workdayTimes: workDayStructure;
};
type thisProps = {
    onEnd(updatedJobPosition: Job): void;
    loading: boolean;
    onSetLoading: Dispatch<SetStateAction<boolean>>;
};

const CreateJob: FunctionComponent<thisProps> = ({
    onEnd,
    loading,
    onSetLoading,
}) => {
    const [formData, setFormData] = useState<formData | null>(null);
    const [textFormData, setTextFormData] = useState<textFormData | null>(null);
    const [error, setError] = useState<string>("");

    async function setData(
        formDataParam?: formData,
        textFormDataParam?: textFormData
    ) {
        if (formDataParam) setFormData(formDataParam);
        if (textFormDataParam) setTextFormData(textFormDataParam);

        const fData = formDataParam ?? formData;
        if (fData == null) return;
        const tfData = textFormDataParam ?? textFormData;
        if (tfData == null) return;

        onSetLoading(true);
        await createJob(fData, tfData);
        onSetLoading(false);
    }

    async function createJob(
        formData: formData,
        textFormData: textFormData
    ): Promise<void> {
        const newBaseJob = new BaseJob({
            name: formData.name,
            hourPrice: textFormData.prices,
            workdayTimes: textFormData.workdayTimes,
            lastPayment: formData.startDate,
            nextPayment: formData.endDate,
            companyName: formData.companyName,
        });

        const jobRes = await newBaseJob.create();
        if (!jobRes.ok && jobRes.error) {
            setError(jobRes.error.message);
            return;
        }

        if (jobRes.ok && jobRes.content) {
            const newJob = new Job({
                ...newBaseJob,
                id: jobRes.content,
            });
            onEnd(newJob);
            return;
        }
    }

    return (
        <div className={styles.formContainer}>
            <FormCreate
                onEnd={(formDataParam) => setData(formDataParam, undefined)}
                onSetError={setError}
                error={formData ? "" : error}
                loading={loading}
                submitted={!!formData}
            />
            {formData && (
                <TextFormCreate
                    onSetLoading={onSetLoading}
                    onSetError={setError}
                    error={error}
                    onEnd={(textFormData) => setData(undefined, textFormData)}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default CreateJob;
