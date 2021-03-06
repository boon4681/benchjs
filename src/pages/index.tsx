import React, { useState, ReactComponentElement, useRef, useEffect } from 'react'
import { Blocks } from '../components/Blocks';
import { Kofi_Panel } from '../components/Donate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/custom.toast.scss'
import '../assets/css/markdown.pcss'
import { AiFillGithub } from 'react-icons/ai'
import { Modal } from '../components/Modal';
import ReactMarkdown from 'react-markdown'
import release_notes from '../../release_notes.md'
import { get, remove, set } from '../.libs/cookie'

export default () => {
    const [donate, setDonate] = useState(false)
    const version = get("benchjs-version")
    const now = ([...release_notes.code.matchAll(/# benchjs ([\w.]+)/g)].pop() as Array<any>)[1]
    const content = (release_notes.code.split("####").filter(a => a)).pop()
    return (
        <>
            <div className="relative flex box-border mx-auto flex-col min-h-screen">
                <Kofi_Panel
                    status={donate}
                    close={() => {
                        setDonate(false)
                    }} />
                <Modal state={version != now} close={() => set("benchjs-version", now)}>
                    <div className="max-w-xl h-full mx-auto px-10 py-6" style={{ backgroundColor: "#32353B" }}>
                        <ReactMarkdown className="markdown bg-transparent text-gray-200">
                            {`${content}`}
                        </ReactMarkdown>
                    </div>
                </Modal>
                <main>
                    <nav className="w-full max-w-7xl mx-auto box-border top-0 z-20">
                        <nav className="flex justify-between py-7 px-3 select-none">
                            <a href="/">
                                <div className="flex items-center logo">
                                    <div className="font-bold text-2xl text-white mx-3">Benchjs</div>
                                </div>
                            </a>
                            <div className="flex items-center h-9 w-auto">
                                <div className="px-4">
                                    <button className="button is-link" role="button" onClick={() => {
                                        setDonate(true)
                                    }}>Donate</button>
                                </div>
                            </div>
                        </nav>
                    </nav>
                    <div className="max-w-6xl mx-auto relative h-auto" style={{ minHeight: "400px" }}>
                        <div className="w-full relative h-auto px-6 sm:px-10">
                            <div className="fixed z-50 pointer-events-none xl:absolute top-0 left-0 overflow-hidden w-full h-full">
                                <div className="pointer-events-auto">
                                    <ToastContainer
                                        position="top-right"
                                        autoClose={2000}
                                        hideProgressBar={false}
                                        newestOnTop={false}
                                        limit={6}
                                        closeOnClick
                                        rtl={false}
                                        pauseOnFocusLoss
                                        draggable
                                        pauseOnHover
                                    />
                                </div>
                            </div>
                            <Blocks />
                        </div>
                    </div>
                </main>
            </div>
            <footer className='mt-10 py-10 flex flex-col items-center justify-center' style={{ backgroundColor: '#16161a' }}>
                <a rel="noopener noreferrer" target="_blank" href="https://github.com/boon4681/benchjs" className="flex flex-col items-center hover:text-gray-200">
                    <AiFillGithub className="w-8 h-8" /><div className="ml-2">View on Github</div>
                </a>
                <div className="text-xs flex items-center mt-3 select-none">
                    <div className="text-white select-none transform scale-75 px-2 py-0.5 text-xs text-center rounded-sm bg-blue-600">v{now}</div>
                    <div>made with ?????? by boon4681</div>
                </div>
            </footer>
        </>
    )
}