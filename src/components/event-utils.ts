import { EventInput } from '@fullcalendar/core'
import dayjs from 'dayjs'

const today = dayjs()

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: '1',
    title: '板橋鄉民活動中心',
    start: today.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    end: today.add(3, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    backgroundColor: '#27AE60',
    borderColor: '#27AE60',
  },
  {
    id: '2',
    title: '板橋警民活動中心',
    start: today.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    backgroundColor: '#2F80ED',
    borderColor: '#2F80ED',
  },
  {
    id: '3',
    title: '天主教輔仁大學活動中心 204Ａ室',
    start: today.add(7, 'hours').format('YYYY-MM-DD HH:mm:ss'),
    backgroundColor: '#EB6615',
    borderColor: '#EB6615',
  },
  {
    id: '4',
    title: '新莊鄉民活動中心',
    start: today.add(7, 'hours').format('YYYY-MM-DD HH:mm:ss'),
    backgroundColor: '#EB6615',
    borderColor: '#EB6615',
  },
]
