from datetime import datetime
from enum import Enum

from pydantic import BaseModel


class IptcClassification(Enum):
    ECONOMY_BUSINESS = "economy, business and finance",
    ARTS_CULTURE = "arts, culture and entertainment",
    SCIENCE = "science and technology",
    ENVIRONMENT = "environmental issue",


class ArticleClickbait(BaseModel):
    clickbaitScore: float

    def to_json(self):
        return {k: (v if not isinstance(v, Enum) else v.value) for k, v in self.__dict__.items()}

    @classmethod
    def from_json(cls, data: dict):
        return cls(**data)


class ArticleMetadata(BaseModel):
    author: str
    publishDate: str
    source: str
    title: str

    def to_json(self):
        return {k: (v if not isinstance(v, Enum) else v.value) for k, v in self.__dict__.items()}

    @classmethod
    def from_json(cls, data: dict):
        return cls(**data)


class JsonModel(BaseModel):
    def to_json(self):
        return {k: (v if not isinstance(v, Enum) else v.value) for k, v in self.__dict__.items()}

    @classmethod
    def from_json(cls, data: dict):
        return cls(**data)

    pass

class NodeLevel(JsonModel):
    id: str
    url: str
    parentId: str
    parentUrl: str
    publishedTime: datetime

class GraphNode(JsonModel):
    level: int
    articleGraphNodes: list[NodeLevel]



class ArticleGraph(JsonModel):
    id: str
    graphNodes: list[GraphNode]


class ArticlePatientZero(JsonModel):
    patientZeroUrl: str
class IptcClassificationType(JsonModel):
    type: str
    score: float
class IptcClassify(JsonModel):
    classes: list[IptcClassificationType]

class ArticleIptcClassification(JsonModel):
    classify: IptcClassify
    content:str

