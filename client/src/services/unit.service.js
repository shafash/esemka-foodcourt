import axiosInstance from "./axious";
import { UNIT_ENDPOINTS } from "../constants/api";

export async function getUnits() {
  const { data } = await axiosInstance.get(UNIT_ENDPOINTS.list, {
    params: {
      page: 1,
      limit: 100,
    },
  });

  return (data.data.units || []).map((unit) => ({
    value: unit.Name,
    label: unit.Name,
  }));
}