import { ChangeEvent, FunctionComponent, useEffect } from "react";
import styles from "./Checkbox.module.scss";

interface thisProps extends inputProp {
    fields: checkbox;
}

const Checkbox: FunctionComponent<thisProps> = ({ fields, onUpdateAnswer }) => {
    const { id, label, checked } = fields;

    function handleChange({ target }: ChangeEvent<HTMLInputElement>) {
        onUpdateAnswer({ id: target.id, value: target.checked });
    }

    //Default value to false to avoid having unanswered questions
    useEffect(() => {
        onUpdateAnswer({ id: id, value: false });
    }, []);

    return (
        <div className={styles.checkboxContainer}>
            <label htmlFor={label} className="checkbox-label">
                <input
                    type="checkbox"
                    id={id}
                    name={label}
                    onChange={handleChange}
                    checked={checked}
                />
                {label}
            </label>
        </div>
    );
};

export default Checkbox;
