/**
 * Check if user has permission inside a project/team
 */
export const hasPermission = ({teams = [], projectId, permission}) => {
  return teams.some(
    t => t.projectId === projectId && t.permissions?.includes(permission),
  );
};

/**
 * Check role in project
 */
export const hasRole = ({teams = [], projectId, role}) => {
  return teams.some(t => t.projectId === projectId && t.role === role);
};
