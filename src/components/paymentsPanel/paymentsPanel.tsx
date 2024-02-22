//#region Dependency list
import {
    AnimationEvent,
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import jobService from "../../services/JobService";
import { Job } from "../../classes/job/JobPosition";
import { payment } from "../../types/job/Payment";
import styles from "./paymentsPanel.module.scss";
import { getDateAsInputValue, parseDateAsId } from "../../services/dateService";
//#endregion

type thisProps = {
    selectedJob: Job;
    selectedPayment: payment | null;
    onSetSelectedPayment: Dispatch<SetStateAction<payment | null>>;
};
type payArr = [payment, payment, payment, payment, payment];
type savedPayments = {
    [index: number]: { payments: Partial<payArr>; dateKey: string };
};

const PaymentsPanel: FunctionComponent<thisProps> = ({
    selectedJob,
    selectedPayment,
    onSetSelectedPayment,
}) => {
    const [index, setIndex] = useState<number>(1);
    const [indexLimit, setIndexLimit] = useState<{
        left: number;
        right: number;
    }>({ left: 1, right: 2 });
    const [direction, setDirection] = useState<"left" | "right" | "">("left");
    const [show, setShow] = useState<boolean>(true);
    const [animName, setAnimName] = useState<string>("");
    const [payments, setPayments] = useState<Partial<payArr>>([]);
    const [savedPayments, setSavedPayments] = useState<savedPayments>({});

    function handleDirectionChange(offset: "left" | "right") {
        const adjust = offset === "left" ? -1 : 1;
        const newIndex = index + adjust;
        if (
            (offset === "left" && indexLimit.left > newIndex) ||
            (offset === "right" && indexLimit.right < newIndex)
        )
            return;

        const name = `fade-${offset}`;
        setAnimName(name);
        setShow(false);

        setIndex(newIndex < 1 ? 1 : newIndex);
    }

    function handleAnimationEnd(event: AnimationEvent<HTMLDivElement>) {
        if (event.animationName.includes("hide")) {
            setShow(true);
            const isLeft = event.animationName.includes("left");
            setDirection(isLeft ? "right" : "left");
        }
    }

    function handlePaymentClick(payment: payment): void {
        if (selectedPayment && payment.id === selectedPayment.id) {
            onSetSelectedPayment(null);
        } else {
            onSetSelectedPayment(payment);
        }
    }

    function getDate(payment: payment): string {
        const start = getDateAsInputValue(payment.startDate);
        const end = getDateAsInputValue(payment.endDate);
        return `${start} to ${end}`;
    }

    useEffect(() => {
        const dateId = `${parseDateAsId(
            selectedJob.lastPayment
        )}${parseDateAsId(selectedJob.nextPayment)}`;
        const cachedElem = savedPayments[index];
        if (cachedElem && cachedElem.dateKey === dateId) {
            const filtered = cachedElem.payments.filter(
                (c) => c !== undefined
            ) as Partial<payArr>;
            setPayments(filtered);
            return;
        }

        jobService.getAllPayments(selectedJob.id, index).then((response) => {
            if (!response.ok) {
                setPayments([]);
            }

            const paymentResDb = response.content;
            if (response.ok && paymentResDb && paymentResDb?.length > 0) {
                const paymentRes = paymentResDb.map((p) =>
                    jobService.parseDbPaymentAsPayment(p)
                ) as Partial<payArr>;
                const cache = structuredClone(savedPayments);

                cache[index] = { payments: paymentRes, dateKey: dateId };
                setSavedPayments(cache);
                setPayments(paymentRes);
                if (paymentRes.length < 5) {
                    const newLimit = structuredClone(indexLimit);
                    newLimit.right = index;
                    setIndexLimit(newLimit);
                }
            }

            if (response.ok && paymentResDb && paymentResDb?.length <= 0) {
                if (index === 1) return;

                const lastDirection = direction === "left" ? "right" : "left";
                const lastValidIndex =
                    index + (lastDirection === "left" ? 1 : -1);
                const newLimit = structuredClone(indexLimit);
                newLimit[lastDirection] = lastValidIndex;
                setIndexLimit(newLimit);
            }
        });
    }, [index, selectedJob, savedPayments, indexLimit, direction]);

    useEffect(() => {
        if (show && payments.length > 0 && direction) {
            const name = `show-${direction}`;
            setAnimName(name);
            setDirection("");
        }
    }, [payments, show, direction]);

    return payments.length > 0 ? (
        <div className={styles.panelBody}>
            <h3>Past payslips</h3>
            <div className={styles.navigation}>
                <button
                    onClick={() => handleDirectionChange("left")}
                    disabled={indexLimit.left === index}
                >{`<`}</button>
                <div
                    className={`${styles.scrollMenu} ${styles[animName]}`}
                    onAnimationEnd={(e) => handleAnimationEnd(e)}
                >
                    {payments.map(
                        (p) =>
                            p && (
                                <button
                                    key={p.id}
                                    onClick={() => handlePaymentClick(p)}
                                >
                                    {getDate(p)}
                                </button>
                            )
                    )}
                </div>
                <button
                    onClick={() => handleDirectionChange("right")}
                    disabled={indexLimit.right === index}
                >{`>`}</button>
            </div>
        </div>
    ) : (
        <></>
    );
};

export default PaymentsPanel;
