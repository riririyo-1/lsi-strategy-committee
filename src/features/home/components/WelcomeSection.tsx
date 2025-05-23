"use client";

import { useI18n } from "@/features/i18n/hooks/useI18n";

const WelcomeSection = () => {
  const { t } = useI18n();

  return (
    <section
      id="welcome-section"
      className="page-section bg-black bg-opacity-60 p-8 md:p-12 rounded-xl shadow-2xl max-w-3xl w-full mb-12 text-center"
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white text-shadow">
        {t("home.welcome.title")}
      </h1>
      <p className="text-lg md:text-xl mb-8 text-white text-shadow-sm">
        {t("home.welcome.description")}
      </p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
        {t("home.welcome.button")}
      </button>
    </section>
  );
};

export default WelcomeSection;
