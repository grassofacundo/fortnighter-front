import {
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useRef,
    useState,
} from "react";
import styles from "./WelcomeAnimation.module.scss";

type thisProps = {
    onSetAnimationEnded: Dispatch<SetStateAction<boolean>>;
    fullText: string;
};

const WelcomeAnimation: FunctionComponent<thisProps> = ({
    fullText,
    onSetAnimationEnded,
}) => {
    const [animationFinished, setAnimationFinished] = useState<boolean>(false);
    const animCount = useRef<number>(0);
    const usedDelay = useRef<number[]>([]);

    function makeCharArray(fullText: string): string[] {
        const charArray: string[] = [];
        for (let i = 0; i < fullText.length; i++) {
            charArray.push(fullText[i]);
        }
        return charArray;
    }

    function getDelay(): string {
        const delayPool = fullText.split("").map((x, i) => {
            return i + 1;
            console.log(x);
        });
        const filteredDelayPool = delayPool.filter(
            (delay) => !usedDelay.current.includes(delay)
        );
        const delay =
            filteredDelayPool[
                Math.floor(Math.random() * filteredDelayPool.length)
            ];
        usedDelay.current.push(delay);
        return `${delay * 50}ms`;
    }

    function handleAnimationEnd() {
        if (animationFinished) return;

        animCount.current++;
        if (animCount.current >= fullText.length) {
            onSetAnimationEnded(true);
            setAnimationFinished(true);
        }
    }

    return (
        <div className={styles.textWrapper}>
            {makeCharArray(fullText).map((char, i) => (
                <p
                    key={`${char}${i}`}
                    style={{
                        animationDelay: getDelay(),
                    }}
                    onAnimationEnd={handleAnimationEnd}
                >
                    {char}
                </p>
            ))}
        </div>
    );
};

export default WelcomeAnimation;
