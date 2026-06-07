ALTER TABLE note_share ADD COLUMN token TEXT;
CREATE UNIQUE INDEX idx_note_share_token ON note_share(token) WHERE token IS NOT NULL;
