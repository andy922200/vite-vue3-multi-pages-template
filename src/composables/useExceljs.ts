import Exceljs from 'exceljs'

import dayjs from '@/plugins/dayjs'

export const useExceljs = () => {
  const workbook = new Exceljs.Workbook()

  const getCurrentWorkbook = () => workbook

  const addWorksheet = ({
    worksheetName = 'sheet1',
    tableProperties,
  }: {
    worksheetName: string
    tableProperties: Exceljs.TableProperties
  }): {
    workbook: Exceljs.Workbook
    worksheet: Exceljs.Worksheet
  } => {
    const sheet = workbook.addWorksheet(worksheetName)
    sheet.addTable(tableProperties)
    return {
      workbook,
      worksheet: sheet,
    }
  }

  const downloadWorkbook = async ({ fileName }: { fileName?: string }) => {
    const timestamp = dayjs().toISOString()
    const table = await workbook.xlsx.writeBuffer()
    const link = document.createElement('a')
    const blobData = new Blob([table], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;',
    })
    link.download = fileName ? `${fileName}.xlsx` : `${timestamp}.xlsx`
    link.href = URL.createObjectURL(blobData)
    link.click()
  }

  return {
    getCurrentWorkbook,
    addWorksheet,
    downloadWorkbook,
  }
}
