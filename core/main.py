import random

import requests
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from core.clientModels import Meta, Clickbait, QualityScore, FakeNewsScore, MetaRec
from core.fake_check import manual_testing_rf
from core.models import ArticleInfo, IptcClassification, ArticleMeta
from core.psycho import analyze_text_with_ngrams, word_emotion_df
from core.requestModels import GetArticleClickbaitScoreRequest, MetaRequest, ClickbaitRequest, FakeRequest
from core.trustModels import ArticleClickbait, ArticleMetadata, ArticleGraph, ArticlePatientZero, \
    ArticleIptcClassification, ArticleTrustLevel

app = FastAPI()


@app.get("/")
async def read_root():
    article = ArticleInfo(img_url="https://www.example.com/image.jpg", title="Example Article",
                          content="This is an example article", clickbait_score=0.9, created_at="2022-01-01T12:00:00",
                          similar_article_url_list=["https://www.example.com/similar_article"],
                          iptc_classification=[IptcClassification.ECONOMY_BUSINESS, IptcClassification.ARTS_CULTURE],
                          metadata=ArticleMeta(author="John Doe", source="Example News"))
    return article.to_json()


@app.get("/infos")
async def read_roost():
    article = ArticleInfo(img_url="https://www.example.com/image.jpg", title="Example Article",
                          content="This is an example article", clickbait_score=0.9, created_at="2022-01-01T12:00:00",
                          similar_article_url_list=["https://www.example.com/similar_article"],
                          iptc_classification=[IptcClassification.ECONOMY_BUSINESS, IptcClassification.ARTS_CULTURE],
                          metadata=ArticleMeta(author="John Doe", source="Example News",
                                               publish_at="2022-01-01T12:00:00", title="Example Article"))
    return [article.to_json()]


@app.get("/admin")
async def read_admin():
    return {"message": "Hello Admin"}


app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"],
                   allow_headers=["*"],

                   )

api_key = "73a7ba20462a3fd35a763fc7ffc5ba10"
base_url = "https://app.trustservista.com/api/rest/v2/"
base_headers = {"Content-Type": "application/json", "Accept": "application/json", "X-TRUS-API-Key": api_key}


@app.get("/info")
async def read_info():
    # print(requests.post("https://0411-93-113-114-106.ngrok-free.app/info").json())
    articleClickbaitModel = ArticleClickbait.from_json(response("clickbait").json())
    articleMetadataModel = ArticleMetadata.from_json(response("metadata").json())
    articleGraph = ArticleGraph.from_json(response("graph").json())
    patient_zero_url = ArticlePatientZero.from_json(response("p0").json())
    iptc_classification_list = ArticleIptcClassification.from_json(response("classification/iptc").json())

    article = ArticleInfo(clickbait_score=articleClickbaitModel.clickbaitScore,
                          metadata=ArticleMeta(author=articleMetadataModel.author,
                                               publish_at=articleMetadataModel.publishDate,
                                               source=articleMetadataModel.source, title=articleMetadataModel.title, ),
                          article_graph_list=articleGraph, patient_zero_url=patient_zero_url,
                          iptc_classification=iptc_classification_list.classify.classes,
                          content=iptc_classification_list.content,
                          similar_article_url_list=["https://www.example.com/similar_article"],
                          img_url="https://www.example.com/image.jpg")
    return article.to_json()


def response(endpoint: str, url: str, lang: str, content: str = "EMPTY"):
    return requests.post("{0}{1}".format(base_url, endpoint),
                         json=GetArticleClickbaitScoreRequest(content=content, contentUri=url, language=lang).to_json(),
                         headers=base_headers)


@app.post("/meta")
async def read_meta(request: MetaRequest):
    article_meta = ArticleMetadata.from_json(response("metadata", request.news_url, request.lang).json())
    article_iptc = ArticleIptcClassification.from_json(
        response("classification/iptc", request.news_url, request.lang).json())
    meta = Meta(title=article_meta.title, author=article_meta.author, source=article_meta.source,
                publish_date=article_meta.publishDate, content=article_iptc.content)
    return meta.to_json()


@app.post("/clickbait")
async def read_clickbait(request: ClickbaitRequest):
    article_clickbait = ArticleClickbait.from_json(response("clickbait", request.news_url, request.lang).json())

    return Clickbait(percent=article_clickbait.clickbaitScore).to_json()


@app.post("/quality_score")
async def read_quality(request: ClickbaitRequest):
    article_clickbait = ArticleTrustLevel.from_json(response("trustlevel", request.news_url, request.lang).json())
    return QualityScore(percent=article_clickbait.trustLevel).to_json()


@app.post("/fake_check")
async def is_fake(request: FakeRequest):
    if request.content:
        result = manual_testing_rf(request.content)
    else:
        article_iptc = ArticleIptcClassification.from_json(
            response("classification/iptc", request.news_url, request.lang).json())
        content = article_iptc.content
        result = manual_testing_rf(content)
    if result:
        percent = random.randint(50, 100)
    else:
        percent = random.randint(0, 50)
    return FakeNewsScore(percent=percent).to_json()


@app.post("/psycho")
async def read_psycho(request: FakeRequest):
    if request.content:
        content = request.content
    else:
        article_iptc = ArticleIptcClassification.from_json(
            response("classification/iptc", request.news_url, request.lang).json())
        content = article_iptc.content

    psycho_map = analyze_text_with_ngrams(content, word_emotion_df, n=2)[0]

    # Sort the psycho_map by value
    sorted_psycho_map = dict(sorted(psycho_map.items(), key=lambda item: item[1], reverse=True))

    # Calculate the sum of all values
    total_value = sum(sorted_psycho_map.values())

    # Reformat values to percentages where the sum of all values is 100%
    percent_psycho_map = [{"emotion": k, "value": round((v / total_value), 4)} for k, v in sorted_psycho_map.items()]

    return JSONResponse(content=percent_psycho_map)

@app.post("/rec_one")
async def read_rec_one(request: MetaRequest):
    q = [
         ArticleMetadata.from_json(response("metadata", request.news_url, request.lang).json()),
         ArticleMetadata.from_json(response("metadata", request.news_url, request.lang).json()),
         ArticleMetadata.from_json(response("metadata", request.news_url, request.lang).json()),
    ]
    return [MetaRec(title=article.title, author=article.author, source=article.source,
                publish_date=article.publishDate, content="Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum", diagram_title="title", diagram_value=0.2).to_json() for article in q]


@app.post("/rec_two")
async def read_rec_two(request: MetaRequest):
    q = [
         ArticleMetadata.from_json(response("metadata", request.news_url, request.lang).json()),
         ArticleMetadata.from_json(response("metadata", request.news_url, request.lang).json()),
         ArticleMetadata.from_json(response("metadata", request.news_url, request.lang).json()),
    ]
    return [MetaRec(title=article.title, author=article.author, source=article.source,
                publish_date=article.publishDate, content="Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum", diagram_title="title2", diagram_value=0.77).to_json() for article in q]


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
