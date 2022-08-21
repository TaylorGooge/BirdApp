/* eslint-disable max-len */
'use strict';

const helpers = require('../Scripts/helpers');

const logged = [{'englishName': 'Northern Cardinal', 'date': '2022-08-21T03:32:56.000Z', 'userName':
'thebeek', 'birdID': 2220, 'coordA': '-84.27300297005132', 'coordB': '30.4511129168255', 'id': 36, 'userID': 1},
{'englishName': 'Northern Cardinal', 'date': '2022-08-21T03:29:56.000Z', 'userName': 'thebeek', 'birdID': 2220,
  'coordA': '-84.2733835595274', 'coordB': '30.449551016553215', 'id': 35, 'userID': 1},
{'englishName': 'Blue-and-white Mockingbird', 'date': '2022-08-21T03:28:52.000Z', 'userName': 'thebeek',
  'birdID': 1347, 'coordA': '-84.27402168036011', 'coordB': '30.44956074229009', 'id': 34, 'userID': 1},
{'englishName': 'House Finch', 'date': '2022-08-21T03:22:48.000Z', 'userName': 'thebeek', 'birdID': 1931,
  'coordA': '-84.27584215865524', 'coordB': '30.450991331114242', 'id': 33, 'userID': 1}, {'englishName':
'American Three-toed Woodpecker', 'date': '2022-08-21T03:22:36.000Z', 'userName': 'thebeek', 'birdID':
1100, 'coordA': '-84.27583939723188', 'coordB': '30.45099137492905', 'id': 32, 'userID': 1}];

const result = {
  'type': 'FeatureCollection',
  'features': [
    {
      'properties': {
        'englishName': 'Northern Cardinal',
        'date': '2022-08-21T03:32:56.000Z',
        'userName': 'thebeek',
        'birdID': 2220,
        'coordA': '-84.27300297005132',
        'coordB': '30.4511129168255',
        'id': 36,
        'userID': 1,
      },
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [
          -84.27300297005132,
          30.4511129168255,
        ],
      },
    },
    {
      'properties': {
        'englishName': 'Northern Cardinal',
        'date': '2022-08-21T03:29:56.000Z',
        'userName': 'thebeek',
        'birdID': 2220,
        'coordA': '-84.2733835595274',
        'coordB': '30.449551016553215',
        'id': 35,
        'userID': 1,
      },
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [
          -84.2733835595274,
          30.449551016553215,
        ],
      },
    },
    {
      'properties': {
        'englishName': 'Blue-and-white Mockingbird',
        'date': '2022-08-21T03:28:52.000Z',
        'userName': 'thebeek',
        'birdID': 1347,
        'coordA': '-84.27402168036011',
        'coordB': '30.44956074229009',
        'id': 34,
        'userID': 1,
      },
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [
          -84.27402168036011,
          30.44956074229009,
        ],
      },
    },
    {
      'properties': {
        'englishName': 'House Finch',
        'date': '2022-08-21T03:22:48.000Z',
        'userName': 'thebeek',
        'birdID': 1931,
        'coordA': '-84.27584215865524',
        'coordB': '30.450991331114242',
        'id': 33,
        'userID': 1,
      },
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [
          -84.27584215865524,
          30.450991331114242,
        ],
      },
    },
    {
      'properties': {
        'englishName': 'American Three-toed Woodpecker',
        'date': '2022-08-21T03:22:36.000Z',
        'userName': 'thebeek',
        'birdID': 1100,
        'coordA': '-84.27583939723188',
        'coordB': '30.45099137492905',
        'id': 32,
        'userID': 1,
      },
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [
          -84.27583939723188,
          30.45099137492905,
        ],
      },
    },
  ],
};

test('', () => {
  const value = helpers.toGeoJson(logged);
  expect(value).toMatchObject(result);
});
