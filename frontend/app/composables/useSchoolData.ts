export type SchoolPayload = Record<string, unknown>;

export function useSchoolData() {
  const config = useRuntimeConfig();

  const school = useState<SchoolPayload | null>("school:data", () => null);
  const settings = useState<SchoolPayload | null>("school:settings", () => null);
  const loading = useState<boolean>("school:loading", () => false);
  const error = useState<string | null>("school:error", () => null);

  const template = computed(() => {
    const fromSettings = settings.value?.template;
    const fromSchool = school.value?.template;

    if (typeof fromSettings === "string" && fromSettings.trim()) {
      return fromSettings;
    }

    if (typeof fromSchool === "string" && fromSchool.trim()) {
      return fromSchool;
    }

    return "template_one";
  });

  const fetchSchoolData = async () => {
    loading.value = true;
    error.value = null;

    try {
      const [schoolResponse, settingsResponse] = await Promise.allSettled([
        $fetch<SchoolPayload>(`${config.public.apiBase}/school`),
        $fetch<SchoolPayload>(`${config.public.apiBase}/school/settings`),
      ]);

      if (schoolResponse.status === "fulfilled") {
        school.value = schoolResponse.value;
      } else {
        throw schoolResponse.reason;
      }

      if (settingsResponse.status === "fulfilled") {
        settings.value = settingsResponse.value;
      } else {
        settings.value = null;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load school data.";
      error.value = message;
    } finally {
      loading.value = false;
    }
  };

  return {
    school,
    settings,
    template,
    loading,
    error,
    fetchSchoolData,
  };
}
