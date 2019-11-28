import time
import logging
import requests
import pandas as pd

logger = logging.getLogger(__name__)

API_KEY = 'xxx'

def get_artist_tags(results_list, mbid):
    return [{'mbid': mbid, **x} for x in results_list.get('toptags', {}).get('tag', [])]


def get_tags(mbids, api_key):
    artist_tags = []
    i = 0

    for mbid in mbids:

        if (i % 10) == 0:
            logger.info(i)

        r = requests.get(
            'https://ws.audioscrobbler.com/2.0/?method=artist.gettoptags'
            f'&mbid={mbid}&api_key={api_key}&format=json'
        )

        artist_tags += get_artist_tags(r.json(), mbid)

        i += 1
        time.sleep(0.05)

    return pd.DataFrame(artist_tags)
