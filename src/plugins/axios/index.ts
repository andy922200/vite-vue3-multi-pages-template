import axios from 'axios'
import { BuildENV } from '@/types'

const baseURL = import.meta.env.VITE_BUILD_ENV === BuildENV.development ? '/api/' : '/'

const axiosInstance = axios.create({ baseURL })

export { axiosInstance }
