import { useEffect, useState } from 'react'
import { registerSW } from 'virtual:pwa-register'

const PWAUpdater = () => {
  const [needRefresh, setNeedRefresh] = useState(false)
  const [offlineReady, setOfflineReady] = useState(false)

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true)
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
      },
    })
  }, [])

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  const updateServiceWorker = () => {
    updateSW()
    close()
  }

  if (!needRefresh && !offlineReady) return null

  return (
    <div style={{
      position: 'fixed',
      top: '16px',
      right: '16px',
      background: '#000',
      color: '#fff',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 9999,
      fontSize: '14px',
      maxWidth: '300px'
    }}>
      <div style={{ marginBottom: '8px' }}>
        {offlineReady && (
          <div>App ready to work offline</div>
        )}
        {needRefresh && (
          <div>A new version is available!</div>
        )}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {needRefresh && (
          <button
            onClick={updateServiceWorker}
            style={{
              background: '#fff',
              color: '#000',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Update
          </button>
        )}
        <button
          onClick={close}
          style={{
            background: 'transparent',
            color: '#fff',
            border: '1px solid #fff',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default PWAUpdater 