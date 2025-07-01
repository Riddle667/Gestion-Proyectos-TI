import { useState } from 'react'

export default function useModalAndFeedback() {
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [onConfirm, setOnConfirm] = useState(() => () => {})
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState('')

  const openModal = (message, confirmAction) => {
    setModalMessage(message)
    setOnConfirm(() => confirmAction)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setModalMessage('')
    setOnConfirm(() => () => {})
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
    showFeedback
  }
}
