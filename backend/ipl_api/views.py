from rest_framework.decorators import api_view
from rest_framework.response import Response
from .mongodb import get_matches_collection, get_deliveries_collection

@api_view(['GET'])
def matches_per_year(request):
    matches = get_matches_collection()
    
    pipeline = [
        {'$group': {'_id': '$season', 'count': {'$sum': 1}}},
        {'$sort': {'_id': 1}}
    ]
    
    results = list(matches.aggregate(pipeline))
    
    return Response({
        'labels': [str(r['_id']) for r in results],
        'values': [r['count'] for r in results]
    })


@api_view(['GET'])
def matches_won_per_team(request):
    matches = get_matches_collection()
    
    seasons = sorted(matches.distinct('season'))
    teams = sorted(matches.distinct('winner', {'winner': {'$ne': None}}))
    
    datasets = []
    for season in seasons:
        season_data = []
        for team in teams:
            count = matches.count_documents({'season': season, 'winner': team})
            season_data.append(count)
        
        datasets.append({'label': str(season), 'data': season_data})
    
    return Response({'labels': teams, 'datasets': datasets})


@api_view(['GET'])
def extra_runs_per_team(request, year):
    matches = get_matches_collection()
    deliveries = get_deliveries_collection()
    
    match_ids = [m['id'] for m in matches.find({'season': year}, {'id': 1})]
    
    pipeline = [
        {'$match': {'match_id': {'$in': match_ids}}},
        {'$group': {
            '_id': '$bowling_team',
            'extra_runs_conceded': {'$sum': '$extra_runs'}
        }},
        {'$sort': {'extra_runs_conceded': -1}}
    ]
    
    results = list(deliveries.aggregate(pipeline))
    
    return Response({
        'labels': [r['_id'] for r in results],
        'values': [r['extra_runs_conceded'] for r in results]
    })


@api_view(['GET'])
def top_economical_bowlers(request, year):
    matches = get_matches_collection()
    deliveries = get_deliveries_collection()
    
    match_ids = [m['id'] for m in matches.find({'season': year}, {'id': 1})]
    
    bowler_stats = {}
    for delivery in deliveries.find({'match_id': {'$in': match_ids}}):
        bowler = delivery['bowler']
        if bowler not in bowler_stats:
            bowler_stats[bowler] = {'runs': 0, 'balls': 0}
        
        bowler_stats[bowler]['runs'] += delivery['total_runs']
        if delivery['wide_runs'] == 0 and delivery['noball_runs'] == 0:
            bowler_stats[bowler]['balls'] += 1
    
    economy_rates = []
    for bowler, stats in bowler_stats.items():
        if stats['balls'] >= 24:
            overs = stats['balls'] / 6.0
            economy = stats['runs'] / overs if overs > 0 else 0
            economy_rates.append({'bowler': bowler, 'economy': round(economy, 2)})
    
    economy_rates.sort(key=lambda x: x['economy'])
    top_10 = economy_rates[:10]
    
    return Response({
        'labels': [b['bowler'] for b in top_10],
        'values': [b['economy'] for b in top_10]
    })


@api_view(['GET'])
def matches_played_vs_won(request, year):
    matches_coll = get_matches_collection()
    
    team_stats = {}
    
    for match in matches_coll.find({'season': year}):
        for team in [match['team1'], match['team2']]:
            if team not in team_stats:
                team_stats[team] = {'played': 0, 'won': 0}
            team_stats[team]['played'] += 1
            if match.get('winner') == team:
                team_stats[team]['won'] += 1
    
    teams = sorted(team_stats.keys())
    
    return Response({
        'labels': teams,
        'datasets': [
            {'label': 'Matches Played', 'data': [team_stats[t]['played'] for t in teams]},
            {'label': 'Matches Won', 'data': [team_stats[t]['won'] for t in teams]}
        ]
    })


@api_view(['GET'])
def available_years(request):
    matches = get_matches_collection()
    years = sorted(matches.distinct('season'))
    return Response(years)
