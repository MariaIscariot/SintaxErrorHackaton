from datetime import datetime
from enum import Enum

from core.trustModels import ArticleGraph, IptcClassification, IptcClassificationType


class ArticleMeta:
    def __init__(self, author, source, publish_at,title):
        self.author = author
        self.source = source
        self.publish_at = publish_at
        self.title = title

    def to_json(self):
        return {k: (v if not isinstance(v, Enum) else v.value) for k, v in self.__dict__.items()}


class ArticleInfo:
    def __init__(self, img_url: str, content: str, clickbait_score: float,
                 similar_article_url_list: list[str], iptc_classification: list[IptcClassificationType],
                 metadata: ArticleMeta, article_graph_list: ArticleGraph,
                 patient_zero_url: str):
        self.patient_zero_url = patient_zero_url
        self.article_graph_list = article_graph_list
        self.img_url = img_url
        self.content = content
        self.clickbait_score = clickbait_score
        self.similar_article_url_list = similar_article_url_list
        self.iptc_classification = iptc_classification
        self.metadata = metadata


    def to_json(self):
        return {k: (v if not isinstance(v, Enum) else v.value) for k, v in self.__dict__.items()}

