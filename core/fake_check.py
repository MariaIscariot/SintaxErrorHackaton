import re
import string

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

vectorization = joblib.load('vectorization.pkl')
RF = joblib.load('RF.pkl')


def wordopt(text):
    text = text.lower()
    text = re.sub('\[.*?\]', '', text)
    text = re.sub("\\W", " ", text)
    text = re.sub('https?://\S+|www\.\S+', '', text)
    text = re.sub('<.*?>+', b'', text)
    text = re.sub('[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub('\w*\d\w*', '', text)
    return text


def output_lable(n):
    if n == 0:
        return "Fake News"
    elif n == 1:
        return "Trustfull news"


def manual_testing_rf(news):
    testing_news = {"text": [news]}
    new_def_test = pd.DataFrame(testing_news)
    new_def_test['text'] = new_def_test["text"].apply(wordopt)
    new_x_test = new_def_test["text"]
    new_xv_test = vectorization.transform(new_x_test)
    # pred_LR = LR.predict(new_xv_test)
    # pred_DT = DT.predict(new_xv_test)
    # pred_GB = GB.predict(new_xv_test)
    pred_rf = RF.predict(new_xv_test)
    result: int = pred_rf[0]
    # print("\nRF Prediction: {}".format(output_lable(result)))
    return result
