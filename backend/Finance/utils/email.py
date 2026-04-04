import os
import resend
from django.template.loader import render_to_string
from typing import Any
resend.api_key= os.getenv("RESEND_API_KEY")
email = os.getenv("RESEND_EMAIL")

def send_email(to_email: str, subject: str, html_name: str, context: dict[str, Any]):
    html = render_to_string(f'email/{html_name}.html', context)
    params = {
        "from": f'WhyleFinance <{email}>',
        "to": [to_email],
        "subject": subject,
        "html": html
    }
    return resend.Emails.send(params)