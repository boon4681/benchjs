import { Plugin } from 'vite'

export default function mdloader(): Plugin {
    return {
        name: "mdloader",
        transform(code, id) {
            if (/\.md$/.test(id)) {
                const p = {code}
                return `export default ${JSON.stringify(p)}`
            }
        },
    }
}