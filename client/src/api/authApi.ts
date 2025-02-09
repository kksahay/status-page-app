import api from "./http";

export const loginApi = async (email: string, pwd: string) => {
    const response = await api.post("/user/login", { email, pwd });
    const { token, role } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    return response.data;
};

export const logoutApi = () => {
    localStorage.removeItem("token");
};

export const registerApi = async (name: string, email: string, pwd: string) => {
    const response = await api.post("/user/register", { name, email, pwd, role: "user" });
    return response.data;
}

export const userDetailsApi = async () => {
    const response = await api.get("/user/userDetails");
    return response.data;
}
