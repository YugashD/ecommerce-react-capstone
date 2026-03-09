export type Product = {
  id: number | string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
};

export type NewProduct = Omit<Product, "id" | "rating">;

export type CartItem = {
  id: number | string;
  title: string;
  price: number;
  image: string;
  qty: number;
};

export type ApiMessage = {
  type: "success" | "error" | "info";
  text: string;
};