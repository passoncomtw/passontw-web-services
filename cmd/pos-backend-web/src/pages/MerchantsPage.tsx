// 商家管理頁面 - 遵循 SRP 原則，負責商家列表管理和狀態監控

import React, { useState, useMemo, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  Search as SearchIcon,
  Circle as CircleIcon,
} from '@mui/icons-material'
import AppLayout from '../layouts/AppLayout'
import { formatDate } from '../utils/mockData'
import { fetchMerchants } from '@/apis/merchants'
import type { Merchant } from '@/types'

// 自定義 useForm hook - 遵循 SRP 原則，專責表單狀態管理
const useForm = (options: { initialValues: { search: string } }) => {
  const [values, setValues] = useState<{ search: string }>(options.initialValues)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setValues(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return { values, handleChange }
}

/**
 * 商家狀態組件
 */
const StatusChip: React.FC<{ status: string }> = ({ status }) => {
  const isOnline = status === 'online'
  
  return (
    <Chip
      icon={<CircleIcon />}
      label={isOnline ? '在線' : '離線'}
      color={isOnline ? 'success' : 'error'}
      size="small"
      sx={{
        '& .MuiChip-icon': {
          fontSize: '12px',
        },
      }}
    />
  )
}

/**
 * 商家管理頁面組件
 */
const MerchantsPage: React.FC = () => {
  const [page, setPage] = useState(0) // TablePagination 是 0-based
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 搜尋表單
  const { values: filters, handleChange } = useForm({
    initialValues: {
      search: '',
    },
  })

  // 取得商家列表
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await fetchMerchants({
          page: page + 1, // API 是 1-based
          limit: rowsPerPage,
          search: filters.search,
        })
        setMerchants(result.merchants)
        setTotal(result.total)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : '取得商家列表失敗，請稍後再試'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [page, rowsPerPage, filters.search])

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <AppLayout title="商家管理">
      <Box>
        {/* 頁面標題 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            商家管理
          </Typography>
          <Typography variant="body1" color="text.secondary">
            監控和管理所有註冊商家的連線狀態
          </Typography>
        </Box>

        {/* 搜尋控制項 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TextField
              fullWidth
              name="search"
              label="搜尋商家名稱"
              value={filters.search}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 400 }}
            />
          </CardContent>
        </Card>

        {/* 結果統計 / 錯誤 / 載入 */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            共 {total} 個商家
          </Typography>
          {loading && <CircularProgress size={18} />}
        </Box>

        {error && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {/* 商家列表表格 */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>商家名稱</TableCell>
                  <TableCell>連線狀態</TableCell>
                  <TableCell>最後更新時間</TableCell>
                  <TableCell>註冊時間</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {merchants.map((merchant) => (
                  <TableRow hover key={merchant.id}>
                    <TableCell>
                      <Typography variant="body1" fontWeight={500}>
                        {merchant.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={merchant.status} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(merchant.updatedAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(merchant.createdAt)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && merchants.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="text.secondary">
                        無資料
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="每頁顯示："
            labelDisplayedRows={() => `第 ${page + 1} / ${Math.ceil(total / rowsPerPage)} 頁`}
          />
        </Paper>
      </Box>
    </AppLayout>
  )
}

export default MerchantsPage
