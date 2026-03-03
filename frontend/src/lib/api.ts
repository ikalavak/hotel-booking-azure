const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://rg-hotelbooking-fkcqbvhybqdgc6ep.westus3-01.azurewebsites.net";

async function handleResponse(res: Response) {
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data?.error || data?.message || "Request failed");
  }

  return data;
}

export async function registerUser(fullName: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, email, password })
  });

  return handleResponse(res);
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  return handleResponse(res);
}