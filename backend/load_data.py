#!/usr/bin/env python
import os
import sys
import django
import pandas as pd


sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ipl_project.settings')
django.setup()

from ipl_api.mongodb import get_matches_collection, get_deliveries_collection


def load_matches(csv_file):
    print(f"Loading matches from {csv_file}...")
    
    matches_coll = get_matches_collection()
    matches_coll.delete_many({})  
    
    df = pd.read_csv(csv_file)
    
    batch = []
    for idx, row in df.iterrows():
        try:
            match = {
                'id': int(row['id']),
                'season': int(row['season']),
                'city': row['city'] if pd.notna(row['city']) else None,
                'date': row['date'],
                'team1': row['team1'],
                'team2': row['team2'],
                'toss_winner': row['toss_winner'],
                'toss_decision': row['toss_decision'],
                'result': row['result'],
                'dl_applied': int(row['dl_applied']),
                'winner': row['winner'] if pd.notna(row['winner']) else None,
                'win_by_runs': int(row['win_by_runs']),
                'win_by_wickets': int(row['win_by_wickets']),
                'player_of_match': row['player_of_match'] if pd.notna(row['player_of_match']) else None,
                'venue': row['venue'],
                'umpire1': row['umpire1'] if pd.notna(row['umpire1']) else None,
                'umpire2': row['umpire2'] if pd.notna(row['umpire2']) else None,
                'umpire3': row['umpire3'] if pd.notna(row['umpire3']) else None,
            }
            batch.append(match)
            
            if len(batch) >= 100:
                matches_coll.insert_many(batch)
                print(f"  {len(batch)} matches inserted...")
                batch = []
                
        except Exception as e:
            print(f"Error on match {row['id']}: {e}")
            continue
    
    if batch:
        matches_coll.insert_many(batch)
    
    total = matches_coll.count_documents({})
    print(f"Done! {total} matches loaded.")


def load_deliveries(csv_file):
    print(f"Loading deliveries from {csv_file}...")
    
    deliveries_coll = get_deliveries_collection()
    deliveries_coll.delete_many({})
    
    df = pd.read_csv(csv_file)
    
    batch = []
    for _, row in df.iterrows():
        delivery = {
            'match_id': int(row['match_id']),
            'inning': int(row['inning']),
            'batting_team': row['batting_team'],
            'bowling_team': row['bowling_team'],
            'over': int(row['over']),
            'ball': int(row['ball']),
            'batsman': row['batsman'],
            'non_striker': row['non_striker'],
            'bowler': row['bowler'],
            'is_super_over': int(row['is_super_over']),
            'wide_runs': int(row['wide_runs']),
            'bye_runs': int(row['bye_runs']),
            'legbye_runs': int(row['legbye_runs']),
            'noball_runs': int(row['noball_runs']),
            'penalty_runs': int(row['penalty_runs']),
            'batsman_runs': int(row['batsman_runs']),
            'extra_runs': int(row['extra_runs']),
            'total_runs': int(row['total_runs']),
            'player_dismissed': row['player_dismissed'] if pd.notna(row['player_dismissed']) else None,
            'dismissal_kind': row['dismissal_kind'] if pd.notna(row['dismissal_kind']) else None,
            'fielder': row['fielder'] if pd.notna(row['fielder']) else None,
        }
        batch.append(delivery)
        
        if len(batch) >= 1000:
            deliveries_coll.insert_many(batch)
            print(f"  {len(batch)} deliveries inserted...")
            batch = []
    
    if batch:
        deliveries_coll.insert_many(batch)
    
    total = deliveries_coll.count_documents({})
    print(f"Done! {total} deliveries loaded.")


def main():
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    
    if not os.path.exists(data_dir):
        print(f"Error: data directory not found at {data_dir}")
        print("Create a 'data' folder and put matches.csv and deliveries.csv in it")
        print("Get dataset from: https://www.kaggle.com/manasgarg/ipl")
        return
    
    matches_file = os.path.join(data_dir, 'matches.csv')
    deliveries_file = os.path.join(data_dir, 'deliveries.csv')
    
    if not os.path.exists(matches_file):
        print(f"Error: {matches_file} not found")
        return
    
    if not os.path.exists(deliveries_file):
        print(f"Error: {deliveries_file} not found")
        return
    
    print("\n" + "="*60)
    print("Starting IPL data load...")
    print("="*60 + "\n")
    
    load_matches(matches_file)
    print()
    load_deliveries(deliveries_file)
    
    print("\n" + "="*60)
    print("All done!")
    print("="*60 + "\n")


if __name__ == '__main__':
    main()
