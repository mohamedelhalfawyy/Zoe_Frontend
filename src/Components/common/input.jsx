import React from "react";
import {Icon} from "@iconify/react";
const Input = ({name, label, error, className, icon, isUIL,  ...rest}) => {

    return (
        <div className={className}>
            <input
                {...rest}
                name={name}
                id={name}
                className="form-style"
                placeholder={label}
                autoComplete="off"/>
            {error && <div className={"alert alert-danger"}>
                {error}
            </div>}
            {isUIL ? <i className={icon}></i> : <Icon icon={icon} className={"input-icon"}/>}
        </div>
    );
}

export default Input;