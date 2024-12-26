import React, {useState} from 'react';
import {FaCheck} from "react-icons/fa";

const Checkbox = ({action}) => {
    const [checked, setChecked] = useState(false)
    return (
        <div onClick={() => {
            setChecked(!checked)
        }}  className={`checkbox ${checked && "checked"}`}>
            <FaCheck  />
        </div>
    );
};

export default Checkbox;