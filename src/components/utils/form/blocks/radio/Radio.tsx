import { ChangeEvent, Fragment, FunctionComponent } from "react";

interface thisProps extends inputProp {
    fields: radio;
}

const Radio: FunctionComponent<thisProps> = ({ fields, onUpdateAnswer }) => {
    const { isOptional, radioElem, title, id, label } = fields;

    const validInput = ({ target }: ChangeEvent<HTMLInputElement>) => {
        onUpdateAnswer({ id: target.id, value: target.value, error: "" });
    };

    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <p>{title}</p>
            {radioElem.map((elem) => (
                <Fragment key={elem.id}>
                    <label htmlFor={elem.id}>{elem.label}</label>
                    <input
                        type="radio"
                        id={elem.id}
                        name={elem.name}
                        value={elem.value}
                        required={!isOptional}
                        onChange={(target) => validInput(target)}
                    />
                </Fragment>
            ))}
        </div>
    );
};

export default Radio;
