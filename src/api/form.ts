import qs from 'qs'

function transformToForm(data: any) {
  return qs.stringify(data)
}

export const formConfig = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  transformRequest: [transformToForm],
}
