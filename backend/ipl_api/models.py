from django.db import models

class Match(models.Model):
    id = models.IntegerField(primary_key=True)
    season = models.IntegerField()
    city = models.CharField(max_length=100, null=True, blank=True)
    date = models.DateField()
    team1 = models.CharField(max_length=100)
    team2 = models.CharField(max_length=100)
    toss_winner = models.CharField(max_length=100)
    toss_decision = models.CharField(max_length=50)
    result = models.CharField(max_length=50)
    dl_applied = models.IntegerField(default=0)
    winner = models.CharField(max_length=100, null=True, blank=True)
    win_by_runs = models.IntegerField(default=0)
    win_by_wickets = models.IntegerField(default=0)
    player_of_match = models.CharField(max_length=100, null=True, blank=True)
    venue = models.CharField(max_length=200)
    umpire1 = models.CharField(max_length=100, null=True, blank=True)
    umpire2 = models.CharField(max_length=100, null=True, blank=True)
    umpire3 = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = 'matches'
        verbose_name_plural = 'Matches'

    def __str__(self):
        return f"{self.team1} vs {self.team2} - {self.season}"


class Delivery(models.Model):
    match_id = models.IntegerField()
    inning = models.IntegerField()
    batting_team = models.CharField(max_length=100)
    bowling_team = models.CharField(max_length=100)
    over = models.IntegerField()
    ball = models.IntegerField()
    batsman = models.CharField(max_length=100)
    non_striker = models.CharField(max_length=100)
    bowler = models.CharField(max_length=100)
    is_super_over = models.IntegerField(default=0)
    wide_runs = models.IntegerField(default=0)
    bye_runs = models.IntegerField(default=0)
    legbye_runs = models.IntegerField(default=0)
    noball_runs = models.IntegerField(default=0)
    penalty_runs = models.IntegerField(default=0)
    batsman_runs = models.IntegerField(default=0)
    extra_runs = models.IntegerField(default=0)
    total_runs = models.IntegerField(default=0)
    player_dismissed = models.CharField(max_length=100, null=True, blank=True)
    dismissal_kind = models.CharField(max_length=50, null=True, blank=True)
    fielder = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = 'deliveries'
        verbose_name_plural = 'Deliveries'
        indexes = [
            models.Index(fields=['match_id']),
            models.Index(fields=['batting_team']),
            models.Index(fields=['bowling_team']),
            models.Index(fields=['bowler']),
        ]

    def __str__(self):
        return f"Match {self.match_id} - {self.batting_team} vs {self.bowling_team}"
