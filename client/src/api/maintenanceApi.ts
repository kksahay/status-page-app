import api from "./http"

export const createMaintenanceApi = async (service_id: number, start_time: string, end_time: string) => {
    const response = await api.post("/maintenance/create", { service_id, start_time, end_time });
    return response.data;
}

export const getMaintenanaceApi = async () => {
    const response = await api.get("/maintenance/list");
    return response.data;
}

export const updateMaintenanceApi = async (service_id: number) => {
    const response = await api.put("/maintenance/update", { service_id });
    return response.data;
}

export const deleteMaintenanceApi = async (serviceId: number) => {
    const response = await api.delete(`/maintenance/delete/${serviceId}`);
    return response.data;
}