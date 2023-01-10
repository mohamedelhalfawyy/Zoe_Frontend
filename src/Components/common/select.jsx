import React from "react";

const Select = ({id, label, options, error, ...rest}) => {
    return (
        <div className="form-group">
            <select className="custom-select form-style" name={id} id={id} {...rest} required>
                <option value=""/>
                {options.map(option => (
                    <option key={option._id} value={option._id}>
                        {option.name}
                    </option>
                ))}
            </select>
            {error && <div
                className="alert alert-danger"
                role="alert">
                {error}
            </div>
            }
        </div>
    );
}

export default Select;