export type TOrderItem = {
  productId: string;
  quantity: number;
};

export type TCreateOrderInput = {
  userId: string;
  shippingAddress: string;
  items: TOrderItem[];
};

export type TOrderResponse = {
  success: boolean;
  message: string;
  error?: string;
};
