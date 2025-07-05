import { useState } from 'react'

export default function useModalAndFeedback() {
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [onConfirm, setOnConfirm] = useState(() => () => {})
  const [onCancel, setOnCancel] = useState(() => () => {})
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState('')

  const openModal = (message, confirmAction, cancelAction = () => {}) => {
    setModalMessage(message)
    setOnConfirm(() => confirmAction)
    setOnCancel(() => cancelAction)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setModalMessage('')
    setOnConfirm(() => () => {})
    setOnCancel(() => () => {})
  }

  const confirm = async () => {
    try {
      await onConfirm()
    } catch (err) {
      showFeedback('❌ Error durante la operación.', 'error')
      console.error(err)
    } finally {
      closeModal()
    }
  }

  const cancel = async () => {
    try {
      await onCancel()
    } catch (err) {
      console.error(err)
    } finally {
      closeModal()
    }
  }

  const confirmModal = (message) => {
    return new Promise((resolve) => {
      openModal(
        message,
        () => resolve(true),
        () => resolve(false)
      )
    })
  }

  const showFeedback = (message, type = 'success') => {
    setFeedbackMessage(message)
    setFeedbackType(type)
    setTimeout(() => {
      setFeedbackMessage('')
      setFeedbackType('')
    }, 3000)
  }

  return {
    modalVisible,
    modalMessage,
    feedbackMessage,
    feedbackType,
    openModal,
    closeModal,
    confirm,
    cancel,
    confirmModal,
    showFeedback
  }
}
