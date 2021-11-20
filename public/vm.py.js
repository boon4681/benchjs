importScripts("https://cdn.jsdelivr.net/pyodide/v0.18.1/full/pyodide.js");

self.onmessage = async ({ data }) => {
    let pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.18.1/full/"
    });
    const codes = data.codes.map(a=>{
        return [a[0],a[1].split("\n").join("\n        ")]
    });
    self.postMessage = postMessage
    const py = (await (await fetch('./_.py_')).text())
    for (let i = 0; i < codes.length; i++) {
        const a = codes[i];
        const code = py.replace("{boon4681.index}",a[0]).replace("{boon4681.code}",a[1])
        await pyodide.runPythonAsync(code)
    }
}