from pydantic import BaseModel
import typing as t


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str = None
    permissions: str = "user"


class UserBase(BaseModel):
    email: str
    is_active: bool = True
    is_superuser: bool = False
    first_name: str = None
    last_name: str = None


class UserOut(UserBase):
    pass


class UserCreate(UserBase):
    password: str

    class Config:
        orm_mode = True


class UserEdit(BaseModel):
    """All fiels are optional on edit."""

    email: t.Optional[str] = None
    is_active: t.Optional[bool] = None
    is_superuser: t.Optional[bool] = None
    first_name: t.Optional[str] = None
    last_name: t.Optional[str] = None
    password: t.Optional[str] = None

    class Config:
        orm_mode = True


class User(UserBase):
    id: int

    class Config:
        orm_mode = True


class UserWithToken(User):
    token: Token
