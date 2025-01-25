import requests
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.models import ArticleInfo, IptcClassification, ArticleMeta
from core.requestModels import GetArticleClickbaitScoreRequest
from core.trustModels import ArticleClickbait, ArticleMetadata, ArticleGraph, ArticlePatientZero, \
    ArticleIptcClassification

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
request_body = GetArticleClickbaitScoreRequest(content="EMPTY",
                                               contentUri="https://www.ziarulprofit.ro/cine-sunt-noii-parlamentari-de-arges-lista-completa/",
                                               language="ron")
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
        metadata=ArticleMeta(author=articleMetadataModel.author, publish_at=articleMetadataModel.publishDate,
            source=articleMetadataModel.source, title=articleMetadataModel.title, ), article_graph_list=articleGraph,
        patient_zero_url=patient_zero_url, iptc_classification=iptc_classification_list.classify.classes,
        content=iptc_classification_list.content,
                          similar_article_url_list=["https://www.example.com/similar_article"],
                            img_url="https://www.example.com/image.jpg"
                          )
    return article.to_json()


def response(endpoint: str):
    return requests.post("{0}{1}".format(base_url, endpoint), json=request_body.to_json(), headers=base_headers)


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
