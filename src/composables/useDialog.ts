import type { DialogConfig, DialogState } from '@/components/Dialog/VtDialog.types'
import { reactive } from 'vue'

const dialogState = reactive<DialogState>({
  visible: false,
  title: '',
  message: '',
  primaryLabel: 'OK',
  secondaryLabel: 'Cancel',
  showSecondary: true,
  resolve: undefined
})

export function useDialog() {
  const show = (config: DialogConfig): Promise<boolean> => {
    return new Promise((resolve) => {
      Object.assign(dialogState, {
        ...config,
        visible: true,
        resolve
      })
    })
  }

  const alert = (title: string, message: string, primaryLabel: string, secondaryLabel: string): Promise<boolean> => {
    return show({
      title,
      message,
      primaryLabel,
      secondaryLabel
    })
  }

  const handlePrimary = () => {
    dialogState.visible = false
    dialogState.resolve?.(true)
  }

  const handleSecondary = () => {
    dialogState.visible = false
    dialogState.resolve?.(false)
  }

  return {
    dialogState,
    show,
    confirm,
    alert,
    handlePrimary,
    handleSecondary
  }
}
