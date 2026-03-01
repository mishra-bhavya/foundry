from sqlalchemy import Column, Integer, JSON
from database import Base
from sqlalchemy import String, Boolean
from sqlalchemy.dialects.postgresql import JSONB

class GameSession(Base):
    __tablename__ = "game_sessions"

    id = Column(Integer, primary_key=True, index=True)
    current_stage = Column(Integer, default=1)

    career_id = Column(String, nullable=False)

    skills = Column(JSONB, nullable=False)
    system_state = Column(JSONB, nullable=False)

    is_game_over = Column(Boolean, default=False)