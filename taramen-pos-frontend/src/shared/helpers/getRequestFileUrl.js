import axiosClient from "@/api/axios";

const ABSOLUTE_URL_PATTERN = /^https?:\/\//i;

export const getRequestFileUrl = (path, isPrivate = false, fallback = "") => {
  if (!path) {
    return fallback;
  }

  const normalizedPath = String(path).trim();
  if (!normalizedPath) {
    return fallback;
  }

  if (ABSOLUTE_URL_PATTERN.test(normalizedPath)) {
    return normalizedPath;
  }

  const baseURL = String(axiosClient?.defaults?.baseURL ?? "").replace(
    /\/api(?:\/v\d+)?\/?$/i,
    "",
  );
  const cleanPath = normalizedPath.replace(/^\/+/, "");

  if (!baseURL) {
    return `/${cleanPath}`;
  }

  if (isPrivate) {
    const fileName = cleanPath.split("/").pop();
    return `${baseURL}/api/file-display/request-file/${fileName}`;
  }

  return `${baseURL}/${cleanPath}`;
};

export default getRequestFileUrl;
