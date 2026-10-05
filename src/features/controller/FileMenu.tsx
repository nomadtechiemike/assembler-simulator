import { type FC, useRef } from 'react'

import { store } from '@/app/store'
import { File as FileIcon } from '@/common/components/icons'
import { invariant } from '@/common/utils'
import { selectEditorInput, setEditorInput } from '@/features/editor/editorSlice'
import { examples, template } from '@/features/editor/examples'

import Menu from './Menu'
import MenuButton from './MenuButton'
import MenuItem from './MenuItem'
import MenuItems from './MenuItems'

const NewFileButton: FC = () => (
  <MenuItem
    onClick={() => {
      store.dispatch(
        setEditorInput({
          value: template.content,
          isFromFile: true,
        }),
      )
    }}>
    <MenuButton>
      <span className="w-4" />
      <span>New File</span>
    </MenuButton>
  </MenuItem>
)

interface OpenButtonProps {
  onFileLoad: () => void
}

const OpenButton: FC<OpenButtonProps> = ({ onFileLoad }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation()
    inputRef.current!.click()
  }

  const handleClickInput: React.MouseEventHandler<HTMLInputElement> = (event) => {
    event.stopPropagation()
  }

  const loadFile = (file: File): void => {
    const reader = Object.assign(new FileReader(), {
      onload: () => {
        invariant(typeof reader.result === 'string')
        store.dispatch(
          setEditorInput({
            value: reader.result,
            isFromFile: true,
          }),
        )
      },
    })
    reader.readAsText(file)
  }

  const handleSelectFile: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    loadFile(file)
    event.target.value = ''
    onFileLoad()
  }

  return (
    <MenuItem onClick={handleClick}>
      <MenuButton>
        <span className="w-4" />
        <span>Open...</span>
      </MenuButton>
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        onChange={handleSelectFile}
        onClick={handleClickInput}
      />
    </MenuItem>
  )
}

const OpenExampleMenu: FC = () => (
  <MenuItem.Expandable>
    {(isHovered, menuItemsRef, menuItemElement) => (
      <>
        <MenuButton>
          <span className="w-4" />
          <span>Open Example</span>
        </MenuButton>
        {isHovered && (
          <MenuItems.Expanded innerRef={menuItemsRef} menuItemElement={menuItemElement}>
            {examples.map(({ title, content }, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  store.dispatch(
                    setEditorInput({
                      value: content,
                      isFromFile: true,
                    }),
                  )
                }}>
                <MenuButton>
                  <span className="w-4" />
                  <span>{title}</span>
                </MenuButton>
              </MenuItem>
            ))}
          </MenuItems.Expanded>
        )}
      </>
    )}
  </MenuItem.Expandable>
)

const DEFAULT_FILE_NAME = 'file.asm'

interface SaveFilePickerWindow {
  showSaveFilePicker?: (options: {
    suggestedName: string
    types: { description: string, accept: Record<string, string[]> }[]
  }) => Promise<{
    createWritable: () => Promise<{ write: (data: Blob) => Promise<void>, close: () => Promise<void> }>
  }>
}

const downloadAs = (fileBlob: Blob, fileName: string): void => {
  const fileUrl = URL.createObjectURL(fileBlob)
  const anchorElement = Object.assign(document.createElement('a'), {
    download: fileName,
    href: fileUrl,
  })
  anchorElement.click()
  URL.revokeObjectURL(fileUrl)
}

const SaveButton: FC = () => {
  const handleClick = (): void => {
    const editorInput = store.getState(selectEditorInput)
    const fileBlob = new Blob([editorInput], { type: 'application/octet-stream' })
    const { showSaveFilePicker } = window as unknown as SaveFilePickerWindow

    if (showSaveFilePicker) {
      // Native "Save As" dialog, so the file name can be changed
      showSaveFilePicker
        .call(window, {
          suggestedName: DEFAULT_FILE_NAME,
          types: [{ description: 'Assembly file', accept: { 'text/plain': ['.asm'] } }],
        })
        .then(async (handle) => {
          const writable = await handle.createWritable()
          await writable.write(fileBlob)
          await writable.close()
        })
        .catch((reason: unknown) => {
          if (!(reason instanceof DOMException && reason.name === 'AbortError')) {
            console.error(reason)
          }
        })
      return
    }

    const input = window.prompt('Save as:', DEFAULT_FILE_NAME)
    if (input === null) {
      return
    }
    const trimmed = input.trim() || DEFAULT_FILE_NAME
    downloadAs(fileBlob, trimmed.includes('.') ? trimmed : `${trimmed}.asm`)
  }

  return (
    <MenuItem onClick={handleClick}>
      <MenuButton>
        <span className="w-4" />
        <span>Save As...</span>
      </MenuButton>
    </MenuItem>
  )
}

const CopyLinkButton: FC = () => {
  const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    navigator.clipboard.writeText(window.location.href).catch((reason) => {
      event.stopPropagation()
      console.error(reason)
    })
  }

  return (
    <MenuItem onClick={handleClick}>
      <MenuButton>
        <span className="w-4" />
        <span>Copy Link</span>
      </MenuButton>
    </MenuItem>
  )
}

const FileMenu: FC = () => (
  <Menu label="File">
    {(isOpen, hoverRef, menuElement) => (
      <>
        <MenuButton.Main ref={hoverRef}>
          <FileIcon />
          <span>File</span>
        </MenuButton.Main>
        {isOpen && (
          <MenuItems menuElement={menuElement}>
            <NewFileButton />
            <OpenButton onFileLoad={() => menuElement.click()} />
            <OpenExampleMenu />
            <SaveButton />
            <CopyLinkButton />
          </MenuItems>
        )}
      </>
    )}
  </Menu>
)

export default FileMenu
