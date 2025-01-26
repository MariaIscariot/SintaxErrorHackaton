from enum import Enum

from pydantic import BaseModel


class GetArticleInfoRequest(BaseModel):
    link: str


class GetArticleInfoFilterRequest(BaseModel):
    filter: float


class GetArticleClickbaitScoreRequest(BaseModel):
    content: str
    contentUri: str
    language: str

    def to_json(self):
        return {k: (v if not isinstance(v, Enum) else v.value) for k, v in self.__dict__.items()}


class MetaRequest(BaseModel):
    news_url: str
    lang: str


class ClickbaitRequest(BaseModel):
    news_url: str
    lang: str


class QualityScoreRequest(BaseModel):
    news_url: str
    lang: str


class FakeRequest(BaseModel):
    news_url: str = ""
    lang: str = ""
    content: str = ""


class PsychoRequest(BaseModel):
    news_url: str = ""
    lang: str = ""
