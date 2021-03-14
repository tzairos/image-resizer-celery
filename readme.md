# Async Image Resizer React + Celeris

It's a test project to understand how to use Celeris.

# Prerequisites

- install Celeris ( I used Redis as mb, so this command installs celeris with Redis adapter for python)
  `pip install -U "celery[redis]"`

- I chose Redis for message broker.
  `docker run -d -p 6379:6379 redis`

# Test

To start project use the code:

`python web-server.py`

It will start serving on port 3000.
