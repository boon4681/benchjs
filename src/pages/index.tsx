import React, { useState, ReactComponentElement, useRef, useEffect } from 'react'
import { HiPlus } from 'react-icons/hi'
import { v4 as uuidv4 } from 'uuid';
import * as monaco from 'monaco-editor'
import { Editor } from '../components/editor';
import { BiMinus } from "react-icons/bi";

export default () => {
    const [block, setBlock] = useState(new Map<string, { monaco: monaco.editor.IStandaloneCodeEditor, editor: HTMLDivElement, box: HTMLDivElement, id: string, input: HTMLInputElement }>());
    const [box, setBox] = useState([
        <Editor block={uuidv4()} index={block.size} callback={(_in) => {
            block.set(_in.id, _in)
            setBlock(block)
        }} />
    ]);
    const [onRemove,setOnRemove] = useState(false)
    const [mPos, setmPos] = useState(0)
    const [selected, setSelected] = useState('')
    const remove_btn = useRef(document.createElement('div'))
    const calc_pos_remove_btn = (mPos: number) => {
        const keys = [...block.keys()]
        const keyo = block.get(keys[0])
        if (keyo) {
            let eSave: [string, number] = [keyo.id, Math.sqrt((keyo.editor.getBoundingClientRect().y - mPos) ** 2)];
            for (let i = 0; i < keys.length; i++) {
                const e = block.get(keys[i])
                if (e) {
                    const w = e.editor.getBoundingClientRect()
                    const ePos = w.y + w.height - 40
                    const calc = Math.sqrt((ePos - mPos) ** 2)
                    if (eSave[1] > calc) {
                        eSave = [e.id, calc];
                    }
                }
            }
            const mo = block.get(eSave[0])?.editor.getBoundingClientRect()
            if (!mo) return
            remove_btn.current.style.top = `${mo.top + mo.height/2-40}px`
            remove_btn.current.style.left = `${mo.x + mo.width}px`
            setSelected(eSave[0])
        }
    }
    const mouse = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const m = event.screenY
        setmPos(m)
        calc_pos_remove_btn(m)
    }
    const scroll = () => {
        calc_pos_remove_btn(mPos)
    }
    const add = () => {
        let boxs = [...box]
        boxs.push(<Editor block={uuidv4()} index={block.size} callback={(_in) => {
            block.set(_in.id, _in)
            setBlock(block)
        }} />);
        setBox(boxs);
    };
    const remove = () => {
        if(onRemove) return;
        let boxs = [...box]
        if (boxs.length > 2) {
            const x = block.get(selected)
            if (x) {
                setOnRemove(true)
                const i = boxs.findIndex((a) => a.props['block'] == x.id)
                boxs = boxs.filter((a, _i) => _i != i)
                x.box.classList.remove('h-80')
                setTimeout(()=>{
                    block.delete(x.id)
                    setBlock(block)
                    setBox(boxs)
                    setOnRemove(false)
                },410)
            }
        }
    }
    window.onscroll = scroll
    useEffect(() => {
        add()
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
                    <div className="max-w-6xl mx-auto relative h-auto" onMouseMove={mouse} style={{ minHeight: "400px" }}>
                        <div className="w-12 h-12 p-3 add cursor-pointer absolute bottom-0 -left-20" onClick={add}>
                            <HiPlus className="w-full h-full text-white" />
                        </div>
                        <div className="min-h-40 w-full relative" style={{ maxWidth: "500px" }}>
                            <div ref={remove_btn} className="ml-3 w-10 h-10 p-3 border-2 opacity-50 hover:opacity-75 rounded-full cursor-pointer fixed top-0 right-0 transition-all duration-200" onClick={remove}>
                                <BiMinus className="w-full h-full text-white" />
                            </div>
                            {box}
                        </div>
                    </div>
                </main>
            </div>
            <footer className='py-10 text-center' style={{ backgroundColor: '#1b1b1c' }}>
                <div>© {(() => {
                    const y = new Date().getUTCFullYear().toString()
                    if (y == '2021') {
                        return y
                    } else {
                        return `2021-${y}`
                    }
                })()} benchjs.boon4681.com</div>
            </footer>
        </>
    )
}