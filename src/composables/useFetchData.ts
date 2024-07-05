import axios from 'axios' // Original Axios
import { ref } from 'vue'
import { axiosInstance } from '@/plugins/axios' // Custom Axios

enum Method {
  GET = 'get',
  POST = 'post',
}

const getRequest = async ({
  url,
  params,
  isAbsolutePath,
}: {
  url: string
  params?: any
  isAbsolutePath: boolean
}) => {
  try {
    const res = isAbsolutePath
      ? await axios.get(url, { params })
      : await axiosInstance.get(url, { params })

    return [res, null]
  } catch (err) {
    return [null, err]
  }
}

const postRequest = async ({
  url,
  params,
  isAbsolutePath,
}: {
  url: string
  params?: any
  isAbsolutePath: boolean
}) => {
  try {
    const res = isAbsolutePath
      ? await axios.post(url, params)
      : await axiosInstance.post(url, params)

    return [res, null]
  } catch (err) {
    return [null, err]
  }
}

export const useFetchData = async ({
  url,
  params,
  method,
  isAbsolutePath,
}: {
  url: string
  params?: any
  method: Method
  isAbsolutePath: boolean
}) => {
  const isFetching = ref(false)

  try {
    isFetching.value = true

    const [res, err] =
      method === Method.GET
        ? await getRequest({ url, params, isAbsolutePath })
        : await postRequest({ url, params, isAbsolutePath })

    return {
      isFetching,
      result: [res, err],
    }
  } finally {
    isFetching.value = false
  }
}
