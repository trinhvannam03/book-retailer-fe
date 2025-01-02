import React from "react";

const RippleButton = ({children, onClick}) => {
    const createRipple = (event) => {
        const button = event.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`;
        circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`;
        circle.classList.add("ripple");

        const existingRipple = button.getElementsByClassName("ripple")[0];
        if (existingRipple) {
            existingRipple.remove();
        }

        button.appendChild(circle);
    };

    return (
        <button onChange={() => {
        }} className="ripple-button" onClick={(event) => {
            createRipple(event)
            if (onClick) {
                onClick()
            }
        }}>
            {children}
        </button>
    );
};

export default RippleButton;
