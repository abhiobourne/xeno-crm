import { NextResponse } from 'next/server';
import { RuleGroup } from '@/lib/types';

function evaluateRule(customer: any, rule: any): boolean {
  const { field, operator, value } = rule;
  const customerValue = customer[field];

  switch (operator) {
    case '>':
      return customerValue > Number(value);
    case '<':
      return customerValue < Number(value);
    case '=':
      return customerValue === Number(value);
    case '>=':
      return customerValue >= Number(value);
    case '<=':
      return customerValue <= Number(value);
    default:
      return false;
  }
}

function evaluateRuleGroup(customer: any, group: RuleGroup): boolean {
  const results = group.rules.map(rule => {
    if ('combinator' in rule) {
      return evaluateRuleGroup(customer, rule);
    }
    return evaluateRule(customer, rule);
  });

  return group.combinator === 'AND'
    ? results.every(Boolean)
    : results.some(Boolean);
}

export async function POST(request: Request) {
  try {
    const { rules } = await request.json();

    // Mock customer data for demonstration
    const mockCustomers = [
      { id: 1, spend: 15000, visits: 5, inactive_days: 30 },
      { id: 2, spend: 5000, visits: 2, inactive_days: 100 },
      { id: 3, spend: 25000, visits: 10, inactive_days: 15 },
      { id: 4, spend: 8000, visits: 4, inactive_days: 45 },
      { id: 5, spend: 3000, visits: 1, inactive_days: 120 },
    ];

    const matchingCustomers = mockCustomers.filter(customer =>
      evaluateRuleGroup(customer, rules)
    );

    return NextResponse.json({
      size: matchingCustomers.length,
    });
  } catch (error) {
    console.error('Error in preview endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 