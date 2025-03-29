import { useState, useEffect } from 'react';
import { getPermissions } from '@/api/api';

export interface Permission {
  name: string;
}

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await getPermissions();
        setPermissions(response.map((p: string) => p.toUpperCase()));
        setIsLoading(false);
        console.log('Permissions:', response);
      } catch (error) {
        console.error('Failed to fetch permissions', error);
        setIsLoading(false);
      }
    };
    fetchPermissions();
  }, []);

  const hasPermission = (requiredPermission: string | string[]) => {
    const permissionsToCheck = Array.isArray(requiredPermission)
      ? requiredPermission.map(p => p.toUpperCase())
      : [requiredPermission.toUpperCase()];

    return permissionsToCheck.some(perm => 
      permissions.includes(perm)
    );
  };

  return {
    permissions,
    hasPermission,
    isLoading
  };
};