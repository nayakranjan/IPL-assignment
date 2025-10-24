from django.contrib import admin
from .models import Match, Delivery


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ['id', 'season', 'date', 'team1', 'team2', 'winner']
    list_filter = ['season', 'winner']
    search_fields = ['team1', 'team2', 'winner', 'venue']


@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ['match_id', 'inning', 'batting_team', 'bowling_team', 'bowler', 'batsman']
    list_filter = ['batting_team', 'bowling_team']
    search_fields = ['bowler', 'batsman']
