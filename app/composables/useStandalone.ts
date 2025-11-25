export const useStandalone = () => {
  const isStandalone = ref(false)

  onMounted(() => {
    // Detectar se está rodando como PWA instalado
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone
      || document.referrer.includes('android-app://')

    isStandalone.value = standalone
  })

  return {
    isStandalone
  }
}
