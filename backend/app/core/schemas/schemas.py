from pydantic import BaseModel, ConfigDict
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
    first_name: t.Optional[str] = None
    last_name: t.Optional[str] = None


class UserOut(UserBase):
    pass


class UserCreate(UserBase):
    model_config = ConfigDict(from_attributes=True)

    password: str


class UserEdit(BaseModel):
    """All fiels are optional on edit."""

    model_config = ConfigDict(from_attributes=True)

    email: t.Optional[str] = None
    is_active: t.Optional[bool] = None
    is_superuser: t.Optional[bool] = None
    first_name: t.Optional[str] = None
    last_name: t.Optional[str] = None
    password: t.Optional[str] = None


class User(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class UserWithToken(User):
    token: Token
