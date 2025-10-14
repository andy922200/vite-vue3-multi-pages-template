export const fixedDomOverflow = (dom: HTMLElement | null, boolean: boolean) => {
  if (!dom) return
  dom.style.overflow = boolean ? 'hidden' : ''
}

export const goToPage = (href?: string) => {
  if (typeof window !== 'undefined' && href) {
    window.location.href = href
  }
}

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (e) {
    console.error('Failed to copy text to clipboard:', e)
    return false
  }
}
