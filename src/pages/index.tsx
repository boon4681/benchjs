import React, { useState, ReactComponentElement, useRef, useEffect } from 'react'
import { HiPlus } from 'react-icons/hi'
import { v4 as uuidv4 } from 'uuid';
import * as monaco from 'monaco-editor'
import { Editor } from '../components/editor';
import { Kofi_Panel } from '../components/Donate';
import { BiMinus } from "react-icons/bi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/custom.toast.scss'
// import Benchmark from 'benchmark'
// @ts-ignore
let bench = Benchmark
export default () => {
    const [block, setBlock] = useState(new Map<string, { id: string, monaco: monaco.editor.IStandaloneCodeEditor, editor: HTMLElement, block: HTMLElement, name: string, value: string, bench?: { text: string, hz: number, rme: number, sample: number } }>());

    const [ids, setIds] = useState<string[]>(['1','2']);
    const [donate, setDonate] = useState(false)
    const [onRemove, setOnRemove] = useState(false)
    const [onAdding, setOnAdding] = useState(false)
    const [mPos, setmPos] = useState(0)
    const [selected, setSelected] = useState('')
    const remove_btn = useRef(document.createElement('div'))
    const add_btn = useRef(document.createElement('div'))
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
            remove_btn.current.style.top = `${mo.top + mo.height / 2 - 40}px`
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
        ids.push(uuidv4())
        setTimeout(() => {
            add_btn.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 300);
    };
    const remove = () => {
        if (onRemove) return;
        if (ids.length > 2) {
            const x = block.get(selected)
            if (x) {
                setOnRemove(true)
                x.block.classList.remove('h-80')
                setTimeout(() => {
                    const i = ids.findIndex(a => a == x.id)
                    if (i > -1) {
                        ids.splice(i, 1)
                        block.delete(x.id)
                        setIds(ids)
                        setBlock(block)
                        setOnRemove(false)
                    }
                    calc_pos_remove_btn(mPos)
                }, 500)
            }
        } else {
            setOnRemove(true)
            setTimeout(() => {
                setOnRemove(false)
            }, 410)
            toast.error('🦄 block of code cannot less than 2', {
                position: "top-right",
                theme: 'dark',
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }
    window.onscroll = scroll
    window.onresize = () => {
        calc_pos_remove_btn(mPos);
        [...block.values()].forEach(a => {
            a.monaco.layout()
        })
    }
    return (
        <>
            <div className="relative flex box-border mx-auto flex-col min-h-screen">
                <Kofi_Panel
                    status={donate}
                    close={() => {
                        setDonate(false)
                    }} />
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
                                    <button className="button is-link" onClick={() => {
                                        setDonate(true)
                                    }}>Donate</button>
                                </div>
                            </div>
                        </nav>
                    </nav>
                    <div className="max-w-6xl mx-auto relative h-auto" onMouseMove={mouse} style={{ minHeight: "400px" }}>
                        <div className="w-full relative h-auto px-10 sm:px-20">
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
                            <button className="button is-dark" onClick={() => {
                                [...block.values()].forEach(a => {
                                    const x = new bench({
                                        'name': a.name,
                                        'fn': a.value,
                                        'onCycle': (e: any) => {
                                            block.set(a.id, {
                                                ...a,
                                                bench: {
                                                    text: String(e.target),
                                                    hz: e.target.hz,
                                                    sample: e.target.stats.sample.length,
                                                    rme: e.target.stats.rme
                                                }
                                            })
                                            setBlock(block)
                                            // console.log(e.target)
                                            // console.log(String(e.target))
                                        },
                                        'onComplete': (e: any) => {
                                            console.log(e)
                                        },
                                        'onError': (e: any) => {
                                            toast.error(`🦄 error ${a.name}`, {
                                                position: "top-right",
                                                theme: 'dark',
                                                hideProgressBar: false,
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                draggable: true,
                                                progress: undefined,
                                            });
                                        }
                                    })
                                    x.run()
                                })
                            }}>▶</button>
                            <div className="lg:flex w-full">
                                <div className="min-h-40 w-full relative mb-20 lg:mb-0 lg:max-w-lg">
                                    <div ref={add_btn} className="w-12 z-20 h-12 p-3 add cursor-pointer absolute -bottom-16 left-0" onClick={add}>
                                        <HiPlus className="w-full h-full text-white" />
                                    </div>
                                    <div ref={remove_btn} className="ml-3 z-20 w-10 h-10 p-3 border-2 opacity-50 hover:opacity-75 rounded-full cursor-pointer fixed top-0 right-0 transition-all duration-200" onClick={remove}>
                                        <BiMinus className="w-full h-full text-white" />
                                    </div>
                                    {ids.map((e, i) => {
                                        return (
                                            <Editor key={e} block={e} index={i} value='let o = 0;'
                                                onEditorDidMount={(a) => {
                                                    block.set(e, { id: e, ...a, name: `code-block-${i}`, value: 'let o = 0;' })
                                                    setBlock(block)
                                                }}
                                                onNameChange={(a) => {
                                                    const b = block.get(e)
                                                    if (b) {
                                                        block.set(e, { ...b, name: a })
                                                        setBlock(block)
                                                    }
                                                }}
                                                onValueChange={(a) => {
                                                    const b = block.get(e)
                                                    if (b) {
                                                        block.set(e, { ...b, value: a })
                                                        setBlock(block)
                                                    }
                                                }}
                                            />
                                        )
                                    })}
                                </div>
                                <div className="lg:ml-16 rounded mt-10 mb-4 w-full p-5 select-none" style={{ background: '#1e1e1e' }}>
                                    <div>
                                        {[...block.values()].map(a => {
                                            return (
                                                <div key={a.id + "1"}>
                                                    <div>{`${a.name}`}</div>
                                                    <div className="w-full relative h-6 my-3 rounded overflow-hidden" style={{ background: '#424d58' }}>
                                                        <div className="absolute w-full text-center">{a.bench?.text}</div>
                                                        <div className="h-full" style={{ background: '#4c9aeb', width: `${10}%` }}></div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <footer className='mt-56 py-10 text-center' style={{ backgroundColor: '#1b1b1c' }}>
                <div>{(() => {
                    const y = new Date().getUTCFullYear().toString()
                    if (y == '2021') {
                        return y
                    } else {
                        return `2021-${y}`
                    }
                })()} boon4681.com</div>
            </footer>
        </>
    )
}