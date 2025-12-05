import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { quotesApi } from "../quotes.api";

export const quotationKeys = {
    all: ['quotations'] as const,
    lists: () => [...quotationKeys.all, 'list'] as const,
    list: (filters: Record<string, string | undefined>) => [...quotationKeys.lists(), { ...filters }] as const,
    details: () => [...quotationKeys.all, 'detail'] as const,
    detail: (id: string) => [...quotationKeys.details(), id] as const,
    related: (entityType: 'lead' | 'client', entityId: string) => ['quotations', entityType, entityId] as const
}

export const useQuotations = (filters: Record<string, string | undefined> = {}) => {
  return useQuery({
    queryKey: quotationKeys.list(filters),
    queryFn: () => quotesApi.fetch(filters),
    placeholderData: keepPreviousData, 
  });
};

export const useQuotation = (id: string) => {
  return useQuery({
    queryKey: quotationKeys.detail(id),
    queryFn: () => quotesApi.fetchById(id), 
    enabled: !!id, 
  });
};

export const useRelatedQuotations = (entityType: 'lead' | 'client', entityId: string) => {
  return useQuery({
    queryKey: quotationKeys.related(entityType, entityId),
    queryFn: () => quotesApi.fetch({ [`${entityType}Id`]: entityId })
  })
}