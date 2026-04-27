-- Create the players table
CREATE TABLE players (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username   TEXT NOT NULL,
  device_id  TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT players_username_length CHECK (char_length(username) BETWEEN 2 AND 24),
  CONSTRAINT players_username_chars  CHECK (username ~ '^[a-zA-Z0-9_\-]+$')
);
CREATE INDEX players_device_id_idx ON players(device_id);
CREATE INDEX players_username_idx  ON players(username);

-- Create the runs table
CREATE TABLE runs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id           TEXT NOT NULL UNIQUE,
  player_id        UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  difficulty       TEXT NOT NULL CHECK (difficulty IN ('ScriptKiddie','Hacker','Elite')),
  score            INTEGER NOT NULL DEFAULT 0,
  correct_count    INTEGER NOT NULL DEFAULT 0,
  total_count      INTEGER NOT NULL DEFAULT 0,
  health_remaining INTEGER NOT NULL DEFAULT 0,
  outcome          TEXT NOT NULL CHECK (outcome IN ('success','failed')),
  started_at       TIMESTAMPTZ NOT NULL,
  finished_at      TIMESTAMPTZ NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX runs_score_idx       ON runs(score DESC);
CREATE INDEX runs_finished_at_idx ON runs(finished_at DESC);
CREATE INDEX runs_player_id_idx   ON runs(player_id);

-- Create the unlock_progress table
CREATE TABLE unlock_progress (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id   UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  difficulty  TEXT NOT NULL CHECK (difficulty IN ('Hacker','Elite')),
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(player_id, difficulty)
);

-- Enable Row Level Security (RLS)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE unlock_progress ENABLE ROW LEVEL SECURITY;

-- Create Public Policies (Read/Insert for everyone)
CREATE POLICY "players_public_read"   ON players FOR SELECT USING (true);
CREATE POLICY "players_public_insert" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "runs_public_read"      ON runs FOR SELECT USING (true);
CREATE POLICY "runs_public_insert"    ON runs FOR INSERT WITH CHECK (true);
CREATE POLICY "unlocks_public_read"   ON unlock_progress FOR SELECT USING (true);
CREATE POLICY "unlocks_public_insert" ON unlock_progress FOR INSERT WITH CHECK (true);

-- Enable realtime replication
-- Note: This requires the 'supabase_realtime' publication to already exist (default in Supabase)
ALTER PUBLICATION supabase_realtime ADD TABLE runs;
ALTER PUBLICATION supabase_realtime ADD TABLE players;
