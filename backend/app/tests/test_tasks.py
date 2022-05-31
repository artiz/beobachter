from app import tasks


async def test_example_task():
    task_output = await tasks.example_task("Hello World")
    assert task_output == "test task returns Hello World"
