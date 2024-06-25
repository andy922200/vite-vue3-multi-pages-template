import Swal, { SweetAlertOptions } from 'sweetalert2'

export const useSweetAlert = () => {
  const successAlert = async ({
    title,
    icon = 'success',
    confirmButtonText = 'OK',
    allowEscapeKey = false,
    allowOutsideClick = false,
    ...options
  }: SweetAlertOptions) => {
    return Swal.fire({
      icon,
      title,
      confirmButtonText,
      allowOutsideClick,
      allowEscapeKey,
      ...options,
    })
  }

  const errorAlert = async ({
    title,
    icon = 'error',
    confirmButtonText = 'OK',
    allowEscapeKey = false,
    allowOutsideClick = false,
    ...options
  }: SweetAlertOptions) => {
    return Swal.fire({
      icon,
      title,
      confirmButtonText,
      allowOutsideClick,
      allowEscapeKey,
      ...options,
    })
  }

  return {
    successAlert,
    errorAlert,
  }
}
