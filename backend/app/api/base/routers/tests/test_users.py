from app.db import models
from sqlalchemy.future import select


async def test_delete_user(client, test_superuser, test_db, superuser_token_headers):
    response = await client.delete(f"/api/users/{test_superuser.id}", headers=superuser_token_headers)
    assert response.status_code == 200
    assert (await test_db.execute(select(models.User).filter(models.User.id == test_superuser.id))).all() == []


async def test_delete_user_not_found(client, superuser_token_headers):
    response = await client.delete("/api/users/4321", headers=superuser_token_headers)
    assert response.status_code == 404


async def test_edit_user(client, test_superuser, superuser_token_headers):
    new_user = {
        "email": "newemail@email.com",
        "is_active": False,
        "is_superuser": True,
        "first_name": "Joe",
        "last_name": "Smith",
        "password": "new_password",
    }

    response = await client.put(
        f"/api/users/{test_superuser.id}",
        json=new_user,
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    new_user["id"] = test_superuser.id
    new_user.pop("password")
    assert response.json() == new_user


async def test_edit_user_not_found(client, test_db, superuser_token_headers):
    new_user = {
        "email": "newemail@email.com",
        "is_active": False,
        "is_superuser": False,
        "password": "new_password",
    }
    response = await client.put("/api/users/1234", json=new_user, headers=superuser_token_headers)
    assert response.status_code == 404


async def test_get_user(
    client,
    test_user,
    superuser_token_headers,
):
    response = await client.get(f"/api/users/{test_user.id}", headers=superuser_token_headers)
    assert response.status_code == 200
    assert response.json() == {
        "id": test_user.id,
        "email": test_user.email,
        "is_active": bool(test_user.is_active),
        "is_superuser": test_user.is_superuser,
    }


async def test_user_not_found(client, superuser_token_headers):
    response = await client.get("/api/users/123", headers=superuser_token_headers)
    assert response.status_code == 404


async def test_authenticated_user_me(client, user_token_headers):
    response = await client.get("/api/users/me", headers=user_token_headers)
    assert response.status_code == 200


async def test_unauthenticated_routes(client):
    response = await client.get("/api/users/me")
    assert response.status_code == 401
    response = await client.get("/api/users")
    assert response.status_code == 401
    response = await client.get("/api/users/123")
    assert response.status_code == 401
    response = await client.put("/api/users/123")
    assert response.status_code == 401
    response = await client.delete("/api/users/123")
    assert response.status_code == 401


async def test_unauthorized_routes(client, user_token_headers):
    response = await client.get("/api/users", headers=user_token_headers)
    assert response.status_code == 403
    response = await client.get("/api/users/123", headers=user_token_headers)
    assert response.status_code == 403
