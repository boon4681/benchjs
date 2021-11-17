import React, { useRef, useState } from 'react'

import * as monaco from 'monaco-editor'
import { editor, languages } from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'


import dark_plus from '../assets/themes/dark_plus.json'
import onedark from '../assets/themes/onedark.json'

import { Registry } from 'monaco-textmate'
import { wireTmGrammars } from 'monaco-editor-textmate';

import { v4 as uuidv4 } from 'uuid';

import { BiTrash } from 'react-icons/bi'
import { MdDragIndicator, MdPlayArrow, MdStop } from 'react-icons/md'

import { ToastContainer, toast } from 'react-toastify';

import { DragDropContext, DraggableProvided, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import { hsv2rgb } from '../.libs/color'
///////////////////

const registry = new Registry({
    getGrammarDefinition: async (scopeName) => {
        switch (scopeName) {
            case 'source.js':
                return {
                    format: 'json',
                    content: await (await fetch(`/tmGrammar/JavaScript.tmLanguage.json`)).text()
                }
            case 'source.ts':
                return {
                    format: 'json',
                    content: await (await fetch(`/tmGrammar/TypeScript.tmLanguage.json`)).text()
                }
        }
        return {
            format: 'json',
            content: ''
        }
    }
})

// define themes //
editor.defineTheme('vsc-dark-plus', { ...dark_plus, base: "vs-dark" });
editor.defineTheme('onedark', { ...onedark, base: "vs-dark" });
///////////////////

// assign languege worker //
// @ts-ignore
window.MonacoEnvironment = {
    getWorker(_: string, label: string) {
        if (label === 'typescript' || label === 'javascript') return new TsWorker()
        return new EditorWorker()
    }
}
///////////////////////////
type iblock = { id: string, name: string, value: string, task?: Worker, result?: any }
type pEditor = {
    block: iblock,
    remove: (id: string, block: Editor) => void,
    changeName: (name: string) => void,
    changeValue: (value: string) => void,
    dragHandleProps: DraggableProvided["dragHandleProps"]
}
type sEditor = {
    isOnEditName: boolean
}
export class Editor extends React.Component<pEditor, sEditor>{
    private ele?: HTMLDivElement
    private inputName?: HTMLInputElement
    private block?: HTMLDivElement
    constructor(props: pEditor) {
        super(props)
        this.state = {
            isOnEditName: false
        }
    }
    private assign = (e: HTMLDivElement) => {
        this.ele = e
    }
    private assignName = (e: HTMLInputElement) => {
        this.inputName = e
    }
    private assignblock = (e: HTMLDivElement) => {
        this.block = e
    }
    readonly get_block = () => {
        return this.block
    }
    componentDidMount() {
        if (this.ele && this.block) {
            const monaco = editor.create(this.ele as HTMLElement, { theme: 'onedark', automaticLayout: true, language: "javascript", value: this.props.block.value })
            monaco.onDidChangeModelContent(a => {
                this.props.changeValue(monaco.getValue())
            })
            this.liftOff(monaco)
            this.block.classList.add("h-80")
            this.block.classList.remove("opacity-0")
        }
    }
    liftOff = async (editor: any) => {
        const grammars = new Map();
        grammars.set('typescript', 'source.ts');
        grammars.set('javascript', 'source.js');

        languages.register({ id: 'typescript' });
        languages.register({ id: 'javascript' });

        await wireTmGrammars(monaco, registry, grammars, editor);
    };
    remove = () => {
        this.props.remove(this.props.block.id, this)
    }
    submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }
    render() {
        return (
            <div ref={this.assignblock} className='overflow-hidden relative h-0 w-full opacity-0 transition-all duration-1000 rounded my-4 shadow-2xl'>
                <div className="mx-auto w-full max-w-min">
                    <div {...this.props.dragHandleProps} className="absolute flex items-end justify-center rounded-md -top-4 h-8 w-10 bg-gray-700 transition-none">
                        <MdDragIndicator />
                    </div>
                </div>
                <div className="py-2 px-4 text-md text-gray-300 flex justify-between items-center" style={{ backgroundColor: '#21252b', boxShadow: "0px 6px 20px rgb(0 0 0 / 35%)" }}>
                    <form onSubmit={this.submit}>
                        <label>
                            <input ref={this.assignName} type="text" aria-label="name" defaultValue={this.props.block.name} className="outline-none bg-transparent w-full"
                                onChange={() => {
                                    this.props.changeName(this.inputName?.value || "")
                                }}
                            />
                        </label>
                    </form>
                    <div className="flex">
                        <BiTrash className="w-7 h-7 p-1 rounded cursor-pointer transition hover:bg-gray-700" onClick={this.remove} />
                    </div>
                </div>
                <div ref={this.assign} className='h-80 w-full lg:max-w-lg'></div>
            </div>
        )
    }
}

