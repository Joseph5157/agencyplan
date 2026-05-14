import TemplateOneHome from "~/../templates/TemplateOne/Home.vue";

export function resolveHomepageTemplate(templateName: string) {
  const normalized = templateName.toLowerCase();

  if (normalized === "template_one" || normalized === "templateone" || normalized === "template-1") {
    return TemplateOneHome;
  }

  return TemplateOneHome;
}
