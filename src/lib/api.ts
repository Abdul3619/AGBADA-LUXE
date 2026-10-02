import { MEDIA_BUCKET, supabase } from './supabase';

export type Currency = 'NGN' | 'USD' | 'GBP' | 'EUR';
export const CURRENCIES: Currency[] = ['NGN', 'USD', 'GBP', 'EUR'];

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number | null;
  currency: Currency;
  category: string;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface AdminProduct extends Product {
  image_path: string | null;
  is_published: boolean;
  updated_at: string;
}

export type BookingKind = 'consultation' | 'inquiry';
export type BookingStatus = 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';
export const BOOKING_STATUSES: BookingStatus[] = ['new', 'contacted', 'confirmed', 'completed', 'cancelled'];

export interface Booking {
  id: string;
  kind: BookingKind;
  full_name: string;
  email: string;
  phone: string | null;
  service: string | null;
  preferred_date: string | null;
  message: string;
  status: BookingStatus;
  created_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export const SETTING_KEYS = [
  'tagline', 'intro', 'about_title', 'about_body', 'contact_email', 'contact_phone', 'whatsapp', 'address',
  'opening_hours', 'instagram_url', 'hero_image_url',
] as const;
export type SettingKey = (typeof SETTING_KEYS)[number];
export type Settings = Partial<Record<SettingKey, string>>;

export interface Session {
  token: string;
  expiresAt: string;
}

/** An error whose message is safe to show to a visitor or the site owner. */
export class ApiError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

const MESSAGES: Record<string, string> = {
  unauthorized: 'Your session has ended. Please sign in again.',
  rate_limited: 'Too many attempts. Please wait a few minutes and try again.',
  invalid_credentials: 'That email and password combination is not correct.',
  invalid_date: 'Please choose a date within the next twelve months.',
  not_found: 'This item no longer exists. Refresh the page to see the latest version.',
  invalid_file_type: 'Please upload a JPEG, PNG, WebP or AVIF image.',
  wrong_password: 'Your current password is not correct.',
  weak_password: 'The new password must be at least 10 characters long.',
  same_password: 'The new password must be different from the current one.',
  check_violation: 'Some details are missing or not in the expected format. Please check the form.',
  network: 'We could not reach the server. Check your connection and try again.',
};

function toApiError(error: { message?: string; code?: string } | null | undefined): ApiError {
  const raw = error?.message ?? '';
  const known = Object.keys(MESSAGES).find((code) => raw === code || raw.startsWith(`${code}`));
  if (known) return new ApiError(known, MESSAGES[known]);
  if (error?.code === '23514' || error?.code === '23502' || error?.code === '22P02' || error?.code === '22001') {
    return new ApiError('check_violation', MESSAGES.check_violation);
  }
  if (/fetch|network/i.test(raw)) return new ApiError('network', MESSAGES.network);
  return new ApiError('unknown', 'Something went wrong. Please try again.');
}

export function errorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : 'Something went wrong. Please try again.';
}

async function rpc<T>(fn: string, args: Record<string, unknown> = {}): Promise<T> {
  let result;
  try {
    result = await supabase.rpc(fn, args);
  } catch {
    throw new ApiError('network', MESSAGES.network);
  }
  if (result.error) throw toApiError(result.error);
  return result.data as T;
}

// ---------------------------------------------------------------- public site

export const listProducts = () => rpc<Product[]>('agbada_list_products');

export async function getProduct(id: string): Promise<Product | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const rows = await rpc<Product[]>('agbada_get_product', { p_id: id });
  return rows[0] ?? null;
}

