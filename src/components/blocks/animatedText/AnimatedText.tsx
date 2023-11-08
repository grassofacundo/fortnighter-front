import { FunctionComponent } from "react";
import style from "./AnimatedText.module.scss";

type thisProps = {
    fullText: string;
};

const AnimatedText: FunctionComponent<thisProps> = ({ fullText }) => {
    function makeCharArray(fullText: string): string[] {
        let charArray: string[] = [];
        for (let i: number = 0; i < fullText.length; i++) {
            charArray.push(fullText[i]);
        }
        return charArray;
    }

    return (
        <div className={style.textWrapper}>
            {makeCharArray(fullText).map((char, i) => (
                <p
                    key={`${char}${i}`}
                    style={{
                        animationDelay: `${
                            Math.floor(Math.random() * 10) * 50
                        }ms`,
                    }}
                >
                    {char}
                </p>
            ))}
        </div>
    );
};

export default AnimatedText;
