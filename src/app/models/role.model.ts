export interface Role {
      id: string;
      role_uuid: string;
      role_name: string;
}

export interface Permission {
      view?: boolean;
      add?: boolean;
      edit?: boolean;
      delete?: boolean;
}