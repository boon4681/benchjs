import 'monaco-editor/esm/vs/basic-languages/css/css.contribution'
import 'monaco-editor/esm/vs/basic-languages/xml/xml.contribution'
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'

import MonacoEditor from 'react-monaco-editor';
import * as monaco from 'monaco-editor'
import { v4 as uuidv4 } from 'uuid';
import React, { useRef, useState } from 'react'
import dark_plus from '../assets/themes/dark_plus.json'
import { Registry } from 'monaco-textmate'
import { wireTmGrammars } from 'monaco-editor-textmate';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

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

monaco.editor.defineTheme('vsc-dark-plus', { ...dark_plus, base: "vs-dark" });

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.MonacoEnvironment = {
    getWorker(_: string, label: string) {
        if (label === 'typescript' || label === 'javascript') return new TsWorker()
        if (label === 'json') return new JsonWorker()
        if (label === 'css') return new CssWorker()
        if (label === 'html') return new HtmlWorker()
        return new EditorWorker()
    }
}

export class Editor extends React.Component<{
    block: string,
    index: number,
    value?: string
    onEditorDidMount: (a: { monaco: monaco.editor.IStandaloneCodeEditor,editor:HTMLElement,block:HTMLElement }) => void,
    onNameChange: (name: string) => void,
    onValueChange: (value: string) => void
}> {
    private ele?: HTMLDivElement;
    private ele2?: HTMLDivElement;
    private input?: HTMLInputElement
    private id: string = this.props.block
    editor?: monaco.editor.IStandaloneCodeEditor;
    assign = (component: HTMLDivElement) => {
        this.ele = component;
    };
    assign2 = (component: HTMLDivElement) => {
        this.ele2 = component;
    };
    assignInput = (component: HTMLInputElement) => {
        this.input = component;
    }
    liftOff = async (monaco: any) => {
        const grammars = new Map();
        grammars.set('typescript', 'source.ts');
        grammars.set('javascript', 'source.js');

        monaco.languages.register({ id: 'typescript' });
        monaco.languages.register({ id: 'javascript' });

        await wireTmGrammars(monaco, registry, grammars, this.editor);
    };
    componentDidMount = () =>{
        if(this.ele && this.editor && this.ele2)
        this.props.onEditorDidMount({monaco:this.editor,editor:this.ele,block:this.ele2})
        this.ele2?.classList.add('h-80')
        this.ele?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    onEditorDidMount = (editor: any, monaco: any) => {
        this.editor = editor
        this.liftOff(monaco)
    };
    render() {
        return (
            <div data-block={`${this.id}`} className="w-full my-4">
                <input ref={this.assignInput} onChange={(e) => {
                    this.props.onNameChange(e.target.value)
                }} defaultValue={`code-block-${this.props.index}`} type="text" className="outline-none border-b border-dashed bg-transparent border-gray-400" />
                <div className="flex w-full">
                    <div className="flex flex-col w-7" style={{ backgroundColor: '#252526' }}>
                        <div className="p-1 py-1.5 hover:bg-gray-600 hover:opacity-60 hover:text-white transition duration-100">
                            <IoIosArrowUp className='ml-0.5 transform rotate-180 transition-transform duration-150' />
                        </div>
                    </div>
                    <div ref={this.assign2} className='overflow-hidden h-0 w-full transition-all duration-1000'>
                        <div ref={this.assign} className='h-80 w-full lg:max-w-lg'>
                            <MonacoEditor value={this.props.value} onChange={this.props.onValueChange} editorDidMount={this.onEditorDidMount} theme={'vsc-dark-plus'} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}