export const Blocks = () => {
    const [blocks, setBlocks] = useState<iblock[]>([
        { id: uuidv4(), name: "Test", value: "for(let i=0;i<100000000;i++){}" },
        { id: uuidv4(), name: "Test", value: "" }
    ])
    const [isRunninTask, setIsRunningTask] = useState(false)
    const [isOnRemove, setIsOnRemove] = useState(false)
    const remove = (id: string, block: Editor) => {
        if (isOnRemove) return;
        if (blocks.length > 2) {
            setIsOnRemove(true)
            block.get_block()?.classList.remove("h-80")
            block.get_block()?.classList.add("opacity-0")
            setTimeout(() => {
                setBlocks(blocks.filter(x => x.id != id))
                setIsOnRemove(false)
            }, 700)
        } else {
            setIsOnRemove(true)
            setTimeout(() => {
                setIsOnRemove(false)
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
    const onDragEnd = (a: DropResult) => {
        const { destination, source, draggableId } = a;
        if (!destination) {
            return;
        }
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }
        const newBlocks = Array.from(blocks);
        const [removed] = newBlocks.splice(source.index, 1);
        newBlocks.splice(destination.index, 0, removed);
        setBlocks(newBlocks)
    }
    const addingBlock = () => {
        if(isRunninTask) return;
        const block = { id: uuidv4(), name: "Test", value: "" }
        setBlocks([block, ...blocks])
    }
    const changeName = (index: number, name: string) => {
        const update = Array.from(blocks);
        update[index].name = name
        setBlocks(update)
    }
    const changeValue = (index: number, value: string) => {
        const update = Array.from(blocks);
        update[index].value = value
        setBlocks(update)
    }
    const renderBlock = () => {
        return blocks?.map((block, i) => {
            return (
                <Draggable key={block.id} draggableId={block.id} index={i}>
                    {provided => (
                        <div
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            className="relative"
                        >
                            <Editor
                                changeName={(a) => {
                                    changeName(i, a)
                                }}
                                changeValue={(a) => {
                                    changeValue(i, a)
                                }}
                                dragHandleProps={provided.dragHandleProps}
                                block={block}
                                key={block.id}
                                remove={remove}
                            />
                        </div>
                    )}
                </Draggable>
            )
        })
    }
    const bars = () => {
        const max = Math.max(...blocks.map(a => (a.result) ? a.result.hz : 0)) || 0
        return blocks.map((a, i) => {
            const color = hsv2rgb((100 / max) * ((a.result) ? a.result.hz : 0), 0.50, 0.80)
            return (
                <div key={a.id + "aa"} className={`px-3 py-1.5 overflow-hidden relative rounded-lg flex justify-between ${i == 0 ? 'mb-3' : i == blocks.length - 1 ? "" : "mb-3"}`} style={{ backgroundColor: '#374151' }}>
                    <div>{a.name}</div>
                    <div className="whitespace-pre">{(a.result) ? (a.result.hz).toFixed(2) : (0).toFixed(2)} ops/sec  ±{(a.result) ? (a.result.rme).toFixed(2):(0)}</div>
                    <div className="absolute bottom-0 left-0 h-1 w-full"
                        style={{
                            backgroundColor: '#5a5a5a'
                        }}>
                        <div className="h-1 transition-all duration-200 w-full ease-in-out"
                            style={{
                                backgroundColor: `rgb(${color[0]},${color[1]},${color[2]})`,
                                width: `${((a.result) ? (a.result.sample.length) : (0)) * 100 / 30}%`
                            }}>
                        </div>
                    </div>
                </div>
            )
        })
    }
    const sleep = (t: number) => {
        return new Promise(resolve => setTimeout(resolve, t))
    }
    const runTask = async () => {
        if (!isRunninTask) {
            setIsRunningTask(true)
            const url = (await fetch("./_.js")).url
            const task = blocks.map((block, index) => {
                return new Promise(async (resolve, reject) => {
                    const worker = new Worker(url, { "type": "module" })
                    const update = Array.from(blocks);
                    update[index].result = null
                    update[index].task = worker
                    setBlocks(update)
                    worker.onmessage = (event) => {
                        if (event.data.error) {
                            toast.error(`🔥 ${block.name} error`, {
                                position: "top-right",
                                theme: 'dark',
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
                            worker.terminate()
                            resolve(false)
                            return
                        };
                        const update = Array.from(blocks);
                        update[index].result = event.data
                        setBlocks(update)
                        if (event.data.status == "done") {
                            resolve(true)
                            worker.terminate()
                        }
                    }
                    await sleep(400)
                    worker.postMessage(block.value)
                })
            })
            await Promise.all(task)
            await sleep(700)
            setIsRunningTask(false)
            toast.success(`🌈 benchmarking done`, {
                position: "top-right",
                theme: 'dark',
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }else{
            blocks.forEach(a=>{
                a.task?.terminate()
            })
            toast.warn(`stoped benchmarking`, {
                position: "top-right",
                theme: 'dark',
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setIsRunningTask(false)
        }
    }
    return (
        <div className="">
            <div className="flex items-center">
                <button className={`button ${(isRunninTask) ? "is-red" : "is-dark"}`} onClick={runTask}>{(!isRunninTask) ? <MdPlayArrow className="w-6 h-6" /> : <MdStop className="w-6 h-6" />}</button>
                <button className={`button no-bg is-border-dark mx-2 ${(isRunninTask) ? "disable" : ""}`} onClick={addingBlock}>Add Test Case</button>
            </div>
            <div className="lg:flex w-full">
                <div className="min-h-40 w-full relative mb-20 lg:mb-0 lg:max-w-lg transition-all">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId={"1"}>
                            {provided => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    {renderBlock()}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
                <div className="lg:ml-16 rounded mt-4 mb-4 w-full p-5 select-none" style={{ background: '#282c34' }}>
                    <div>
                        {bars()}
                    </div>
                </div>
            </div>
        </div>
    )
}