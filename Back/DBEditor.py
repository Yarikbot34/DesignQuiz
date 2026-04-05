from database import SessionLocal
from model import Form

def add(room_type, zones, area, style, budget, name, phone, email, comment, dispatch_date, utm_source):

    session = SessionLocal()

    new_form = Form(
        room_type=room_type,
        zones=zones,
        area=area,
        style=style,
        budget=budget,
        name=name,
        phone=phone,
        email=email,
        comment=comment,
        dispatch_date=dispatch_date,
        utm_source=utm_source
    )
    session.add(new_form)
    session.commit()
    id = new_form.id
    session.close()
    return id

def delete(id):

    session = SessionLocal()

    form = session.query(Form).filter_by(id=id).first()
    if form is None:
        return
    session.delete(form)
    session.commit()
    session.close()