import type { AxiosResponse } from 'axios'
import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import type { Ref } from 'vue'

const axiosMocks = vi.hoisted(() => ({
  defaultGet: vi.fn(),
  defaultPost: vi.fn(),
  instanceGet: vi.fn(),
  instancePost: vi.fn(),
}))

vi.mock('axios', () => ({
  default: {
    get: axiosMocks.defaultGet,
    post: axiosMocks.defaultPost,
  },
}))

vi.mock('@/plugins/axios', () => ({
  axiosInstance: {
    get: axiosMocks.instanceGet,
    post: axiosMocks.instancePost,
  },
}))

import { Method, useFetchData } from '@/composables/useFetchData'

type User = {
  id: number
  name: string
}

type UserParams = {
  page: number
}

type CreateUserData = {
  name: string
}

describe('useFetchData', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('uses the custom Axios instance for relative GET requests', async () => {
    const response = { data: { id: 1, name: 'Ada' } }
    const params = { page: 2 }
    const config = { headers: { 'X-Request-Id': 'request-1' }, timeout: 1_000 }
    axiosMocks.instanceGet.mockResolvedValue(response)

    const { isFetching, result } = await useFetchData({
      url: '/users',
      params,
      config,
      method: Method.GET,
    })

    expect(axiosMocks.instanceGet).toHaveBeenCalledWith('/users', { ...config, params })
    expect(axiosMocks.defaultGet).not.toHaveBeenCalled()
    expect(result).toEqual([response, null])
    expect(isFetching.value).toBe(false)
  })

  it('uses the original Axios client for absolute GET requests', async () => {
    const response = { data: { id: 1, name: 'Ada' } }
    const params = { page: 2 }
    const config = { headers: { Authorization: 'Bearer token' } }
    axiosMocks.defaultGet.mockResolvedValue(response)

    const { result } = await useFetchData({
      url: 'https://api.example.com/users',
      params,
      config,
      method: Method.GET,
      isAbsolutePath: true,
    })

    expect(axiosMocks.defaultGet).toHaveBeenCalledWith('https://api.example.com/users', {
      ...config,
      params,
    })
    expect(axiosMocks.instanceGet).not.toHaveBeenCalled()
    expect(result).toEqual([response, null])
  })

  it('uses the custom Axios instance for relative POST requests', async () => {
    const response = { data: { id: 1, name: 'Ada' } }
    const data = { name: 'Ada' }
    const config = { headers: { 'X-Request-Id': 'request-2' } }
    axiosMocks.instancePost.mockResolvedValue(response)

    const { result } = await useFetchData({
      url: '/users',
      data,
      config,
      method: Method.POST,
    })

    expect(axiosMocks.instancePost).toHaveBeenCalledWith('/users', data, config)
    expect(axiosMocks.defaultPost).not.toHaveBeenCalled()
    expect(result).toEqual([response, null])
  })

  it('uses the original Axios client for absolute POST requests', async () => {
    const response = { data: { id: 1, name: 'Ada' } }
    const data = { name: 'Ada' }
    const config = { headers: { Authorization: 'Bearer token' } }
    axiosMocks.defaultPost.mockResolvedValue(response)

    const { result } = await useFetchData({
      url: 'https://api.example.com/users',
      data,
      config,
      method: Method.POST,
      isAbsolutePath: true,
    })

    expect(axiosMocks.defaultPost).toHaveBeenCalledWith(
      'https://api.example.com/users',
      data,
      config,
    )
    expect(axiosMocks.instancePost).not.toHaveBeenCalled()
    expect(result).toEqual([response, null])
  })

  it('normalizes GET errors into the result tuple', async () => {
    const error = new Error('Network error')
    axiosMocks.instanceGet.mockRejectedValue(error)

    const { isFetching, result } = await useFetchData({
      url: '/users',
      method: Method.GET,
    })

    expect(result[0]).toBeNull()
    expect(result[1]).toBe(error)
    expect(isFetching.value).toBe(false)
  })

  it('normalizes POST errors into the result tuple', async () => {
    const error = new Error('Request error')
    axiosMocks.defaultPost.mockRejectedValue(error)

    const { isFetching, result } = await useFetchData({
      url: 'https://api.example.com/users',
      data: { name: 'Ada' },
      method: Method.POST,
      isAbsolutePath: true,
    })

    expect(result[0]).toBeNull()
    expect(result[1]).toBe(error)
    expect(isFetching.value).toBe(false)
  })

  it('preserves response, params, request body, and error types', async () => {
    const response = { data: { id: 1, name: 'Ada' } }
    axiosMocks.instanceGet.mockResolvedValue(response)

    const request = useFetchData<User, UserParams, CreateUserData>({
      url: '/users',
      params: { page: 1 },
      method: Method.GET,
    })

    expectTypeOf(request).toEqualTypeOf<
      Promise<{
        isFetching: Ref<boolean>
        result: [AxiosResponse<User, CreateUserData, object, UserParams> | null, unknown]
      }>
    >()

    const { result } = await request

    expectTypeOf(result[0]).toEqualTypeOf<AxiosResponse<
      User,
      CreateUserData,
      object,
      UserParams
    > | null>()
    expectTypeOf(result[1]).toEqualTypeOf<unknown>()
  })
})
