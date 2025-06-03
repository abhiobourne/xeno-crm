import React, { useState } from 'react';
import { Rule, RuleGroup } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const operators = ['>', '<', '=', '>=', '<='];
const fields = ['spend', 'visits', 'inactive_days'];

interface RuleBuilderProps {
  value: RuleGroup;
  onChange: (value: RuleGroup) => void;
}

export const RuleBuilder: React.FC<RuleBuilderProps> = ({ value, onChange }) => {
  const addRule = (parentId: string) => {
    const newRule: Rule = {
      id: uuidv4(),
      field: fields[0],
      operator: operators[0],
      value: '',
    };

    const updateRules = (group: RuleGroup): RuleGroup => {
      if (group.id === parentId) {
        return {
          ...group,
          rules: [...group.rules, newRule],
        };
      }

      return {
        ...group,
        rules: group.rules.map((rule) =>
          'combinator' in rule ? updateRules(rule) : rule
        ),
      };
    };

    onChange(updateRules(value));
  };

  const addGroup = (parentId: string) => {
    const newGroup: RuleGroup = {
      id: uuidv4(),
      combinator: 'AND',
      rules: [],
    };

    const updateRules = (group: RuleGroup): RuleGroup => {
      if (group.id === parentId) {
        return {
          ...group,
          rules: [...group.rules, newGroup],
        };
      }

      return {
        ...group,
        rules: group.rules.map((rule) =>
          'combinator' in rule ? updateRules(rule) : rule
        ),
      };
    };

    onChange(updateRules(value));
  };

  const updateRule = (ruleId: string, updates: Partial<Rule>) => {
    const updateRules = (group: RuleGroup): RuleGroup => {
      return {
        ...group,
        rules: group.rules.map((rule) => {
          if ('combinator' in rule) {
            return updateRules(rule);
          }
          if (rule.id === ruleId) {
            return { ...rule, ...updates };
          }
          return rule;
        }),
      };
    };

    onChange(updateRules(value));
  };

  const removeRule = (ruleId: string) => {
    const updateRules = (group: RuleGroup): RuleGroup => {
      return {
        ...group,
        rules: group.rules
          .filter((rule) => {
            if ('combinator' in rule) {
              return true;
            }
            return rule.id !== ruleId;
          })
          .map((rule) => ('combinator' in rule ? updateRules(rule) : rule)),
      };
    };

    onChange(updateRules(value));
  };

  const RuleGroupComponent: React.FC<{
    group: RuleGroup;
    level?: number;
  }> = ({ group, level = 0 }) => {
    return (
      <div className="p-4 border rounded-lg mb-2 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <select
            value={group.combinator}
            onChange={(e) =>
              onChange({
                ...group,
                combinator: e.target.value as 'AND' | 'OR',
              })
            }
            className="px-2 py-1 border rounded"
          >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
          <button
            onClick={() => addRule(group.id)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Rule
          </button>
          <button
            onClick={() => addGroup(group.id)}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Group
          </button>
        </div>
        <div className="ml-4">
          {group.rules.map((rule, index) => (
            <div key={rule.id}>
              {'combinator' in rule ? (
                <RuleGroupComponent group={rule} level={level + 1} />
              ) : (
                <div className="flex items-center gap-2 mb-2">
                  <select
                    value={rule.field}
                    onChange={(e) =>
                      updateRule(rule.id, { field: e.target.value })
                    }
                    className="px-2 py-1 border rounded"
                  >
                    {fields.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </select>
                  <select
                    value={rule.operator}
                    onChange={(e) =>
                      updateRule(rule.id, { operator: e.target.value })
                    }
                    className="px-2 py-1 border rounded"
                  >
                    {operators.map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={rule.value}
                    onChange={(e) =>
                      updateRule(rule.id, { value: e.target.value })
                    }
                    className="px-2 py-1 border rounded"
                    placeholder="Value"
                  />
                  <button
                    onClick={() => removeRule(rule.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return <RuleGroupComponent group={value} />;
}; 