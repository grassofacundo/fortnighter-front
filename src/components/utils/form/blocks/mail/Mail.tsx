import { ChangeEvent, FunctionComponent } from "react";

interface thisProps extends inputProp {
    fields: mail;
}

const Mail: FunctionComponent<thisProps> = ({ fields, onUpdateAnswer }) => {
    const { id, placeholder, label, isOptional } = fields;

    function isMailValid(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return (
            email !== null &&
            email !== "" &&
            email.length > 3 &&
            emailRegex.test(email)
        );
    }

    function handleChange({ target }: ChangeEvent<HTMLInputElement>) {
        let error = "";
        if (!isMailValid(target.value))
            error = "Email doesn't have the correct format";
        onUpdateAnswer({ id: target.id, value: target.value, error });
    }

    return (
        <div>
            {label && <label htmlFor={id}>{label}</label>}
            <input
                type="mail"
                id={id}
                required={!isOptional}
                placeholder={placeholder}
                onChange={(target) => handleChange(target)}
            />
        </div>
    );
};

export default Mail;
