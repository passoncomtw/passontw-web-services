import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { CircularProgress, Box } from '@mui/material'
import { store, persistor } from './configureStore'

interface ReduxProviderProps {
  children: React.ReactNode
}

// Loading 組件 - 在 Redux Persist 載入期間顯示
const PersistLoading: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
    }}
  >
    <CircularProgress size={40} />
  </Box>
)

// Redux Provider 組件 - 遵循單一職責原則，提供 Redux store 和持久化支援
const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<PersistLoading />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}

export default ReduxProvider
