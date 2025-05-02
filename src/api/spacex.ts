const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const fetchLaunches = async () => {
    const res = await fetch(`${BASE_URL}/launches`);
    return res.json();
  };
  