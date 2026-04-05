import aiosmtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv
from client import Client

load_dotenv()

#настройки SMTP
SMTP_CONFIG = {
    "hostname": "smtp.gmail.com",
    "port": 587,
    "username": os.getenv("MAIL_BACK"),
    "password": os.getenv("MAIL_BACK_PASS"),
    "use_tls": True
}


async def sendMail(id: int, client: Client):
    zones = ", ".join(client.zones)

    html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(45deg, rgb(11, 6, 0), rgb(50, 50, 50)); padding: 30px; border-radius: 10px 10px 0 0; text-align: left;">
                    <h1 style="color: white; margin: 0; font-size: 24px;"> Ваша заявка зарегистрирована</h1>
                </div>
                <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                    <p style="font-size: 24px; margin-bottom: 20px;">Здравствуйте, {client.name}!</p>
                    <p style="font-size: 20px; margin-bottom: 20px;">
                        Ваша заявка была успешно принята. Менеджер свяжется с вами в ближайшее время.
                    </p>
                    <p style="font-size: 20px;"> ID вашего заявления:</p>
                    <div style="background: white; padding: 15px; border-left: 4px solid #323232;border-right: 4px solid #323232; margin: 20px 0; text-align: center">
                        <p style="margin: 0; color: #555;font-size: 20px;"><strong>{id}</strong></p>
                    </div>
                    <h2>Детали вашего заявления:</h2>
                    <p style="font-size: 20px;">
                    <b>Тип помещения:</b><br>{client.room_type}<br>
                    <b>Комнаты:</b><br>{zones}<br>
                    <b>Площадь:</b><br>{client.area}<br>
                    <b>Стиль:</b><br>{client.style}<br>
                    <b>Бюджет:</b><br>{client.budget}<br>
                    <b>Примечания:</b><br>{client.comment}<br>
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="font-size: 14px; color: #777; margin: 0;">
                     <em>Vernicodov team</em>
                    </p>
                </div>
            </body>
        </html>
        """

    msg = EmailMessage()
    txt = f"{client.name}! Ваша заявка принята. Мы свяжемся с вами в ближайшее время."
    msg.set_content(txt)
    msg.add_alternative(html_content, subtype='html')
    msg['Subject'] = 'Тема'
    msg['From'] = SMTP_CONFIG["username"]
    msg['To'] = client.email

    for attempt in range(2):
        try:
            async with aiosmtplib.SMTP(
                hostname=SMTP_CONFIG["hostname"],
                port=SMTP_CONFIG["port"],
                timeout=10
            ) as smtp:
                await smtp.login(
                    SMTP_CONFIG["username"],
                    SMTP_CONFIG["password"]
                )
                await smtp.send_message(msg)
            return True  # Успех

        except Exception as e:
            print(e)
            if attempt == 1:
                return False
            import asyncio
            await asyncio.sleep(1)