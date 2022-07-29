import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS_SU_ADMIN: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'grid',
    link: '/ps/dashboard',
    home: true,
  },
  {
    title: 'Tickets',
    icon: 'flash',
    link: '/ps/tickets',
  },
  {
    title: 'Todos',
    icon: 'checkmark-square-outline',
    link: '/ps/todos',
  },
  {
    title: 'Settings',
    icon: 'settings-2-outline',
    expanded: false,
    children: [
      {
        title: 'Notification',
        link: '/ps/notification',
      },
      {
        title: 'Change Theme',
        link: '/ps/profile',
      }
    ],
  },
  {
    title: 'ADMIN',
    group: true,
  },
  // {
  //   title: 'Organization',
  //   link: '/ps/org',
  //   icon: 'cube',
  // },
  {
    title: 'Teams',
    link: '/ps/teams',
    icon: 'pantone',
  },
  {
    title: 'Members',
    link: '/ps/users',
    icon: 'people',
  }
];

export const MENU_ITEMS_ADMIN: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'grid',
    link: '/ps/dashboard',
    home: true,
  },
  {
    title: 'Tickets',
    icon: 'flash',
    link: '/ps/tickets',
  },
  {
    title: 'Todos',
    icon: 'checkmark-square-outline',
    link: '/ps/todos',
  },
  {
    title: 'Settings',
    icon: 'settings-2-outline',
    expanded: false,
    children: [
      {
        title: 'Notification',
        link: '/ps/notification',
      },
      {
        title: 'Change Theme',
        link: '/ps/profile',
      }
    ],
  },
  {
    title: 'ADMIN',
    group: true,
  },
  {
    title: 'Teams',
    link: '/ps/teams',
    icon: 'pantone',
  },
  {
    title: 'Members',
    link: '/ps/users',
    icon: 'people',
  }
];

export const MENU_ITEMS_MEMBER: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'grid',
    link: '/ps/dashboard',
    home: true,
  },
  {
    title: 'Tickets',
    icon: 'flash',
    link: '/ps/tickets',
  },
  {
    title: 'Todos',
    icon: 'checkmark-square-outline',
    link: '/ps/todos',
  },
  {
    title: 'Settings',
    icon: 'settings-2-outline',
    expanded: false,
    children: [
      {
        title: 'Notification',
        link: '/ps/notification',
      },
      {
        title: 'Change Theme',
        link: '/ps/profile',
      }
    ],
  }
];
