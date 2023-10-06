import React from "react";
import MainLayout from "../layouts/MainLayout";
import WriteFormModal from "../components/WriteFormModal";
import MainSection from "../components/MainSection";
import SideSection from "../components/SideSection";

const HomePage = () => {
  return (
    <MainLayout>
      <section className="grid h-full w-full grid-cols-12 place-items-center">
        <MainSection />
        <SideSection />
      </section>
      <WriteFormModal />
    </MainLayout>
  );
};

export default HomePage;
