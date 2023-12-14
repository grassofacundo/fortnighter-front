//#region Dependency list
import { ChangeEvent, FunctionComponent, useEffect, useState } from "react";
import styles from "./Checkbox.module.scss";
import { checkbox } from "../../../../../types/form/CheckboxTypes";
import { inputProp } from "../../../../../types/form/FormTypes";
//#endregion

interface thisProps extends inputProp {
    fields: checkbox;
}

const Checkbox: FunctionComponent<thisProps> = ({ fields, onUpdateAnswer }) => {
    const { id, label, checked } = fields;
    const [isChecked, setIsChecked] = useState(checked);

    function handleChange({ target }: ChangeEvent<HTMLInputElement>) {
        setIsChecked(target.checked);
        console.log(target.checked);
        onUpdateAnswer({ id: target.id, value: target.checked });
    }

    // //Default value to false to avoid having unanswered questions
    // useEffect(() => {
    //     onUpdateAnswer({ id: id, value: false });
    // }, []);

    return (
        <div className={styles.checkboxContainer}>
            <label htmlFor={id} className="checkbox-label">
                <input
                    type="checkbox"
                    id={id}
                    name={label}
                    onChange={handleChange}
                    checked={isChecked}
                />
                {label}
            </label>
        </div>
    );
};

export default Checkbox;
