import axios, { AxiosRequestConfig, AxiosResponse } from 'axios' // Original Axios
import { Ref, ref } from 'vue'

import { axiosInstance } from '@/plugins/axios' // Custom Axios

enum Method {
  GET = 'get',
  POST = 'post',
}

const getRequest = async ({
  url,
  params,
  config,
  isAbsolutePath,
}: {
  url: string
  params?: Record<string, any>
  config?: AxiosRequestConfig
  isAbsolutePath: boolean
}): Promise<[AxiosResponse<any, any> | null, any]> => {
  try {
    const res = isAbsolutePath
      ? await axios.get(url, { params })
      : await axiosInstance.get(url, { ...config, params })

    return [res, null]
  } catch (err) {
    return [null, err]
  }
}

const postRequest = async ({
  url,
  data,
  config,
  isAbsolutePath,
}: {
  url: string
  data?: Record<string, any>
  config?: AxiosRequestConfig
  isAbsolutePath: boolean
  isOwnerPath?: boolean
}): Promise<[AxiosResponse<any, any> | null, any]> => {
  try {
    const res = isAbsolutePath
      ? await axios.post(url, data, config)
      : await axiosInstance.post(url, data, config)

    return [res, null]
  } catch (err) {
    return [null, err]
  }
}

export const useFetchData = async ({
  url,
  params,
  data,
  config,
  method,
  isAbsolutePath = false,
}: {
  url: string
  params?: Record<string, any>
  data?: Record<string, any>
  config?: AxiosRequestConfig
  method: Method
  isAbsolutePath?: boolean
  isOwnerPath?: boolean
}): Promise<{ isFetching: Ref<boolean>; result: [AxiosResponse<any, any> | null, any] }> => {
  const isFetching = ref(false)

  try {
    isFetching.value = true

    const [res, err] =
      method === Method.GET
        ? await getRequest({ url, params, isAbsolutePath })
        : await postRequest({ url, data, config, isAbsolutePath })

    return {
      isFetching,
      result: [res, err],
    }
  } finally {
    isFetching.value = false
  }
}
