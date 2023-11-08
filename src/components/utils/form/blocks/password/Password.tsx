import { ChangeEvent, FunctionComponent } from "react";

interface thisProps extends inputProp {
    fields: password;
}

const InputPassword: FunctionComponent<thisProps> = ({
    fields,
    onUpdateAnswer,
}) => {
    const { id, label, placeholder, isOptional } = fields;
    const passRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

    function validInput({ target }: ChangeEvent<HTMLInputElement>) {
        let error = "";
        if (!passRegex.test(target.value))
            error =
                "Password must contain 1 lowercase, 1 uppercase, 1 special character and be at least 8 characters long";
        onUpdateAnswer({ id: target.id, value: target.value, error });
    }

    return (
        <div>
            {label && <label htmlFor={id}>{label}</label>}
            <input
                type="password"
                id={id}
                required={!isOptional}
                placeholder={placeholder}
                onChange={(target) => validInput(target)}
            />
        </div>
    );
};

export default InputPassword;
