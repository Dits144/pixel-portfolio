import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/** Semua query data portofolio memakai awalan key yang sama supaya mudah disegarkan. */
export function useResource<T>(key: string, load: () => Promise<T>) {
  return useQuery({ queryKey: ["portfolio", key], queryFn: load });
}

/** Menyegarkan seluruh data portofolio (termasuk isi halaman depan) setelah mutasi. */
export function useRefresh() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["portfolio"] });
}

/** Mutation kecil untuk aksi CRUD di panel admin: auto refresh + toast. */
export function useAction<TData>(
  run: (data: TData) => Promise<unknown>,
  messages: { success: string; error?: string },
) {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: run,
    onSuccess: () => {
      refresh();
      toast.success(messages.success);
    },
    onError: () => toast.error(messages.error ?? "Aksi gagal. Coba lagi ya."),
  });
}
