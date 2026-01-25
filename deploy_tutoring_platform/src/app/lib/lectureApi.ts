import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

/* ---------- FOLDERS ---------- */

export async function fetchFolders() {
  const { data, error } = await supabase
    .from("lecture_folders")
    .select(`
      id,
      key,
      label,
      subtitle,
      badge,
      lecture_videos (
        id,
        title,
        duration,
        thumbnail,
        tutor,
        tag
      )
    `)
    .order("sort_order");

  if (error) throw error;
  return data ?? [];
}

export async function createFolder(payload: {
  key: string;
  label: string;
  subtitle?: string;
  badge?: string;
}) {
  const { error } = await supabase
    .from("lecture_folders")
    .insert(payload);

  if (error) throw error;
}

export async function renameFolder(key: string, label: string) {
  const { error } = await supabase
    .from("lecture_folders")
    .update({ label })
    .eq("key", key);

  if (error) throw error;
}

export async function deleteFolder(key: string) {
  const { error } = await supabase
    .from("lecture_folders")
    .delete()
    .eq("key", key);

  if (error) throw error;
}
