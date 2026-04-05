from fastapi import FastAPI, BackgroundTasks
from services import sendMail
from client import Client
from DBEditor import add, delete
from datetime import datetime
from model import load_database
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # ЗАМЕНИТЬ ДЛЯ СЕРВЕРА
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.delete("/quiz/orders/{order_id}")
def deleteOrder(order_id: int):
    try:
        delete(order_id)
        return {"message": "Успешное удаление"}
    except Exception as e:
        return {"message": f"Ошибка: {e}"}

@app.get("/quiz/orders")
def getOredrs():
    orders = load_database()
    return orders


@app.post("/quiz/result")
def postResult(client: Client, background_tasks: BackgroundTasks):
        if "Полностью всё помещение" in client.zones:
            client.zones = client.zones[-1:]
        id = add(
                name=client.name,
                email=client.email,
                phone=client.phone,
                comment=client.comment,
                room_type=client.room_type,
                zones=client.zones,
                area=client.area,
                style=client.style,
                budget=client.budget,
                dispatch_date=datetime.now(),
                utm_source=client.utm_source
        )
        if len(client.email) > 5:
            background_tasks.add_task(sendMail, id, client)
        return id