import React from "react";

const AgentFooter = () => {
    return (
        <>
            <footer className="footer pt-3  ">
                <div className="container-fluid">
                    <div className="row align-items-center justify-content-lg-between">
                        <div className="col-lg-6 mb-lg-0 mb-2   ">
                            <div className="copyright text-center text-sm text-muted text-lg-start">
                                © 2023 made with <i className="fa fa-heart" color="red" />
                            </div>
                        </div>
                        <div className="flex items-center">
                            <ul className="flex items-center justify-center w-full">
                                <li className="m-2 text-sm">
                                    <a href="https://www.creative-tim.com" className="nav-link text-muted" target="_blank">Learn Global</a>
                                </li>
                                <li className="m-2 text-sm">
                                    <a href="https://www.creative-tim.com/presentation" className="nav-link text-muted" target="_blank">About Us</a>
                                </li>
                                <li className="m-2 text-sm">
                                    <a href="https://www.creative-tim.com/license" className="nav-link pe-0 text-muted" target="_blank">License</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default AgentFooter;