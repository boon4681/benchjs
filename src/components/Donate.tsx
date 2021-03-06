import React from "react";
import { CgClose } from "react-icons/cg";

export class Kofi_Panel extends React.Component<{
    status: boolean
    close:()=>void
}> {
    private ele?: HTMLDivElement;
    assign = (component: HTMLDivElement) => {
        this.ele = component;
    };
    render() {
        if (this.props.status)
            return (
                <div className="fixed flex justify-center items-center h-screen top-0 left-0 w-full z-50">
                    <div className="w-full h-full absolute" style={{ background: '#20242aa1' }} onClick={this.props.close}></div>
                    <div className="max-w-md w-full bg-indigo-50 relative overflow-hidden rounded-md shadow-md transform mx-4">
                        <CgClose onClick={this.props.close} className="absolute top-0 right-0 mx-4 my-4 w-6 h-6 hover:text-gray-700 cursor-pointer" />
                        <iframe className="w-full" style={{ maxHeight: "630px" }} id='kofiframe' src='https://ko-fi.com/boon4681/?hidefeed=true&widget=true&embed=true&preview=true' height='712' title='boon4681'></iframe>
                    </div>
                </div>
            )
        else
            return (
                <div></div>
            )
    }
}