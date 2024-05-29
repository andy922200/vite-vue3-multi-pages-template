export const useFormSubmit = ({
  data,
  actionURL,
  id = 'form-submit',
}: {
  data: Record<string, any>
  actionURL: string
  id?: string
}) => {
  const body = document.querySelector('body')
  const form = document.createElement('form')

  if (!actionURL.trim()) return

  form.id = id
  form.classList.add('hidden')
  form.setAttribute('action', actionURL)
  form.setAttribute('method', 'POST')

  Object.entries(data).forEach(([key, val]) => {
    const input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.setAttribute('name', key)
    input.setAttribute('required', '')

    input.value = val

    form.appendChild(input)
  })

  if (body) {
    body.appendChild(form)
  }

  form.submit()
}
