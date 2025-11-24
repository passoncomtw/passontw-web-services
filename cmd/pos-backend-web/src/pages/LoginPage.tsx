// 登入頁面 - 遵循 SRP 原則，只負責登入介面和邏輯

import React, { useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  CircularProgress,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuthRedux } from '../hooks/useAuthRedux'
import { useForm } from '../hooks/useForm'
import type { LoginCredentials } from '../types'

/**
 * 登入表單驗證
 */
const validateLoginForm = (values: LoginCredentials) => {
  const errors: Partial<Record<keyof LoginCredentials, string>> = {}

  if (!values.username) {
    errors.username = '請輸入帳號'
  }

  if (!values.password) {
    errors.password = '請輸入密碼'
  } else if (values.password.length < 6) {
    errors.password = '密碼至少需要 6 個字元'
  }

  return errors
}

/**
 * 登入頁面組件
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading, error, login } = useAuthRedux()

  // 表單處理
  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useForm<LoginCredentials>({
    initialValues: {
      username: '',
      password: '',
    },
    validate: validateLoginForm,
    onSubmit: async (values) => {
      login(values)
    },
  })

  // 如果已登入，重定向到商家管理頁面
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/merchants')
    }
  }, [isAuthenticated, navigate])

  // 全螢幕 Loading 效果
  if (loading || isSubmitting) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography 
          variant="h6" 
          sx={{ 
            mt: 2, 
            color: 'text.secondary',
            fontWeight: 500,
          }}
        >
          登入中...
        </Typography>
      </Box>
    )
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Card
          elevation={8}
          sx={{
            padding: 4,
            borderRadius: 3,
            width: '100%',
            maxWidth: 400,
          }}
        >
          <CardContent>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography component="h1" variant="h4" gutterBottom>
                營運管理後台
              </Typography>
              <Typography variant="body2" color="text.secondary">
                請登入您的管理員帳號
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="管理員帳號"
                name="username"
                autoComplete="username"
                autoFocus
                value={values.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                disabled={loading || isSubmitting}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="密碼"
                type="password"
                id="password"
                autoComplete="current-password"
                value={values.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                disabled={loading || isSubmitting}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading || isSubmitting}
              >
                {loading || isSubmitting ? '登入中...' : '登入'}
              </Button>
            </Box>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                測試帳號：
              </Typography>
              <Typography variant="body2" component="div">
                • 超級管理員：admin / admin123
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

export default LoginPage
