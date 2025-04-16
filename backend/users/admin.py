from django.contrib import admin
from .models import Profile, LoanRequest

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user',)  # Remove 'bio' and 'location' if they don't exist

@admin.register(LoanRequest)
class LoanRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username',)
