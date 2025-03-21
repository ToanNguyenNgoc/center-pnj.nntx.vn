/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react"
import { EnvConfig } from "../configs"

export function useRecaptcha() {

  const [refreshReCaptcha, setRefreshReCaptcha] = useState(false)
  const [recaptcha, setRecaptcha] = useState('')
  const verifyRecaptchaCallback = useCallback((token: string) => {
    setRecaptcha(token)
  }, [refreshReCaptcha])

  const onRefreshRecaptcha = () => setRefreshReCaptcha(r => !r)

  useEffect(() => {
    onRefreshRecaptcha()
    return () => {
      onRefreshRecaptcha()
    }
  }, [])

  return {
    recaptcha_key:EnvConfig.key.RECAPTCHA_SITE_KEY,
    refreshReCaptcha,
    onRefreshRecaptcha,
    verifyRecaptchaCallback,
    recaptcha
  }
}