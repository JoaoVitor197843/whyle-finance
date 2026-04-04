from django.contrib import admin
from .models import *

# Register your models here.

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',"transaction_type", "created_at", "updated_at")
    date_hierarchy = 'created_at'
    ordering = ('name',)
    search_fields = ('name', "transaction_type")
    list_display_links = ('name',)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'Category', 'value', "transaction_type", 'created_at', 'updated_at')
    date_hierarchy = 'created_at'
    ordering = ('created_at',)
    search_fields = ('user__username', 'user__email', 'user__first_name', 'category__name', "transaction_type")
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
    list_display = ('username',"is_verified", "is_staff", "created_at", "updated_at")
    date_hierarchy = 'created_at'
    ordering = ('username',)
    search_fields = ('username',)
    list_filter = ("is_staff", "is_verified")
    fieldsets = (
    ("Informations", {
        "fields": ("username", "first_name", "last_name", "email", "password"),
    }),
    ("Permissions", {
        "fields": ("is_verified", "is_staff", "is_superuser", "groups", "user_permissions")
    })
    )
    readonly_fields = ('email', 'password')