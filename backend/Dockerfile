  
FROM python:3.9.12

# create the app user
RUN addgroup --system app && adduser --system --group app

RUN apt update
RUN apt install -y postgresql-client

RUN mkdir /app
WORKDIR /app/

# https://docs.python.org/3/using/cmdline.html#envvar-PYTHONDONTWRITEBYTECODE
# Prevents Python from writing .pyc files to disk
# ENV PYTHONDONTWRITEBYTECODE 1

# ensures that the python output is sent straight to terminal (e.g. your container log)
# without being first buffered and that you can see the output of your application (e.g. django logs)
# in real time. Equivalent to python -u: https://docs.python.org/3/using/cmdline.html#cmdoption-u
ENV PYTHONUNBUFFERED 1

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x app/run.sh

# chown all the files to the app user
RUN chown -R app:app .

# change to the app user
# Switch to a non-root user, which is recommended by Heroku.
USER app

EXPOSE 8000
