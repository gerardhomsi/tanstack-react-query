import {
  keepPreviousData,
  useInfiniteQuery,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getProduct,
  getProducts,
  getProjects,
  getTodo,
  getTodosIds,
} from './api';
import { Product } from '../types/product';

export function useTodosIds() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: getTodosIds,
  });
}

export function useTodos(ids: (number | undefined)[] | undefined) {
  return useQueries({
    queries: (ids ?? []).map((id) => {
      return {
        queryKey: ['todos', { id }],
        queryFn: () => getTodo(id!),
      };
    }),
  });
}

export function useProjects(page: number) {
  return useQuery({
    queryKey: ['projects', page],
    queryFn: () => getProjects(page),
    placeholderData: keepPreviousData,
  });
}

export function useProducts() {
  return useInfiniteQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    initialPageParam: 0,
    getNextPageParam: (lastPage, __, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (_, __, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
  });
}

export function useProduct(id: number | null) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['product', { id }],
    queryFn: () => getProduct(id!),
    enabled: !!id,
    placeholderData: () => {
      // !!! NOTE THIS helps with performance, where we can access the cached products and get the single product info/object
      const cachedProducts = (
        queryClient.getQueryData(['products']) as {
          pages: Product[] | undefined;
        }
      )?.pages?.flat(2);

      if (cachedProducts) {
        return cachedProducts.find((item) => item.id === id);
      }
    },
  });
}