// main.dart
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

void main() {
  runApp(BudgetTrackerApp());
}

class BudgetTrackerApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Budget Tracker',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: BudgetHomePage(),
    );
  }
}

class Expense {
  final String id;
  final double amount;
  final String description;
  final String category;
  final DateTime date;

  Expense({
    required this.id,
    required this.amount,
    required this.description,
    required this.category,
    required this.date,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'amount': amount,
      'description': description,
      'category': category,
      'date': date.toIso8601String(),
    };
  }

  factory Expense.fromJson(Map<String, dynamic> json) {
    return Expense(
      id: json['id'],
      amount: json['amount'].toDouble(),
      description: json['description'],
      category: json['category'],
      date: DateTime.parse(json['date']),
    );
  }
}

class BudgetHomePage extends StatefulWidget {
  @override
  _BudgetHomePageState createState() => _BudgetHomePageState();
}

class _BudgetHomePageState extends State<BudgetHomePage> {
  int _currentIndex = 0;
  List<Expense> expenses = [];
  Map<String, double> budgets = {};
  String userName = '';

  final List<String> categories = [
    'Rent',
    'Maintenance',
    'Grocery (Bulk)',
    'Grocery (Daily)',
    'Gym Trainer',
    'House Help',
    'Car EMI',
    'Utilities',
    'Family payment',
    'Home Loan EMI',
    'Personal Loan EM
