export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };
};

export const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export const getStudentProfile = async (email?: string) => {
  const userEmail = email || JSON.parse(localStorage.getItem('user') || '{}')?.email || '';
  const res = await fetch(`${API_BASE_URL}/user/profile?email=${encodeURIComponent(userEmail)}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
};

export const getStudentBatches = async () => {
  const res = await fetch(`${API_BASE_URL}/student/batches`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch batches");
  return res.json();
};

export const getBatchContent = async (batchId: string) => {
  const res = await fetch(`${API_BASE_URL}/student/content/${batchId}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch content");
  return res.json();
};

export const enrollInCourse = async (batchId: string) => {
  const res = await fetch(`${API_BASE_URL}/student/enroll`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ batchId })
  });
  if (!res.ok) throw new Error("Failed to enroll");
  return res.json();
};