import { supabase } from './supabase';

export const getProducts = async () => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  return data;
};

export const getProductById = async (productId: string) => {
  const { data, error } = await supabase.from('products').select('*').eq('id', productId).single();
  if (error) throw error;
  return data;
};

export const createProduct = async (product: { name: string; quantity: number; description?: string }) => {
  const { data, error } = await supabase.from('products').insert([product]);
  if (error) throw error;
  return data;
};

export const updateProduct = async (productId: string, product: { name: string; quantity: number; description?: string }) => {
  const { data, error } = await supabase.from('products').update(product).match({ id: productId });
  if (error) throw error;
  return data;
};

export const deleteProduct = async (productId: string) => {
  const { data, error } = await supabase.from('products').delete().match({ id: productId });
  if (error) throw error;
  return data;
};

export const getAssignments = async () => {
  const { data, error } = await supabase.from('assignments').select('*, products(*)');
  if (error) throw error;
  return data;
};

export const getAssignmentsByUser = async (userId: string) => {
  const { data, error } = await supabase.from('assignments').select('*, products(*)').eq('user_id', userId);
  if (error) throw error;
  return data;
};

export const assignProduct = async (userId: string, productId: string, quantity: number) => {
  const { data, error } = await supabase.from('assignments').insert([{ user_id: userId, product_id: productId, quantity_assigned: quantity }]);
  if (error) throw error;
  return data;
};

export const unassignProduct = async (userId: string, productId: string) => {
  const { data, error } = await supabase.from('assignments').delete().match({ user_id: userId, product_id: productId });
  if (error) throw error;
  return data;
};

export const getUsers = async () => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data;
};

export const deleteUser = async (userId: string) => {
  const { data, error } = await supabase.from('users').delete().match({ id: userId });
  if (error) throw error;
  return data;
};

export const getAvailableQuantity = async (productId: string) => {
  const { data, error } = await supabase.from('products').select('quantity').eq('id', productId).single();
  if (error) throw error;

  const { data: assignments, error: assignmentsError } = await supabase.from('assignments').select('quantity_assigned').eq('product_id', productId);
  if (assignmentsError) throw assignmentsError;

  const totalAssigned = assignments.reduce((acc, assignment) => acc + assignment.quantity_assigned, 0);
  return data.quantity - totalAssigned;
};
