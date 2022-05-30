import logging
from app.core.config import settings


def test_main_get_root(client):

    response = client.get("/api/")
    assert response.status_code == 200
    assert response.json() == {
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
    }
