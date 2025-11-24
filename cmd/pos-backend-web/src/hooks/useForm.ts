// 表單處理 Hook - 遵循 SRP 原則，專門處理表單狀態

import { useState, useCallback, ChangeEvent } from 'react'

interface UseFormOptions<T> {
  initialValues: T
  validate?: (values: T) => Partial<Record<keyof T, string>>
  onSubmit?: (values: T) => void | Promise<void>
}

/**
 * 表單處理 Hook
 * 提供表單狀態管理、驗證、提交等功能
 */
export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 處理輸入變更
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target
      setValues((prev) => ({ ...prev, [name]: value }))
      
      // 清除該欄位的錯誤
      if (errors[name as keyof T]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }))
      }
    },
    [errors]
  )

  // 設置特定欄位值
  const setValue = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  // 驗證表單
  const validateForm = useCallback(() => {
    if (!validate) return true
    
    const validationErrors = validate(values)
    setErrors(validationErrors)
    
    return Object.keys(validationErrors).length === 0
  }, [validate, values])

  // 處理表單提交
  const handleSubmit = useCallback(
    async (event?: React.FormEvent) => {
      if (event) {
        event.preventDefault()
      }

      if (!validateForm()) {
        return
      }

      if (onSubmit) {
        setIsSubmitting(true)
        try {
          await onSubmit(values)
        } catch (error) {
          console.error('Form submission error:', error)
        } finally {
          setIsSubmitting(false)
        }
      }
    },
    [validateForm, onSubmit, values]
  )

  // 重置表單
  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setIsSubmitting(false)
  }, [initialValues])

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    setValue,
    handleSubmit,
    reset,
    validateForm,
  }
}
