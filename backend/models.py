from sqlalchemy import Column, Integer, JSON
from database import Base

class GameSession(Base):
    __tablename__ = "game_sessions"

    id = Column(Integer, primary_key=True, index=True)
    skill_state = Column(JSON)
    system_state = Column(JSON)
    current_stage = Column(Integer)