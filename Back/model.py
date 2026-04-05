from sqlalchemy import Column, Integer, String, DateTime
from database import Base, SessionLocal
from client import Order

class Form(Base):
    __tablename__ = 'form'
    id = Column(Integer, primary_key=True, autoincrement=True)
    room_type = Column(String(40), unique=False, nullable=True)
    zones = Column(String(250), unique=False, nullable=True)
    area = Column(Integer, unique=False, nullable=True)
    style = Column(String(40), unique=False, nullable=True)
    budget = Column(String(60), unique=False, nullable=True)
    name = Column(String(200), unique=False, nullable=True)
    phone = Column(String(20), unique=False, nullable=True)
    email = Column(String(40), unique=False, nullable=True)
    comment = Column(String(450), unique=False, nullable=True)
    dispatch_date = Column(DateTime, unique=False, nullable=True)
    utm_source = Column(String(80), unique=False, nullable=True)

def __init__(self, id, room_type, zones, area, style, budget, name, phone, email, comment, dispatch_date, utm_source):
    self.id = id
    self.room_type = room_type
    self.zones = zones
    self.area = area
    self.style = style
    self.budget = budget
    self.name = name
    self.phone = phone
    self.email = email
    self.comment = comment
    self.dispatch_date = dispatch_date
    self.utm_source = utm_source

def __repr__(self):
    return f'Form {self.id!r}'

def load_database(id = None):
    session = SessionLocal()
    try:
        if id is not None:
            form = session.query(Form).filter(Form.id == id).first()
            if form:
                return Order(
                    id = form.id or "",
                    name=form.name or "",
                    phone=form.phone or "",
                    email=form.email or "",
                    comment=form.comment or "",
                    room_type=form.room_type or "",
                    zones=form.zones if isinstance(form.zones, list) else [form.zones] if form.zones else [],
                    area=form.area or 0,
                    style=form.style or "",
                    budget=form.budget or "",
                    utm_source=form.utm_source or "",
                    create_time=form.dispatch_date.isoformat() if form.dispatch_date else datetime.now().isoformat()
                )
            return None
        else:
            data = session.query(Form).all()
            orders_list = []
            for form in data:
                order = Order(
                    id = form.id,
                    name=form.name or "",
                    phone=form.phone or "",
                    email=form.email or "",
                    comment=form.comment or "",
                    room_type=form.room_type or "",
                    zones=form.zones if isinstance(form.zones, list) else [form.zones] if form.zones else [],
                    area=form.area or 0,
                    style=form.style or "",
                    budget=form.budget or "",
                    utm_source=form.utm_source or "",
                    create_time=form.dispatch_date.isoformat() if form.dispatch_date else datetime.now().isoformat()
                )
                order.zones = order.zones[0]
                order.zones = order.zones[1:-1]
                if ',' in order.zones:
                    order.zones =  order.zones.split(',')
                else:
                    order.zones = [order.zones]
                orders_list.append(order)
            return orders_list
    finally:
        session.close()
