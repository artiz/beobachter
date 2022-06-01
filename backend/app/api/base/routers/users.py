from email.policy import default
from fastapi import APIRouter, Request, Depends, Response, Query
from typing import List, Optional

from app.db.session import get_db
from app.db.crud import (
    get_users,
    get_user,
    create_user,
    delete_user,
    edit_user,
)
from app.core.schemas.schemas import UserCreate, UserEdit, User, UserWithToken
from app.core.net.auth import get_current_active_user, get_current_active_superuser
from app.core import security
from app.api.dependencies.common import get_log


users_router = r = APIRouter()


@r.get(
    "/users",
    response_model=List[User],
    response_model_exclude_none=True,
)
async def users_list(
    response: Response,
    db=Depends(get_db),
    offset: Optional[int] = Query(default=0),
    limit: Optional[int] = Query(default=0),
    _=Depends(get_current_active_superuser),
):
    """
    Get all users
    """
    users = await get_users(db, offset, limit)
    # This is necessary for react-admin to work
    response.headers["Content-Range"] = f"0-9/{len(users)}"
    return users


@r.get("/users/me", response_model=UserWithToken, response_model_exclude_none=True)
async def user_me(current_user=Depends(get_current_active_user)):
    """
    Get own user
    """

    access_token = security.create_access_token(current_user)
    return {
        **current_user.__dict__,
        "token": access_token,
    }


@r.get(
    "/users/{user_id}",
    response_model=User,
    response_model_exclude_none=True,
)
async def user_details(
    user_id: int,
    db=Depends(get_db),
    _=Depends(get_current_active_superuser),
):
    """
    Get any user details
    """
    user = await get_user(db, user_id)
    return user


@r.post("/users", response_model=User, response_model_exclude_none=True)
async def user_create(
    user: UserCreate,
    db=Depends(get_db),
    _=Depends(get_current_active_superuser),
):
    """
    Create a new user
    """
    return await create_user(db, user)


@r.put("/users/{user_id}", response_model=User, response_model_exclude_none=True)
async def user_edit(
    user_id: int,
    user: UserEdit,
    db=Depends(get_db),
    _=Depends(get_current_active_superuser),
):
    """
    Update existing user
    """
    return await edit_user(db, user_id, user)


@r.delete("/users/{user_id}", response_model=User, response_model_exclude_none=True)
async def user_delete(
    user_id: int,
    db=Depends(get_db),
    log=Depends(get_log),
    current_user=Depends(get_current_active_superuser),
):
    """
    Delete existing user
    """
    u = await delete_user(db, user_id)
    log.info(f"Deleted user {u.id} {u.email}")
    return u
