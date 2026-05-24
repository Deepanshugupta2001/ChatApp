// import axios from "axios";

// export default axios.create({
//     baseURL: `http://localhost:4441`,
//     headers:{
//         Authorization: `Bearer ${localStorage.getItem("token") || ""}`
//       }
// })

import axios from "axios";

// Override default axios instance with custom interceptor
axios.defaults.baseURL = import.meta.env.VITE_API_URL;;

axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axios;
