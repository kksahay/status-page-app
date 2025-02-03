import api from "./http";

export const loginApi = async (email: string, password: string) => {
    const response = await api.post("/user/login", { email, password });
    const { token } = response.data;

    localStorage.setItem("token", token);

    return response.data;
};

export const logoutApi = () => {
    localStorage.removeItem("token");
};

export const registerApi = async (name: string, email: string, pwd: string) => {
    const response = await api.post("/user/register", { name, email, pwd, role: "user" });
    return response.data;
}
