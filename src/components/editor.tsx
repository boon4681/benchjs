import React, { useEffect, useRef, useState } from 'react'

import * as monaco from "monaco-editor";
import dark_plus from '../assets/themes/dark_plus.json'
import onedark from '../assets/themes/onedark.json'

import { Registry } from 'monaco-textmate'
import { wireTmGrammars } from 'monaco-editor-textmate';

import { BiTrash } from 'react-icons/bi'
import { MdDragIndicator } from 'react-icons/md'

import { DraggableProvided } from 'react-beautiful-dnd';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
///////////////////

// assign languege worker //
// @ts-ignore
window.MonacoEnvironment = {
    getWorker(_: string, label: string) {
        if (label === 'typescript' || label === 'javascript') return new TsWorker()
        else return new EditorWorker()
    }
}

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
            case 'source.py':
                return {
                    format: 'json',
                    content: await (await fetch(`/tmGrammar/Python.tmLanguage.json`)).text()
                }
        }
        return {
            format: 'json',
            content: ''
        }
    }
})

// define themes //
monaco.editor.defineTheme('vsc-dark-plus', { ...dark_plus, base: "vs-dark" });
monaco.editor.defineTheme('onedark', { ...onedark, base: "vs-dark" });
///////////////////

///////////////////////////
export type iblock = { id: string, name: string, value: string, task?: Worker, result?: any }
export type pEditor = {
    block: iblock,
    lang: string,
    remove: (id: string, block: Editor) => void,
    changeName: (name: string) => void,
    changeValue: (value: string) => void,
    dragHandleProps: DraggableProvided["dragHandleProps"] | any
}
export type sEditor = {
    isOnEditName: boolean
}
export class Editor extends React.Component<pEditor, sEditor>{
    private ele?: HTMLDivElement
    private inputName?: HTMLInputElement
    private block?: HTMLDivElement
    private editor?: monaco.editor.IStandaloneCodeEditor
    constructor(props: pEditor) {
        if (props.dragHandleProps) {
            delete props.dragHandleProps['role']
            delete props.dragHandleProps['aria-describedby']
        }
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
            const editor = monaco.editor.create(this.ele as HTMLElement, { theme: 'onedark', automaticLayout: true, language: this.props.lang || "javascript", value: this.props.block.value })
            this.liftOff(editor)
            this.editor = editor
            editor.updateOptions({ theme: 'onedark' })
            editor.onDidChangeModelContent(a => {
                this.props.changeValue(editor.getValue())
            })
            this.block.classList.add("h-80")
            this.block.classList.remove("opacity-0")
        }
    }
    componentDidUpdate() {
        if (this.editor) {
            const model = this.editor.getModel()
            if (model)
                monaco.editor.setModelLanguage(model, this.props.lang)
        }
    }
    liftOff = async (editor: any) => {
        const grammars = new Map();
        grammars.set('typescript', 'source.ts');
        grammars.set('javascript', 'source.js');
        grammars.set('python', 'source.py');

        monaco.languages.register({ id: 'typescript' });
        monaco.languages.register({ id: 'javascript' });
        monaco.languages.register({ id: 'python' });

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
                    <div {...this.props.dragHandleProps} className="absolute flex items-end justify-center rounded-b-md top-0 h-4 w-10 bg-gray-700 transition-none">
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