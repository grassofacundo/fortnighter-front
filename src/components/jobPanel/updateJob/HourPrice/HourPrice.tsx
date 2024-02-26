//#region Dependency list
import { FunctionComponent, useState, Dispatch, SetStateAction } from "react";
import { workDayType } from "../../../../types/job/Position";
import styles from "./HourPrice.module.scss";
import CustomSelect from "../../../blocks/customSelect/CustomSelect";
import HourPriceContent from "./HourPriceContent";
//#endregion

type thisProps = {
    loading: boolean;
    onSetLoading: Dispatch<SetStateAction<boolean>>;
};

const HourPrice: FunctionComponent<thisProps> = ({ loading, onSetLoading }) => {
    const workDays: { [key in workDayType]: string } = {
        week: "weekday",
        saturday: "saturday",
        sunday: "sunday",
        holiday: "holiday",
    };

    const week = Object.keys(workDays)[0];
    const [workdayType, setWorkdayType] = useState<workDayType>(
        week as workDayType
    );

    return (
        <form id="hourPriceForm" className={styles.priceFormBody}>
            <HourPriceContent
                workdayType={workdayType}
                loading={loading}
                onSetLoading={onSetLoading}
            >
                <>
                    During a
                    <CustomSelect
                        placeHolder={workDays[workdayType]}
                        options={Object.keys(workDays).map((day) => {
                            return {
                                value: day,
                                label: workDays[day as workDayType],
                                selected: day === workdayType,
                            };
                        })}
                        onChange={(value) =>
                            setWorkdayType(value as workDayType)
                        }
                        customClass={styles.inlineSelect}
                    />
                </>
            </HourPriceContent>
        </form>
    );
};

export default HourPrice;
