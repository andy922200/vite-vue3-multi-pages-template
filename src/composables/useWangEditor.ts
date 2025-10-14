import {
  i18nChangeLanguage,
  type IDomEditor,
  type IEditorConfig,
  type IToolbarConfig,
} from '@wangeditor-next/editor'
import { onBeforeUnmount, ref, shallowRef } from 'vue'

export const useWangEditor = ({
  value = '',
  mode = 'default',
  toolbarConf = {},
  editorConf = { placeholder: '請輸入內容...' },
  lang = 'en',
}: {
  value?: string
  mode?: 'default' | 'simple'
  toolbarConf?: Partial<IToolbarConfig>
  editorConf?: Partial<IEditorConfig>
  lang?: string
}) => {
  const editorRef = shallowRef<IDomEditor>()
  const valueHtml = ref(value)
  const toolbarConfig: Partial<IToolbarConfig> = {
    ...toolbarConf,
  }
  const editorConfig: Partial<IEditorConfig> = {
    ...editorConf,
  }

  // 元件銷毀時，也及時銷毀編輯器
  onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
  })

  // 記錄 editor 實例
  const handleCreated = (editor: IDomEditor) => {
    editorRef.value = editor
  }

  // 設置語言
  i18nChangeLanguage(lang)

  return {
    editorRef,
    valueHtml,
    mode,
    toolbarConfig,
    editorConfig,
    handleCreated,
  }
}
