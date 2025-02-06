import api from "./http";

export const createServiceApi = async (title: string, endpoint: string) => {
    const response = await api.post("/service/create", { title, endpoint });
    return response.data;
}

export const getServicesApi = async () => {
    const response = await api.get("/service/servicesList");
    return response.data;
}

export const deleteServiceApi = async (serviceId: number) => {
    const response = await api.delete(`/service/delete/${serviceId}`);
    return response.data;
}

export const updateServiceApi = async (service_id: number, title: string, description: string, endpoint: string, change_status: string) => {
    const response = await api.put("/service/update", { service_id, title, description, endpoint, change_status });
    return response.data;
}

export const getServiceHistory = async () => {
    const response = await api.get("/service/servicesHistory");
    return response.data;
}

export const getServiceReport = async (userId: number) => {
    const response = await api.get(`/service/servicesHistory/${userId}`);
    return response.data;
}