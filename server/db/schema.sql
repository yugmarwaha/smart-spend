-- SmartSpend schema
-- Idempotent: safe to run multiple times.

CREATE TABLE IF NOT EXISTS expenses (
  id          BIGSERIAL PRIMARY KEY,
  user_id     TEXT NOT NULL DEFAULT 'default-user',
  amount      NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
  category    TEXT NOT NULL,
  date        TIMESTAMPTZ NOT NULL,
  note        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS expenses_user_id_idx ON expenses (user_id);
CREATE INDEX IF NOT EXISTS expenses_date_idx ON expenses (date DESC);
