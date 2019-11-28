import requests
import logging
import time

import pandas as pd

logger = logging.getLogger(__name__)

# logging.basicConfig(level='INFO')

def extract_useful_items(response_list):
    return [
        {
            'track_name': track.get('name'),
            'artist_name': track.get('artist', {}).get('#text'),
            'album_name': track.get('album', {}).get('#text'),
            'uts': track.get('date', {}).get('uts'),
            'track_mbid': track.get('mbid'),
            'artist_mbid': track.get('artist', {}).get('mbid'),
            'album_mbid': track.get('album', {}).get('mbid'),
        }
        for track in response_list.get('recenttracks', {}).get('track', {})
    ]


def get_one_uts(response_list):
    tracks = response_list.get('recenttracks').get('track')
    if tracks is not None and len(tracks) > 0:
        return tracks[0].get('date', {}).get('uts')
    else:
        return 'no list'


def get_attrs(response_list):
    return response_list.get('recenttracks').get('@attr')


def get_tracks():
    tracks = []
    to_uts = 1340113205

    for page in range(1, 398):

        logger.info(f'Page: {page}')

        r = requests.get(
            'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks'
            f'&user=xndrxx&api_key={API_KEY}&format=json&extended=0&limit=200&page={page}&to={to_uts}'
        )
        response_list = r.json()

        logger.info(f'Attrs: {get_attrs(response_list)}')
        logger.info(f'UTS: {get_one_uts(response_list)}')

        tracks += extract_useful_items(response_list)
        logger.info(f'# tracks collected: {len(tracks)}')

        time.sleep(0.1)

    return pd.DataFrame(tracks)