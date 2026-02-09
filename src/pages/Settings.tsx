import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t } = useTranslation("settings");
  
  return (
    <div>
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p>{t("desc")}</p>
    </div>
  );
};

export default Settings;