import { useRef, FunctionComponent, useEffect, ReactElement } from "react";
import { Transition } from "react-transition-group";

type thisProps = {
    inState: boolean;
    children: ReactElement;
    unmountOnExit?: boolean;
    customClass?: CSSModuleClasses[string];
    onExitEvent?: <T extends unknown[], R>(...args: T) => R | void;
};

const duration = 300;

const InOutAnim: FunctionComponent<thisProps> = ({
    inState,
    children,
    unmountOnExit = true,
    customClass,
    onExitEvent,
}) => {
    const nodeRef = useRef(null);

    useEffect(() => {
        const wrapper = nodeRef.current as HTMLDivElement | null;
        if (!wrapper) return;

        if (!inState && !unmountOnExit) {
            wrapper.setAttribute("inert", "");
        } else {
            wrapper.removeAttribute("inert");
        }
    }, [inState, unmountOnExit]);

    return (
        <Transition
            nodeRef={nodeRef}
            in={inState}
            timeout={duration}
            unmountOnExit={unmountOnExit}
            onExited={onExitEvent}
        >
            {(state) => (
                <div
                    ref={nodeRef}
                    className={`inOut-${state} inOut ${customClass}`}
                    style={{
                        transitionDuration: `${duration}ms`,
                    }}
                >
                    {children}
                </div>
            )}
        </Transition>
    );
};

export default InOutAnim;
