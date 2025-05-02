
export const fetchLaunches = async () => {
    const res = await fetch('https://api.spacexdata.com/v4/launches');
    return res.json();
  };
  