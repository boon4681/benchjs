export const set = (name: string, value: string) => {
    localStorage.setItem(name, value)
}

export const get = (name: string) => {
    return localStorage.getItem(name)
}

export const remove = (name: string) => {
    localStorage.removeItem(name)
}