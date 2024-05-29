export function setCssVar(colors: Record<string, string> = {}) {
  const root = document.documentElement

  Object.entries(colors).forEach(([key, value]) => {
    const cssVarName = `--${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`
    root.style.setProperty(cssVarName, value)
  })
}
