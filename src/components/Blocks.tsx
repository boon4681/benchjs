import React, { useEffect, useRef, useState, Suspense } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { MdPlayArrow, MdStop } from 'react-icons/md'

import { toast } from 'react-toastify';

import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import { hsv2rgb } from '../.libs/color'
import { CLang } from './CLang'
import {Editor, iblock } from './editor';
///////////////////

export const Blocks = () => {
    const [blocks, setBlocks] = useState<iblock[]>([
        { id: uuidv4(), name: "Test", value: "" },
        { id: uuidv4(), name: "Test", value: "" }
    ])
    const [lang, setLang] = useState("javascript")
    const [winWidth, setWinWidth] = useState(window.innerWidth)
    const [isRunninTask, setIsRunningTask] = useState(false)
    const [isOnRemove, setIsOnRemove] = useState(false)
    const remove = (id: string, block: any) => {
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
        if (isRunninTask) return;
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
                                lang={lang}
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
                    <div className="whitespace-pre">{(a.result) ? (a.result.hz).toFixed(2) : (0).toFixed(2)} ops/sec{winWidth > 500 ? ("  ±" + ((a.result) ? (a.result.rme).toFixed(2) : (0))) : ""}</div>
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
            //////////  javascript  ////////
            if (lang == "javascript") {
                const url = (await fetch("./_.js")).url
                const task = blocks.map((block, index) => {
                    return new Promise(async (resolve, reject) => {
                        const worker = new Worker(url)
                        const update = Array.from(blocks);
                        update[index].result = null
                        update[index].task = worker
                        setBlocks(update)
                        worker.onmessage = (event) => {
                            let data = event.data
                            if (typeof event.data == "string") {
                                data = JSON.parse(event.data)
                            }
                            if (data.error) {
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
                            update[index].result = data
                            setBlocks(update)
                            if (data.status == "done") {
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
                return
            }
            //////////  python  ////////
            if (lang == "python") {
                const url = (await fetch("./vm.py.js")).url
                const worker = new Worker(url)
                const update = Array.from(blocks);
                update[0].result = null
                update[0].task = worker
                setBlocks(update)
                const codes = blocks.map((block, index) => {
                    const update = Array.from(blocks);
                    update[index].result = null
                    setBlocks(update)
                    return [index, block.value]
                })
                worker.onmessage = async (event) => {
                    let data = event.data
                    if (typeof event.data == "string") {
                        data = JSON.parse(event.data)
                    }
                    const block = blocks[data.index]
                    if (data.error) {
                        toast.error(`🔥 ${block.name} error`, {
                            position: "top-right",
                            theme: 'dark',
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        return
                    };
                    const update = Array.from(blocks);
                    update[data.index].result = data
                    setBlocks(update)
                    if (data.status == "done" && data.index == blocks.length - 1) {
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
                        worker.terminate()
                    }
                }
                worker.postMessage({ codes })
            }
        } else {
            blocks.forEach(a => {
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
    window.onresize = () => {
        setWinWidth(window.innerWidth)
    }
    return (
        <div className="">
            <div className="flex items-center w-full overflow-x-scroll no-bar">
                <CLang onChange={setLang} />
                <button aria-label="button" className={`button ${(isRunninTask) ? "is-red" : "is-dark"}`} onClick={runTask}>{(!isRunninTask) ? <MdPlayArrow className="w-6 h-6" /> : <MdStop className="w-6 h-6" />}</button>
                <button className={`button no-bg is-border-dark mx-2 ${(isRunninTask) ? "disable" : ""}`} onClick={addingBlock}>Add Test Case</button>
            </div>
            <div className="lg:flex w-full">
                <div className="min-h-40 w-full relative mb-16 lg:mb-0 lg:max-w-lg transition-all">
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