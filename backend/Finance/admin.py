from django.contrib import admin
from .models import *

# Register your models here.

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', "created_at", "updated_at")
    date_hierarchy = 'created_at'
    ordering = ('name',)
    search_fields = ('name',)
    list_display_links = ('name',)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'Category', 'value', "transaction_type", 'created_at', 'updated_at')
    date_hierarchy = 'created_at'
    ordering = ('created_at',)
    search_fields = ('user', 'Category__name', "transaction_type")
    fieldsets = (
    ("User", {
        'fields': ('user',)
    }),
    ("Transaction", {
        "fields": ("category", "value", "transaction_type")
    }))
    def Category(self, obj):
        return obj.category
    Category.empty_value_display = "None"
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', "is_staff", "is_active", "created_at", "updated_at")
    date_hierarchy = 'created_at'
    ordering = ('username',)
    search_fields = ('username', "is_staff", "is_active")
    fieldsets = (
    ("Informations", {
        "fields": ("username", "first_name", "last_name", "email", "password"),
    }),
    ("Permissions", {
        "fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")
    })
    )