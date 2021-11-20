import React, { useState } from "react";

function getTextWidth(text: string):number {
    const canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    if(context){
        context.font = getComputedStyle(document.body).font;
        return context?.measureText(text).width;
    }
    return 0
}
export const CLang = (props:{onChange:(a:string)=>void}) => {
    const [lang, setLang] = useState("python")
    const [onSelect, setOnSelect] = useState(true)
    const lang_list = [
        "python",
        "javascript"
    ]
    return (
        <>
            <div className="flex relative select-none">
                {lang_list.map((a, i) => {

                    return (
                        <div key={a + "a"} className={`transition-all duration-200 overflow-hidden relative flex justify-center w-0`} style={{ zIndex: a == lang ? 1 : 0, width: `${a == lang || onSelect ? getTextWidth(a)+36 : 0}px` }}>
                            <div className={`button mr-2 is-select`} style={{ backgroundColor: (a == lang) ? '#5858bf' : '' }} onClick={() => {
                                setLang(a)
                                props.onChange(a)
                                setOnSelect(!onSelect)
                            }}>
                                {a}
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}