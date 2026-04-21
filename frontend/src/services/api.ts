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

// --- ADMIN ROUTES ---

export const getAdminCourses = async () => {
  const res = await fetch(`${API_BASE_URL}/admin/courses`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch admin courses");
  return res.json();
};

export const createAdminCourse = async (courseData: { title: string, category: string, description?: string }) => {
  const res = await fetch(`${API_BASE_URL}/admin/courses`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(courseData)
  });
  if (!res.ok) throw new Error("Failed to create course");
  return res.json();
};

export const uploadAdminLecture = async (lectureData: { title: string, courseId: string, videoUrl: string }) => {
  const res = await fetch(`${API_BASE_URL}/admin/lectures`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(lectureData)
  });
  if (!res.ok) throw new Error("Failed to upload lecture");
  return res.json();
};

export const getAdminStudents = async () => {
  const res = await fetch(`${API_BASE_URL}/admin/students`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
};

export const getAdminEnquiries = async () => {
  const res = await fetch(`${API_BASE_URL}/admin/enquiries`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch enquiries");
  return res.json();
};