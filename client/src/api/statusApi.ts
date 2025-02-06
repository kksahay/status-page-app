import api from "./http"

export const getStatusApi = async (userId: number) => {
    const response = await api.get(`/status/${userId}`);
    return response.data;
}
