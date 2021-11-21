import React, { useEffect, useRef, useState } from 'react'
import { CgClose } from "react-icons/cg";

export interface pModal {
    close?: () => void,
    state?: boolean,
    children?: React.ReactNode
}

export interface sModal {
    state: boolean
}

export class Modal extends React.Component<pModal, sModal>{
    private ele?: HTMLElement
    constructor(props: sModal) {
        super(props)
        this.state = {
            state: this.props.state || false
        }
    }
    assign = (ele: HTMLDivElement) => {
        this.ele = ele;
    }
    render() {
        return this.state.state? (
            <div ref={this.assign} className={`fixed flex justify-center items-center h-screen top-0 left-0 w-full z-50`}>
                <div className="w-full h-full absolute" style={{ background: '#20242aa1' }} onClick={() => {
                    this.setState({ state: false })
                    if(this.props.close) this.props.close()
                }} />
                <div className="max-w-md w-full">
                    <div className={`max-w-md w-full relative overflow-hidden rounded-md shadow-md mx-4 transition-all duration-100 ease-in transform ${!this.state.state ? 'scale-0' : 'scale-100'}`}>
                        <CgClose onClick={() => {
                            this.setState({ state: false })
                            if(this.props.close) this.props.close()
                        }} className="absolute top-0 right-0 mx-4 my-4 w-6 h-6 hover:text-gray-300 cursor-pointer" />
                        {this.props.children}
                    </div>
                </div>
            </div>
        ):(
            <div></div>
        )
    }
}