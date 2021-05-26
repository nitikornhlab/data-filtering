export const dbConditionFilter = [
  {
    role: 'USER',
    api: '/user/:id',
    filterWithColumn: 'AppUserId',
    compareWith: 'userId',
  },
  {
    role: 'USER',
    api: '/user/:id',
    filterWithColumn: 'OrgId',
    compareWith: 'orgId',
  },
  {
    role: 'ADMIN',
    api: '/user/:id',
    filterWithColumn: 'OrgId',
    compareWith: 'orgId',
  },
  {
    role: 'ADMIN',
    api: '/user/:id',
    filterWithColumn: 'Department',
    compareWith: 'department',
  },
  ,
  {
    role: 'USER',
    api: '/join/:id',
    filterWithColumn: 'Salesrep',
    compareWith: 'userId',
  },
];
