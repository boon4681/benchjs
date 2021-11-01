import React, { useState, ReactComponentElement, useRef, useEffect } from 'react'
import { HiPlus } from 'react-icons/hi'
import { v4 as uuidv4 } from 'uuid';
import * as monaco from 'monaco-editor'
import { Editor } from '../components/editor';

export default () => {
    const [block, setBlock] = useState(new Map<string, monaco.editor.IStandaloneCodeEditor>());
    const [box, setBox] = useState<any[]>([
        <Editor key={uuidv4()} index={block.size} callback={(editor: monaco.editor.IStandaloneCodeEditor, id) => {
            block.set(id, editor)
            setBlock(block)
        }} />
    ]);

    const add = () => {
        let boxs = [...box]
        boxs.push(<Editor key={uuidv4()} index={block.size} callback={(editor: monaco.editor.IStandaloneCodeEditor, id) => {
            block.set(id, editor)
            setBlock(block)
        }} />);
        setBox(boxs);
    };
    useEffect(() => {
        add()
        setInterval(() => {
            console.log(
                [...block.values()][0].getValue()
            )
        }, 500)
    }, [])
    return (
        <>
            <div className="relative flex box-border mx-auto flex-col min-h-screen">
                <main>
                    <nav className="relative w-full max-w-7xl mx-auto box-border">
                        <nav className="flex justify-between py-7 px-3 select-none">
                            <a href="/">
                                <div className="flex items-center logo">
                                    <div className="font-bold text-2xl text-white mx-3">Benchjs</div>
                                </div>
                            </a>
                            <div className="flex items-center h-9 w-auto">
                                <div className="px-4">
                                    <button className="button is-link">Donate</button>
                                </div>
                            </div>
                        </nav>
                    </nav>
                    <div className="max-w-6xl w-full mx-auto relative h-auto" style={{ minHeight: "400px" }}>
                        <div className="w-12 h-12 p-3 add cursor-pointer absolute bottom-0 -left-20" onClick={add}>
                            <HiPlus className="w-full h-full text-white" />
                        </div>
                        <div className="min-h-40 w-full">
                            {box}
                        </div>
                    </div>
                </main>
            </div>
            <footer className='py-10 text-center' style={{backgroundColor:'#1b1b1c'}}>
                <div>© {(()=>{
                    const y = new Date().getUTCFullYear().toString()
                    if(y=='2021'){
                        return y
                    }else{
                        return `2021-${y}`
                    }
                })()} benchjs.boon4681.com</div>
            </footer>
        </>
    )
}