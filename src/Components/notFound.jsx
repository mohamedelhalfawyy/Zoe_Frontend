import React from "react";

const NotFound = () => {
    return(
        <div className={"test"}>
            <center><img src={require("../images/error.gif")} className={"error"} alt={"Notfound Gif"}/></center>
        </div>
    );
};

export default NotFound;