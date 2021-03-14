# Celeris

Celery is a simple, flexible, and reliable distributed system to process vast amounts of messages, while providing operations with the tools required to maintain such a system.

It’s a task queue with focus on real-time processing, while also supporting task scheduling.

Task queues are used as a mechanism to distribute work across threads or machines.

It adds an abstraction to the jobs related with Message Brokers.

## To install celeris as using Redis backend

You can use celeris+redis bundle package.

`pip install -U "celery[redis]"`

## Start Celeris Worker

It starts the worker, does all the connection things and waits for the job

`celery -A tasks worker --loglevel=INFO`

## Call the job

```
>>> from tasks import add
>>> add.delay(4, 4)
```

it returns an _AsyncResult_ to track the result

`<AsyncResult: fe5c03f5-1970-4fa9-9665-ed8d0ea9e967>`
