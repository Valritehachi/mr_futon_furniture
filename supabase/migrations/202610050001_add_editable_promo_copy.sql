alter table public.settings
  add column if not exists promo_title text not null default 'High Quality Futon Sofa Sleepers',
  add column if not exists promo_subtitle text not null default 'All Futons and Frames are Made in the USA',
  add column if not exists promo_message text not null default 'Our prices are less than Amazon, Wayfair or any online futon store in the USA. Same item. Better Quality.',
  add column if not exists promo_offer text default '$99 PREMIUM 8 MATTRESS WITH FRAME PURCHASE.';
