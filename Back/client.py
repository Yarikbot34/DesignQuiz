from pydantic import BaseModel


class Client(BaseModel):
    name: str #Имя
    phone: str #Телефон
    email: str #Почта
    comment: str #ПРимечание
    room_type: str #Тип помещения
    zones: list #Комнаты
    area: int #Площадь
    style: str #Стиль
    budget: str #Бюджет
    utm_source: str #Реферал

class Order(BaseModel):
    id: int #ID
    name: str #Имя
    phone: str #Телефон
    email: str #Почта
    comment: str #ПРимечание
    room_type: str #Тип помещения
    zones: list #Комнаты
    area: int #Площадь
    style: str #Стиль
    budget: str #Бюджет
    utm_source: str #Реферал
    create_time: str #Время получения