export async function getSettings(): Promise<Settings> {
  const rows = await rpc<{ key: SettingKey; value: string }[]>('agbada_get_settings');
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export interface BookingInput {
  kind: BookingKind;
  fullName: string;
  email: string;
  phone?: string;
  service?: string;
  preferredDate?: string;
  message: string;
}

export const submitBooking = (b: BookingInput) =>
  rpc<string>('agbada_submit_booking', {
    p_kind: b.kind,
    p_full_name: b.fullName,
    p_email: b.email,
    p_phone: b.phone || null,
    p_service: b.service || null,
    p_preferred_date: b.preferredDate || null,
    p_message: b.message,
  });

export const subscribe = (email: string) => rpc<void>('agbada_subscribe', { p_email: email });

// ---------------------------------------------------------------- admin

export async function login(email: string, password: string): Promise<Session> {
  const [row] = await rpc<{ ok: boolean; error: string | null; token: string; expires_at: string }[]>(
    'agbada_admin_login', { p_email: email, p_password: password });
  if (!row?.ok) throw toApiError({ message: row?.error ?? 'invalid_credentials' });
  return { token: row.token, expiresAt: row.expires_at };
}

export const logout = (token: string) => rpc<void>('agbada_admin_logout', { p_token: token });

// Exchanges a one-time magic-link token (minted elsewhere -- see agbada_admin_create_magic_link, which only the
// portfolio's AI assistant can call) for a real admin session, the same shape login() returns. The link itself is
// single-use and expires after 10 minutes.
export async function consumeMagicLink(linkToken: string): Promise<Session> {
  const [row] = await rpc<{ ok: boolean; error: string | null; token: string; expires_at: string }[]>(
    'agbada_admin_consume_magic_link', { p_link_token: linkToken });
  if (!row?.ok) throw toApiError({ message: row?.error ?? 'unauthorized' });
  return { token: row.token, expiresAt: row.expires_at };
}

export async function getSession(token: string): Promise<{ email: string; expiresAt: string }> {
  const [row] = await rpc<{ email: string; expires_at: string }[]>('agbada_admin_session', { p_token: token });
  if (!row) throw toApiError({ message: 'unauthorized' });
  return { email: row.email, expiresAt: row.expires_at };
}

export async function changePassword(token: string, current: string, next: string): Promise<Session> {
  const [row] = await rpc<{ ok: boolean; error: string | null; token: string; expires_at: string }[]>(
    'agbada_admin_change_password', { p_token: token, p_current: current, p_new: next });
  if (!row?.ok) throw toApiError({ message: row?.error ?? 'unknown' });
  return { token: row.token, expiresAt: row.expires_at };
}

export const adminListProducts = (token: string) => rpc<AdminProduct[]>('agbada_admin_list_products', { p_token: token });

export interface ProductInput {
  id: string | null;
  name: string;
  description: string;
  price: number | null;
  currency: Currency;
  category: string;
  imageUrl: string | null;
  imagePath: string | null;
  isPublished: boolean;
  sortOrder: number;
}

export const saveProduct = (token: string, p: ProductInput) =>
  rpc<string>('agbada_admin_save_product', {
    p_token: token,
    p_id: p.id,
    p_name: p.name,
    p_description: p.description,
    p_price: p.price,
    p_currency: p.currency,
    p_category: p.category,
    p_image_url: p.imageUrl,
    p_image_path: p.imagePath,
    p_is_published: p.isPublished,
    p_sort_order: p.sortOrder,
  });

export const deleteProduct = (token: string, id: string) =>
  rpc<boolean>('agbada_admin_delete_product', { p_token: token, p_id: id });

export const adminListBookings = (token: string) => rpc<Booking[]>('agbada_admin_list_bookings', { p_token: token });

export const updateBookingStatus = (token: string, id: string, status: BookingStatus) =>
  rpc<boolean>('agbada_admin_update_booking', { p_token: token, p_id: id, p_status: status });

export const adminListSubscribers = (token: string) =>
  rpc<Subscriber[]>('agbada_admin_list_subscribers', { p_token: token });

export const deleteSubscriber = (token: string, id: string) =>
  rpc<boolean>('agbada_admin_delete_subscriber', { p_token: token, p_id: id });

export const saveSettings = (token: string, settings: Settings) =>
  rpc<void>('agbada_admin_save_settings', { p_token: token, p_settings: settings });

/**
 * Uploads an image to Supabase Storage. The database first reserves a random path for this admin session
 * (valid for ten minutes); the storage policy only accepts uploads to reserved paths.
 */
export async function uploadImage(token: string, file: Blob, extension: string): Promise<{ path: string; url: string }> {
  const path = await rpc<string>('agbada_admin_create_upload', { p_token: token, p_extension: extension });
  let result;
  try {
    result = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
      contentType: file.type || 'image/jpeg',
      cacheControl: '31536000',
      upsert: false,
    });
  } catch {
    throw new ApiError('network', MESSAGES.network);
  }
  if (result.error) {
    const msg = result.error.message || '';
    if (/exceeded|too large|size/i.test(msg)) throw new ApiError('too_large', 'That image is too large (5 MB maximum).');
    if (/mime|type/i.test(msg)) throw new ApiError('invalid_file_type', MESSAGES.invalid_file_type);
    throw new ApiError('upload_failed', 'The image could not be uploaded. Please try again.');
  }
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}
