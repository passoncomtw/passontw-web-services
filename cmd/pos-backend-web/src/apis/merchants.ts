import server from './index'
import type { MerchantListResponse, MerchantDTO } from '@/types/api'
import type { Merchant } from '@/types'

// 轉換後端 DTO 為前端使用的型別
const mapMerchant = (dto: MerchantDTO): Merchant => ({
  id: dto.merchant_id,
  name: dto.merchant_name,
  status: dto.status,
  category: '', // 後端未提供，保留欄位以維持型別一致
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
})

export interface FetchMerchantsParams {
  page?: number
  limit?: number
  search?: string
}

export interface FetchMerchantsResult {
  merchants: Merchant[]
  total: number
  page: number
  pageSize: number
}

/**
 * 取得商家列表（含搜尋與分頁）
 */
export const fetchMerchants = async (
  params: FetchMerchantsParams
): Promise<FetchMerchantsResult> => {
  const { page = 1, limit = 10, search = '' } = params

  const response = await server.get<MerchantListResponse>('/api/admin/merchants', {
    // 同時傳遞 limit 與 per_page，避免後端參數名稱不一致
    params: { page, limit, per_page: limit, search },
  })

  const data = response.data
  const merchants = data.data.merchants.map(mapMerchant)
  const pagination = data.data.pagination

  return {
    merchants,
    total: pagination.total_count,
    page: pagination.current_page,
    pageSize: pagination.per_page,
  }
}

