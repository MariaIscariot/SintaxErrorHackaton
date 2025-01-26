from core.trustModels import JsonModel


class Meta(JsonModel):
    title: str
    author: str
    source: str
    publish_date: str
    content: str


class MetaRec(JsonModel):
    title: str
    author: str
    source: str
    publish_date: str
    content: str
    diagram_title: str
    diagram_value: float


class Clickbait(JsonModel):
    percent: float


class QualityScore(JsonModel):
    percent: float


class FakeNewsScore(JsonModel):
    percent: float


class PsychoHook(JsonModel):
    emotion_group: str
    emotion: str
    percent: float


class NewsRecommendation(JsonModel):
    title: str
    author: str
    source: str
    publish_date: str
