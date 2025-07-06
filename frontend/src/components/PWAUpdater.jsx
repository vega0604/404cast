import { useEffect, useState } from 'react'
import { registerSW } from 'virtual:pwa-register'
import { toast } from 'sonner'

const PWAUpdater = () => {
  const [needRefresh, setNeedRefresh] = useState(false)
  const [offlineReady, setOfflineReady] = useState(false)

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true)
        toast('A new version is available!', {
          description: 'Click to update the app',
          action: {
            label: 'Update',
            onClick: () => {
              updateSW()
              setNeedRefresh(false)
            }
          },
          duration: Infinity,
          position: 'bottom-right',
          style: {
            background: '#000',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            minWidth: '280px',
            maxWidth: '320px'
          }
        })
      },
      onOfflineReady() {
        setOfflineReady(true)
      },
      onRegistered(swRegistration) {
        // You can send swRegistration anywhere you want, for example:
        // setSwRegistration(swRegistration)
      },
      onRegisterError(error) {
        console.log('SW registration error', error)
        toast.error('Service Worker registration failed', {
          description: 'Please refresh the page to try again',
          position: 'bottom-right',
          style: {
            background: '#000',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            minWidth: '280px',
            maxWidth: '320px'
          }
        })
      },
    })
  }, [])

  return null
}

export default PWAUpdater 