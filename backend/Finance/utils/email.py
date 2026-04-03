import os
import resend

resend.api_key=os.getenv("RESEND_API_KEY")
email = os.getenv("RESEND_EMAIL")

def send_email(to_email, subject, html):
    params = {
        "from": f'WhyleFinance <{email}>',
        "to": [to_email],
        "subject": subject,
        "html": html
    }
    return resend.Emails.send(params)