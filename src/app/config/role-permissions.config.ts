import { Permission } from '../models/role.model';

export const ROLE_PERMISSIONS: Record<string, Record<string, Permission>> = {
      '4e5d5b7c-38db-11ee-be56-0242ac120002': { // Admin
            '/admin/dashboard': { view: true, add: true, edit: true, delete: true },
            '/admin/teams': { view: true, add: true, edit: true, delete: true },
            '/admin/project-enquiries': { view: true },
            '/admin/projects': { view: true, add: true, edit: true, delete: true },
            '/admin/blog-management': { view: true, add: true, edit: true, delete: true },
            '/admin/add-blog': { view: true, add: true, edit: true, delete: true },
            '/admin/builder-cms/projects': { view: true, add: true, edit: true, delete: true },
            '/admin/builder-cms/project-details': { view: true, add: true, edit: true, delete: true },
            '/admin/builder-cms/Features': { view: true, add: true, edit: true, delete: true },
            '/admin/builder-cms/feature-detail': { view: true, add: true, edit: true, delete: true },
      },

      '55aef2d8-38db-11ee-be56-0242ac120002': { // Sub Admin
            '/admin/dashboard': { view: true },
            '/admin/teams': { view: true },
            '/admin/project-enquiries': { view: true },
            '/admin/projects': { view: true },
      },

      '5ba304e0-38db-11ee-be56-0242ac120002': { // Project Manager
            '/admin/dashboard': { view: true },
            '/admin/project-enquiries': { view: true },
      },

      'd1c4d45f-2fe7-11f0-97f7-c87f545d7661': { // Team Lead
            '/admin/dashboard': { view: true }
      },

      '655927fc-38db-11ee-be56-0242ac120002': { // Team Member
            '/admin/dashboard': { view: true }
      }
};