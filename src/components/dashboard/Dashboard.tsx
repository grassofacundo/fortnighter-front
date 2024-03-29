//#region Dependency list
import {
    FunctionComponent,
    useState,
    createContext,
    Dispatch,
    SetStateAction,
} from "react";
import JobPanel from "../jobPanel/jobPanel";
import { Job } from "../../classes/job/JobPosition";
import MainPanel from "../mainPanel/MainPanel";
import { payment } from "../../types/job/Payment";
import jobService from "../../services/JobService";
import styles from "./Dashboard.module.scss";
import PaymentsPanel from "../paymentsPanel/paymentsPanel";
//#endregion

type thisProps = unknown;
type contentContextType = {
    job: Job;
    isPay: boolean;
    setJob: Dispatch<SetStateAction<Job | null>>;
};
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const ContentContext = createContext<contentContextType>(null!);

const Dashboard: FunctionComponent<thisProps> = () => {
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [selectedPayment, setSelectedPayment] = useState<payment | null>(
        null
    );

    return (
        <div className={styles.mainBody}>
            <JobPanel
                selectedJob={selectedJob}
                onSetSelectedJob={setSelectedJob}
            />

            {selectedJob && (
                <>
                    <PaymentsPanel
                        selectedJob={selectedJob}
                        selectedPayment={selectedPayment}
                        onSetSelectedPayment={setSelectedPayment}
                    />
                    <ContentContext.Provider
                        value={{
                            job: selectedPayment
                                ? jobService.parsePaymentAsJob(selectedPayment)
                                : selectedJob,
                            isPay: !!selectedPayment,
                            setJob: setSelectedJob,
                        }}
                    >
                        <MainPanel />
                    </ContentContext.Provider>
                </>
            )}
        </div>
    );
};

export default Dashboard;
