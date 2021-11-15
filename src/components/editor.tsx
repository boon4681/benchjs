import React, { useRef, useState } from 'react'

import { editor, languages } from 'monaco-editor'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

import dark_plus from '../assets/themes/dark_plus.json'
import onedark from '../assets/themes/onedark.json'

import { Registry } from 'monaco-textmate'
import { wireTmGrammars } from 'monaco-editor-textmate';

import { v4 as uuidv4 } from 'uuid';

import { BiTrash } from 'react-icons/bi'

import { ToastContainer, toast } from 'react-toastify';
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
type iblock = { id: string }
type pEditor = {
    block: iblock,
    remove: (id: string, block: Editor) => void
}
type sEditor = {
    name: string,
    isOnEditName: boolean
}
export class Editor extends React.Component<pEditor, sEditor>{
    private ele?: HTMLDivElement
    private block?: HTMLDivElement
    constructor(props: pEditor) {
        super(props)
        this.state = {
            name: "Test",
            isOnEditName: false
        }
    }
    private assign = (e: HTMLDivElement) => {
        this.ele = e
    }
    private assignblock = (e: HTMLDivElement) => {
        this.block = e
    }
    readonly get_block = () => {
        return this.block
    }
    componentDidMount() {
        if (this.ele && this.block) {
            const monaco = editor.create(this.ele as HTMLElement, { theme: 'onedark', automaticLayout: true, language: "javascript" })
            this.liftOff(monaco)
            this.block.classList.add("h-80")
            this.block.classList.remove("opacity-0")
        }
    }
    liftOff = async (editor: any) => {
        const grammars = new Map();
        grammars.set('typescript', 'source.ts');
        grammars.set('javascript', 'source.js');

        monaco.languages.register({ id: 'typescript' });
        monaco.languages.register({ id: 'javascript' });

        await wireTmGrammars(monaco, registry, grammars, editor);
    };
    remove = () => {
        this.props.remove(this.props.block.id, this)
    }
    render() {
        return (
            <div ref={this.assignblock} className='overflow-hidden h-0 w-full opacity-0 transition-all duration-1000 rounded my-4 shadow-2xl'>
                <div className="py-2 px-4 text-md text-gray-300 flex justify-between items-center" style={{ backgroundColor: '#21252b', boxShadow: "0px 6px 20px rgb(0 0 0 / 35%)" }}>
                    <form>
                        <input type="text" defaultValue={this.state.name} className="outline-none bg-transparent w-full" />
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
        { id: uuidv4() },
        { id: uuidv4() }
    ])
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
    const renderBlock = () => {
        return (
            blocks?.map(block => {
                return (
                    <Editor block={block} key={block.id} remove={remove} />
                )
            })
        )
    }
    return (
        <div>
            <div className="flex items-center">
                <button className="button is-dark" onClick={() => { }}>▶</button>
                <button className="button no-bg is-border-dark mx-2" onClick={() => {
                    const block = { id: uuidv4() }
                    setBlocks([block, ...blocks])
                }}>Add Test Case</button>
            </div>
            <div className="lg:flex w-full">
                <div className="min-h-40 w-full relative mb-20 lg:mb-0 lg:max-w-lg transition-all">
                    {
                        renderBlock()
                    }
                </div>
                <div className="lg:ml-16 rounded mt-4 mb-4 w-full p-5 select-none" style={{ background: '#282c34' }}>
                    <div>
                    </div>
                </div>
            </div>
        </div>
    )
}