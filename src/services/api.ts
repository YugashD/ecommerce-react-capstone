const BASE_URL = "https://fakestoreapi.com";

export async function getProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  return res.json();
}

export async function getCategories(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/products/categories`);
  return res.json();
}

export async function getProductById(id: number | string) {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  return res.json();
}

export async function addProduct(product: object) {
  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
}

export async function updateProduct(id: number | string, product: object) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
}

export async function deleteProduct(id: number | string) {
  const res = await fetch(`${BASE_URL}/products/${id}`, { method: "DELETE" });
  return res.json();
}

export async function loginUser(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const status = res.status;
  let data = null;
  try {
    data = await res.json();
  } catch (err) {
    // response had no JSON body
    data = null;
  }
  return { ok: res.ok, status, data };
}

export async function signupUser(payload: object) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
