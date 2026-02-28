from sqlalchemy import Column, Integer, JSON
from database import Base

class GameSession(Base):
    __tablename__ = "game_sessions"

    id = Column(Integer, primary_key=True, index=True)
    current_stage = Column(Integer, default=1)

    product_thinking = Column(Integer, default=0)
    technical_judgment = Column(Integer, default=0)
    leadership = Column(Integer, default=0)
    resource_management = Column(Integer, default=0)
    execution = Column(Integer, default=0)

    team_morale = Column(Integer, default=100)
    burnout = Column(Integer, default=0)
    technical_debt = Column(Integer, default=0)
    time_pressure = Column(Integer, default=0)
    reputation = Column(Integer, default=0)