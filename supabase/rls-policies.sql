-- =============================================================
-- Cubicon — Supabase RLS Policies
-- Jalankan file ini di Supabase SQL Editor:
--   Dashboard → SQL Editor → New query → paste → Run
-- =============================================================

-- -------------------------------------------------------------
-- TABLE: icons
-- -------------------------------------------------------------

-- Aktifkan RLS
ALTER TABLE icons ENABLE ROW LEVEL SECURITY;

-- SELECT: user hanya bisa lihat icon milik sendiri ATAU icon publik
CREATE POLICY "icons: select own or public"
  ON icons FOR SELECT
  USING (
    user_id = auth.uid()
    OR is_public = true
  );

-- INSERT: user hanya bisa insert icon dengan user_id = dirinya sendiri
CREATE POLICY "icons: insert own only"
  ON icons FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- UPDATE: user hanya bisa update icon milik sendiri
CREATE POLICY "icons: update own only"
  ON icons FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- DELETE: user hanya bisa delete icon milik sendiri
CREATE POLICY "icons: delete own only"
  ON icons FOR DELETE
  USING (user_id = auth.uid());

-- -------------------------------------------------------------
-- TABLE: credits
-- -------------------------------------------------------------

ALTER TABLE credits ENABLE ROW LEVEL SECURITY;

-- SELECT: user hanya bisa lihat saldo dirinya sendiri
CREATE POLICY "credits: select own only"
  ON credits FOR SELECT
  USING (user_id = auth.uid());

-- INSERT & UPDATE: hanya dilakukan server-side (service role key)
-- Frontend tidak diizinkan insert/update credits langsung
-- (tidak perlu policy — tanpa policy, operasi ini diblokir secara default)

-- -------------------------------------------------------------
-- TABLE: users
-- -------------------------------------------------------------

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- SELECT: user hanya bisa lihat profil dirinya sendiri
CREATE POLICY "users: select own only"
  ON users FOR SELECT
  USING (id = auth.uid());

-- UPDATE: user hanya bisa update profil dirinya sendiri
CREATE POLICY "users: update own only"
  ON users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- INSERT: biasanya dilakukan oleh trigger saat user signup
-- Jika butuh insert manual dari client (misal onboarding), tambahkan:
-- CREATE POLICY "users: insert own only"
--   ON users FOR INSERT
--   WITH CHECK (id = auth.uid());

-- -------------------------------------------------------------
-- TABLE: transactions (opsional, jika sudah ada)
-- -------------------------------------------------------------

-- ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "transactions: select own only"
--   ON transactions FOR SELECT
--   USING (user_id = auth.uid());

-- INSERT transactions hanya dari server-side (payment webhook)
-- Tidak ada policy INSERT dari client

-- =============================================================
-- Catatan penting:
-- - Backend (Express + service role key) BYPASS semua RLS
-- - Operasi deductCredits, addCredits di backend tetap berjalan
-- - Frontend hanya pakai anon key — tunduk pada semua policy di atas
-- =============================================================
