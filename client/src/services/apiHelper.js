export function unwrapApiData(response) {
  if (response?.data?.data !== undefined) {
    return response.data.data;
  }

  if (response?.data && typeof response.data === "object" && "success" in response.data) {
    return response.data.data;
  }

  return response?.data ?? response;
}

export function getApiErrorMessage(error, fallback = "Terjadi kesalahan.") {
  return error?.response?.data?.message || error?.message || fallback;
}
