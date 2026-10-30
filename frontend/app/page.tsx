"use client";

import Link from "next/link";
import { useState } from "react";

type DegreeCategory =
  | "all"
  | "bachelor"
  | "graduate"
  | "professional"
  | "diploma";

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Degrees & Programs", href: "#degrees" },
  { label: "Campus Life", href: "#campus-life" },
];

const DEGREE_TABS: { id: DegreeCategory; label: string }[] = [
  { id: "all", label: "All Programs (6)" },
  { id: "bachelor", label: "Bachelor's Degrees" },
  { id: "graduate", label: "Master's & Doctoral" },
  { id: "professional", label: "Professional Certifications" },
  { id: "diploma", label: "Specialized Diplomas" },
];

export default function PublicHomePage() {
  const [category, setCategory] = useState<DegreeCategory>("all");

  const showCard = (card: DegreeCategory) =>
    category === "all" || category === card;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 w-full px-margin flex items-center justify-between gap-space-md">
          <Link
            aria-label="Veritas University home"
            className="flex items-center gap-space-md shrink-0"
            href="/"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="relative flex items-center justify-center mb-space-sm">
              <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center shadow-md relative overflow-hidden">
                {/* Shield Background & Emblem */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary to-primary-container opacity-95"></div>
                <div className="relative z-10 flex flex-col items-center justify-center text-secondary-fixed">
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    auto_stories
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary-fixed mt-0.5"></div>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight">
                Veritas University
              </span>
              <span className="font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant">
                Est. 1872 • Curia &amp; Academia
              </span>
            </div>
          </Link>

          <nav
            aria-label="Landing page sections"
            className="hidden lg:flex items-center gap-space-xs flex-1 justify-center"
          >
            {NAV_ITEMS.map((item) => (
              <a
                className="px-space-md py-1.5 font-label-lg text-label-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all rounded-lg whitespace-nowrap"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-space-sm shrink-0">
            <Link
              className="px-space-md py-2 rounded-lg font-label-lg text-label-lg bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-sm whitespace-nowrap"
              href="/login"
            >
              Log In
            </Link>
          </div>
        </div>

        <nav
          aria-label="Landing page sections"
          className="lg:hidden h-11 w-full px-margin bg-surface-container-low flex items-center gap-space-sm overflow-x-auto"
        >
          {NAV_ITEMS.map((item) => (
            <a
              className="px-space-sm py-1.5 font-label-md text-label-md text-on-surface-variant hover:text-primary whitespace-nowrap"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="w-full bg-surface min-h-[calc(100vh-140px)]">
        <div className="flex flex-col w-full">
          {/* HERO SECTION WITH EDITORIAL SPLIT & ATMOSPHERIC LIGHT */}
          <section
            className="relative w-full overflow-hidden bg-primary text-on-primary scroll-mt-32"
            id="home"
          >
            {/* Subtle ambient background motifs */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg
                className="w-full h-full"
                height="100%"
                width="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    height="48"
                    id="scholarly-grid"
                    patternUnits="userSpaceOnUse"
                    width="48"
                  >
                    <path
                      d="M 48 0 L 0 0 0 48"
                      fill="none"
                      stroke="#aec7f7"
                      strokeWidth="0.5"
                    ></path>
                  </pattern>
                </defs>
                <rect
                  fill="url(#scholarly-grid)"
                  height="100%"
                  width="100%"
                ></rect>
              </svg>
            </div>
            <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-secondary/15 blur-3xl pointer-events-none"></div>
            <div className="relative max-w-7xl mx-auto px-margin pt-16 pb-20 lg:pt-24 lg:pb-28">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
                {/* Text & Action Column */}
                <div className="lg:col-span-7 flex flex-col items-start space-y-space-lg">
                  <div className="inline-flex items-center gap-space-xs px-3 py-1 bg-primary-container/80 rounded-full shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span>
                    <span className="font-label-mono text-label-mono uppercase tracking-widest text-primary-fixed">
                      Chartered &amp; Accredited 1884
                    </span>
                  </div>
                  <h1 className="font-headline-xl text-headline-xl tracking-tight text-white max-w-2xl leading-[1.15]">
                    Excellence in Inquiry, <br className="hidden sm:inline" />
                    <span className="text-secondary-fixed italic font-normal">
                      Leadership
                    </span>{" "}
                    in Action.
                  </h1>
                  <p className="font-body-lg text-body-lg text-primary-fixed-dim/90 max-w-xl leading-relaxed">
                    Veritas University empowers visionary scholars across 12
                    distinct collegiate faculties with world-class mentorship,
                    accredited global degree pathways, and pioneering research
                    environments.
                  </p>
                  <div className="flex flex-wrap items-center gap-space-md pt-space-xs w-full sm:w-auto">
                    <Link
                      className="px-space-lg py-3.5 bg-secondary hover:bg-on-secondary-fixed-variant transition-colors rounded-lg font-label-lg text-label-lg text-white shadow-md flex items-center justify-center gap-2 group"
                      href="/login"
                    >
                      <span>Access Academic Portal</span>
                      <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    </Link>
                    <a
                      className="px-space-lg py-3.5 bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-white rounded-lg font-label-lg text-label-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                      href="#degrees"
                    >
                      <span className="material-symbols-outlined text-lg text-secondary-fixed">
                        school
                      </span>
                      <span>Explore Degree Programs</span>
                    </a>
                  </div>
                  {/* Academic Status Notice */}
                  <div className="flex items-center gap-space-md pt-space-md text-on-primary/70">
                    <span className="font-label-md text-label-md uppercase tracking-wider text-primary-fixed">
                      Admissions Cycle:
                    </span>
                    <span className="font-body-sm text-body-sm text-white">
                      Fall 2025 Priority Filing Open • Regular Deadline Nov 15
                    </span>
                  </div>
                </div>
                {/* Academic Visual Mosaic Column */}
                <div className="lg:col-span-5 relative">
                  <div className="relative mx-auto max-w-md lg:max-w-none">
                    {/* Main Hero Image Frame */}
                    <div className="relative rounded-xl overflow-hidden shadow-2xl bg-primary-container aspect-[4/5] max-h-[480px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt=""
                        className="w-full h-full object-cover"
                        data-alt="Stately collegiate gothic stone university library interior with soaring vaulted ceilings, students in focused collaborative study around dark polished oak tables, warm golden chandelier lighting casting soft amber glows onto leather-bound volumes and laptops, dignified academic architecture, fine art photography, hyper-detailed, cinematic composition."
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJAyLZf5Oqpl3qz_5-hXRiCnO9GShO81F5q8TbGvEuJ7TBuKWaMkXohAEW2zlJwj0QTyKWrqB5ea-KOGc43t0MN61uBp7zRvJEZvxXdbDsZsn1Sfxr4O-BpFWkW9Z1S5bk782Jm2l5ybHzoyIx_vKCFKB9Zn107vFRO0iHC-i-Qzbe-lk4wQKCqqs6bvqBEY2OIqTucJAp7y5v4lEFYIQOgk1p72u8jx3xeQYmFclVKd4pSxaKNHZZMA"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-80"></div>
                      {/* Floating Scholarly Badge */}
                      <div className="absolute bottom-6 left-6 right-6 p-4 rounded-lg bg-surface/95 backdrop-blur-md text-on-surface shadow-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-label-mono text-label-mono uppercase tracking-widest text-secondary block">
                              Institutional Mandate
                            </span>
                            <p className="font-headline-sm text-headline-sm text-primary font-bold">
                              Veritas Omnibus
                            </p>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                            <span
                              className="material-symbols-outlined"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              verified
                            </span>
                          </div>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                          Carnegie R1 Doctoral University with Very High
                          Research Activity.
                        </p>
                      </div>
                    </div>
                    {/* Accent overlapping stat card */}
                    <div className="hidden sm:flex absolute -left-6 top-10 p-4 rounded-lg bg-surface-container-lowest text-on-surface shadow-xl flex-col gap-1 w-48">
                      <div className="flex items-center gap-1.5 text-secondary">
                        <span
                          className="material-symbols-outlined text-lg"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          auto_awesome
                        </span>
                        <span className="font-label-mono text-label-mono uppercase font-bold tracking-wider">
                          Top Tier
                        </span>
                      </div>
                      <span className="font-headline-sm text-headline-sm text-primary font-extrabold leading-tight">
                        #4 National
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Comprehensive Collegiate Ranking 2024
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Live Institutional Metrics Ribbon */}
          <div className="w-full bg-primary-container text-white py-6 shadow-inner">
            <div className="max-w-7xl mx-auto px-margin">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-center divide-y lg:divide-y-0 lg:divide-x divide-on-primary-container/20">
                <div className="flex flex-col items-center lg:items-start pt-4 lg:pt-0">
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline-lg text-headline-lg font-bold text-white tracking-tight">
                      14:1
                    </span>
                  </div>
                  <span className="font-label-md text-label-md uppercase tracking-wider text-secondary-fixed">
                    Student-Faculty Ratio
                  </span>
                  <span className="font-body-sm text-body-sm text-on-primary-container">
                    Seminar-style instruction
                  </span>
                </div>
                <div className="flex flex-col items-center lg:items-start pt-4 lg:pt-0 lg:pl-8">
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline-lg text-headline-lg font-bold text-white tracking-tight">
                      98.4%
                    </span>
                  </div>
                  <span className="font-label-md text-label-md uppercase tracking-wider text-secondary-fixed">
                    Career Placement Rate
                  </span>
                  <span className="font-body-sm text-body-sm text-on-primary-container">
                    Within 6 months of graduation
                  </span>
                </div>
                <div className="flex flex-col items-center lg:items-start pt-4 lg:pt-0 lg:pl-8">
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline-lg text-headline-lg font-bold text-white tracking-tight">
                      $142M
                    </span>
                  </div>
                  <span className="font-label-md text-label-md uppercase tracking-wider text-secondary-fixed">
                    Annual Research Grants
                  </span>
                  <span className="font-body-sm text-body-sm text-on-primary-container">
                    Federally sponsored discovery
                  </span>
                </div>
                <div className="flex flex-col items-center lg:items-start pt-4 lg:pt-0 lg:pl-8">
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline-lg text-headline-lg font-bold text-white tracking-tight">
                      12
                    </span>
                  </div>
                  <span className="font-label-md text-label-md uppercase tracking-wider text-secondary-fixed">
                    Academic Colleges
                  </span>
                  <span className="font-body-sm text-body-sm text-on-primary-container">
                    Across two sprawling campuses
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ABOUT THE UNIVERSITY SECTION */}
          <section
            className="w-full py-space-xl bg-surface scroll-mt-32"
            id="about"
          >
            <div className="max-w-7xl mx-auto px-margin space-y-space-xl">
              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                <div className="space-y-space-xs max-w-2xl">
                  <span className="font-label-mono text-label-mono uppercase tracking-widest text-secondary font-bold">
                    Heritage &amp; Institutional Mandate
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                    An Endowment of Rigor, Discovery, and Honor
                  </h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">
                    Founded in 1884 by charter of scholarly assembly, Veritas
                    University fosters an unyielding environment of intellectual
                    inquiry and civic stewardship.
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-space-sm">
                  <span className="font-label-mono text-label-mono uppercase px-3 py-1 bg-surface-container-high rounded text-on-surface-variant font-semibold">
                    140 Years of Pedigree
                  </span>
                </div>
              </div>
              {/* Provost Quote & Strategic Vision Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
                {/* Provost Quote Card */}
                <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between space-y-space-md">
                  <div className="space-y-space-md">
                    <span
                      className="material-symbols-outlined text-4xl text-secondary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      format_quote
                    </span>
                    <blockquote className="font-headline-md text-headline-md text-primary italic leading-relaxed">
                      &quot;We do not merely confer academic degrees; we
                      cultivate ethical leaders equipped to interrogate
                      complexity and enact meaningful truth in our global
                      society.&quot;
                    </blockquote>
                  </div>
                  <div className="flex items-center gap-space-md pt-space-md">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt=""
                        className="w-full h-full object-cover"
                        data-alt="Dignified portrait of Provost Dr. Marcus Vance in formal dark navy academic robes against an oak wood paneled university faculty chamber, soft directional natural light, regal and composed scholar."
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuARDcyJ41HPx7y1ynxBGgU06UA7iHdb6Qg5RGAuK5uJ-5InOfgGNTbcvr6QQMSzxKljPGYr97DjsT_tmblp6sgLhhlsDVFwo-doSRId36a2HYowSOhE2Z0VwikDBMkKAYDUqyUBjlqhdXRdFouF67K8A3bGvqPjGCJIbhr_W-Fj6q6-EjSj9FtBOjgm0RL9_s6IEef8XTU1NNFULuCzrBf7EpCdJtJV0ACQs2P3b_nW2clwKEQFx0oKEQ"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-title-md text-title-md text-primary font-bold">
                        Dr. Marcus Vance, Ph.D.
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Provost &amp; Senior Vice Chancellor for Academic
                        Affairs
                      </span>
                      <span className="font-label-mono text-label-mono text-secondary">
                        Fellow of the Royal Academy
                      </span>
                    </div>
                  </div>
                </div>
                {/* 3 Pillars Grid */}
                <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-space-md">
                  {/* Pillar 1 */}
                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-space-sm">
                      <div className="w-10 h-10 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">
                          menu_book
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-primary">
                        Transformative Education
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Small-cohort seminars, direct professorial engagement,
                        and custom capstone curricula designed to test
                        hypotheses in real-world scenarios.
                      </p>
                    </div>
                    <div className="pt-space-md flex items-center gap-1 font-label-md text-label-md text-primary">
                      <span className="uppercase tracking-wider">
                        Curriculum Model
                      </span>
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                  {/* Pillar 2 */}
                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-space-sm">
                      <div className="w-10 h-10 rounded-lg bg-surface-variant text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">
                          science
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-primary">
                        Interdisciplinary Discovery
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Convergence across computational science, bioethics, and
                        humanities via 38 cross-departmental institutes and
                        laboratory centers.
                      </p>
                    </div>
                    <div className="pt-space-md flex items-center gap-1 font-label-md text-label-md text-primary">
                      <span className="uppercase tracking-wider">
                        Research Institutes
                      </span>
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                  {/* Pillar 3 */}
                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-space-sm">
                      <div className="w-10 h-10 rounded-lg bg-secondary-fixed text-secondary flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">
                          public
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-primary">
                        Global Civic Leadership
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Active foreign study fellowships across 42 nations,
                        diplomatic externships, and public interest clinics
                        addressing systemic world challenges.
                      </p>
                    </div>
                    <div className="pt-space-md flex items-center gap-1 font-label-md text-label-md text-primary">
                      <span className="uppercase tracking-wider">
                        Global Footprint
                      </span>
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ACCREDITED DEGREES & CERTIFICATIONS SECTION */}
          <section
            className="w-full py-space-xl bg-surface-container-low scroll-mt-32"
            id="degrees"
          >
            <div className="max-w-7xl mx-auto px-margin space-y-space-xl">
              {/* Section Heading */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                <div className="space-y-space-xs max-w-2xl">
                  <span className="font-label-mono text-label-mono uppercase tracking-widest text-secondary font-bold">
                    Academic Registry &amp; Catalog
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                    Accredited Degrees &amp; Certifications
                  </h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">
                    Rigorous qualifications endorsed by global professional
                    bodies, fostering specialized mastery and executive agility.
                  </p>
                </div>
                <a
                  className="inline-flex items-center gap-2 font-label-lg text-label-lg text-primary font-bold hover:underline"
                  href="#"
                >
                  <span>Download Complete 2024-2025 Course Catalog</span>
                  <span className="material-symbols-outlined text-sm">
                    download
                  </span>
                </a>
              </div>
              {/* Filter Controls */}
              <div
                className="flex items-center gap-space-xs overflow-x-auto pb-2 scrollbar-none"
                id="degree-tabs"
              >
                {DEGREE_TABS.map((tab) => {
                  const isActive = category === tab.id;
                  return (
                    <button
                      className={
                        isActive
                          ? "degree-tab-btn active px-4 py-2 rounded-lg font-label-lg text-label-lg bg-primary text-white shadow-sm transition-all whitespace-nowrap"
                          : "degree-tab-btn px-4 py-2 rounded-lg font-label-lg text-label-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all whitespace-nowrap"
                      }
                      key={tab.id}
                      onClick={() => setCategory(tab.id)}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              {/* Degree Cards Grid */}
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg"
                id="degree-grid"
              >
                {/* Card 1: B.Sc. CS & AI */}
                <div
                  className="degree-card bachelor flex-col justify-between bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all"
                  style={{ display: showCard("bachelor") ? "flex" : "none" }}
                >
                  <div className="space-y-space-md">
                    <div className="flex items-center justify-between gap-space-xs">
                      <span className="px-2.5 py-1 bg-surface-container-high text-primary rounded font-label-mono text-label-mono font-bold uppercase tracking-wider">
                        ABET Accredited
                      </span>
                      <span className="px-2.5 py-1 bg-secondary-fixed/50 text-secondary rounded font-label-mono text-label-mono font-bold uppercase">
                        Honors Track
                      </span>
                    </div>
                    <div className="space-y-space-xs">
                      <span className="font-label-mono text-label-mono uppercase text-on-surface-variant tracking-wider">
                        College of Engineering &amp; Computing
                      </span>
                      <h3 className="font-headline-sm text-headline-sm text-primary">
                        B.Sc. in Computer Science &amp; Artificial Intelligence
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Foundational computational theory, scalable deep
                        learning systems, robotics engineering, and hardware
                        acceleration architectures.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 py-space-xs bg-surface-container-low rounded-lg p-3">
                      <div>
                        <span className="font-label-mono text-label-mono text-outline block">
                          Duration
                        </span>
                        <span className="font-label-lg text-label-lg text-on-surface">
                          4 Years (Full-Time)
                        </span>
                      </div>
                      <div>
                        <span className="font-label-mono text-label-mono text-outline block">
                          Credits Required
                        </span>
                        <span className="font-label-lg text-label-lg text-on-surface">
                          128 Credit Hours
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-space-md mt-space-md flex items-center justify-between">
                    <a
                      className="font-label-lg text-label-lg text-primary font-bold hover:underline inline-flex items-center gap-1"
                      href="#"
                    >
                      <span>Career Pathways</span>
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </a>
                    <button className="px-3 py-1.5 bg-surface-container hover:bg-surface-variant text-primary rounded font-label-md text-label-md transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        description
                      </span>
                      <span>Syllabus</span>
                    </button>
                  </div>
                </div>
                {/* Card 2: M.Sc. Data Science & Bioinformatics */}
                <div
                  className="degree-card graduate flex-col justify-between bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all"
                  style={{ display: showCard("graduate") ? "flex" : "none" }}
                >
                  <div className="space-y-space-md">
                    <div className="flex items-center justify-between gap-space-xs">
                      <span className="px-2.5 py-1 bg-surface-container-high text-primary rounded font-label-mono text-label-mono font-bold uppercase tracking-wider">
                        STEM Designated
                      </span>
                      <span className="px-2.5 py-1 bg-surface-container text-on-surface-variant rounded font-label-mono text-label-mono uppercase">
                        Dual Campus
                      </span>
                    </div>
                    <div className="space-y-space-xs">
                      <span className="font-label-mono text-label-mono uppercase text-on-surface-variant tracking-wider">
                        Institute for Health Informatics
                      </span>
                      <h3 className="font-headline-sm text-headline-sm text-primary">
                        M.Sc. in Data Science &amp; Biomedical Informatics
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        High-dimensional genomic analytics, clinical predictive
                        modeling, stochastic processing, and precision medicine
                        architectures.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 py-space-xs bg-surface-container-low rounded-lg p-3">
                      <div>
                        <span className="font-label-mono text-label-mono text-outline block">
                          Duration
                        </span>
                        <span className="font-label-lg text-label-lg text-on-surface">
                          2 Years (Accelerated)
                        </span>
                      </div>
                      <div>
                        <span className="font-label-mono text-label-mono text-outline block">
                          Credits Required
                        </span>
                        <span className="font-label-lg text-label-lg text-on-surface">
                          36 Credit Hours
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-space-md mt-space-md flex items-center justify-between">
                    <a
                      className="font-label-lg text-label-lg text-primary font-bold hover:underline inline-flex items-center gap-1"
                      href="#"
                    >
                      <span>Career Pathways</span>
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </a>
                    <button className="px-3 py-1.5 bg-surface-container hover:bg-surface-variant text-primary rounded font-label-md text-label-md transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        description
                      </span>
                      <span>Syllabus</span>
                    </button>
                  </div>
                </div>
                {/* Card 3: Ph.D. Cognitive Neuroscience */}
                <div
                  className="degree-card graduate flex-col justify-between bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all"
                  style={{ display: showCard("graduate") ? "flex" : "none" }}
                >
                  <div className="space-y-space-md">
                    <div className="flex items-center justify-between gap-space-xs">
                      <span className="px-2.5 py-1 bg-secondary-fixed/50 text-secondary rounded font-label-mono text-label-mono font-bold uppercase tracking-wider">
                        Fully Funded Fellowship
                      </span>
                      <span className="px-2.5 py-1 bg-surface-container-high text-primary rounded font-label-mono text-label-mono font-bold uppercase">
                        Doctoral
                      </span>
                    </div>
                    <div className="space-y-space-xs">
                      <span className="font-label-mono text-label-mono uppercase text-on-surface-variant tracking-wider">
                        Graduate School of Arts &amp; Sciences
                      </span>
                      <h3 className="font-headline-sm text-headline-sm text-primary">
                        Ph.D. in Cognitive Neuroscience
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Rigorous empirical investigation into human neural
                        substrates, neural interfaces, functional neuroimaging
                        (7T fMRI), and behavioral dynamics.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 py-space-xs bg-surface-container-low rounded-lg p-3">
                      <div>
                        <span className="font-label-mono text-label-mono text-outline block">
                          Duration
                        </span>
                        <span className="font-label-lg text-label-lg text-on-surface">
                          4 - 5 Years
                        </span>
                      </div>
                      <div>
                        <span className="font-label-mono text-label-mono text-outline block">
                          Format
                        </span>
                        <span className="font-label-lg text-label-lg text-on-surface">
                          Dissertation Track
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-space-md mt-space-md flex items-center justify-between">
                    <a
                      className="font-label-lg text-label-lg text-primary font-bold hover:underline inline-flex items-center gap-1"
                      href="#"
                    >
                      <span>Faculty Mentors</span>
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </a>
                    <button className="px-3 py-1.5 bg-surface-container hover:bg-surface-variant text-primary rounded font-label-md text-label-md transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        description
                      </span>
                      <span>Prospectus</span>
                    </button>
                  </div>
                </div>
                {/* Card 4: MBA */}
                <div
                  className="degree-card graduate flex-col justify-between bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all"
                  style={{ display: showCard("graduate") ? "flex" : "none" }}
                >
                  <div className="space-y-space-md">
                    <div className="flex items-center justify-between gap-space-xs">
                      <span className="px-2.5 py-1 bg-surface-container-high text-primary rounded font-label-mono text-label-mono font-bold uppercase tracking-wider">
                        AACSB Premier
                      </span>
                      <span className="px-2.5 py-1 bg-surface-container text-on-surface-variant rounded font-label-mono text-label-mono uppercase">
                        Executive Cohort
                      </span>
                    </div>
                    <div className="space-y-space-xs">
                      <span className="font-label-mono text-label-mono uppercase text-on-surface-variant tracking-wider">
                        Vance School of Global Management
                      </span>
                      <h3 className="font-headline-sm text-headline-sm text-primary">
                        Master of Business Administration (MBA)
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Strategic financial modeling, cross-border corporate
                        governance, venture capitalization, and enterprise
                        transformation.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 py-space-xs bg-surface-container-low rounded-lg p-3">
                      <div>
                        <span className="font-label-mono text-label-mono text-outline block">
                          Duration
                        </span>
                        <span className="font-label-lg text-label-lg text-on-surface">
                          18 Months
                        </span>
                      </div>
                      <div>
                        <span className="font-label-mono text-label-mono text-outline block">
                          Cohort Size
                        </span>
                        <span className="font-label-lg text-label-lg text-on-surface">
                          32 Selected Fellows
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-space-md mt-space-md flex items-center justify-between">
                    <a
                      className="font-label-lg text-label-lg text-primary font-bold hover:underline inline-flex items-center gap-1"
                      href="#"
                    >
                      <span>Corporate Partners</span>
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </a>
                    <button className="px-3 py-1.5 bg-surface-container hover:bg-surface-variant text-primary rounded font-label-md text-label-md transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        description
                      </span>
                      <span>Syllabus</span>
                    </button>
                  </div>
                </div>
                {/* Card 5: Post-Graduate Diploma Cyber Defense */}
                <div
                  className="degree-card diploma flex-col justify-between bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all"
                  style={{ display: showCard("diploma") ? "flex" : "none" }}
                >
                  <div className="space-y-space-md">
                    <div className="flex items-center justify-between gap-space-xs">
                      <span className="px-2.5 py-1 bg-surface-container-high text-primary rounded font-label-mono text-label-mono font-bold uppercase tracking-wider">
                        NSA CAE-CD Certified
                      </span>
                      <span className="px-2.5 py-1 bg-secondary-fixed/50 text-secondary rounded font-label-mono text-label-mono font-bold uppercase">
                        Specialized
                      </span>
                    </div>
                    <div className="space-y-space-xs">
                      <span className="font-label-mono text-label-mono uppercase text-on-surface-variant tracking-wider">
                        Institute for National Cyber Security
                      </span>
                      <h3 className="font-headline-sm text-headline-sm text-primary">
                        Post-Graduate Diploma in Cyber Defense &amp;
                        Cryptography
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Adversary emulation, lattice-based quantum resistance,
                        protocol audit, zero-trust enterprise security
                        architecture, and incident triage.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 py-space-xs bg-surface-container-low rounded-lg p-3">
                      <div>
                        <span className="font-label-mono text-label-mono text-outline block">
                          Duration
                        </span>
                        <span className="font-label-lg text-label-lg text-on-surface">
                          1 Academic Year
                        </span>
                      </div>
                      <div>
                        <span className="font-label-mono text-label-mono text-outline block">
                          Lab Engagement
                        </span>
                        <span className="font-label-lg text-label-lg text-on-surface">
                          240 Live Range Hrs
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-space-md mt-space-md flex items-center justify-between">
                    <a
                      className="font-label-lg text-label-lg text-primary font-bold hover:underline inline-flex items-center gap-1"
                      href="#"
                    >
                      <span>Security Clearance</span>
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </a>
                    <button className="px-3 py-1.5 bg-surface-container hover:bg-surface-variant text-primary rounded font-label-md text-label-md transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        description
                      </span>
                      <span>Curriculum</span>
                    </button>
                  </div>
                </div>
                {/* Card 6: Quantum Computing */}
                <div
                  className="degree-card professional flex-col justify-between bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all"
                  style={{
                    display: showCard("professional") ? "flex" : "none",
                  }}
                >
                  <div className="space-y-space-md">
                    <div className="flex items-center justify-between gap-space-xs">
                      <span className="px-2.5 py-1 bg-surface-container-high text-primary rounded font-label-mono text-label-mono font-bold uppercase tracking-wider">
                        Industry Partnered
                      </span>
                      <span className="px-2.5 py-1 bg-surface-container text-on-surface-variant rounded font-label-mono text-label-mono uppercase">
                        Cert. of Mastery
                      </span>
                    </div>
                    <div className="space-y-space-xs">
                      <span className="font-label-mono text-label-mono uppercase text-on-surface-variant tracking-wider">
                        Veritas Quantum Initiative
                      </span>
                      <h3 className="font-headline-sm text-headline-sm text-primary">
                        Professional Certificate in Quantum Computing
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        Hands-on Qiskit programming, fault-tolerant qubit
                        topologies, variational quantum eigensolvers, and
                        hardware cryogenic dynamics.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 py-space-xs bg-surface-container-low rounded-lg p-3">
                      <div>
                        <span className="font-label-mono text-label-mono text-outline block">
                          Duration
                        </span>
                        <span className="font-label-lg text-label-lg text-on-surface">
                          6 Months (Hybrid)
                        </span>
                      </div>
                      <div>
                        <span className="font-label-mono text-label-mono text-outline block">
                          Target Level
                        </span>
                        <span className="font-label-lg text-label-lg text-on-surface">
                          Post-Graduate / Eng
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-space-md mt-space-md flex items-center justify-between">
                    <a
                      className="font-label-lg text-label-lg text-primary font-bold hover:underline inline-flex items-center gap-1"
                      href="#"
                    >
                      <span>Industry Network</span>
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </a>
                    <button className="px-3 py-1.5 bg-surface-container hover:bg-surface-variant text-primary rounded font-label-md text-label-md transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        description
                      </span>
                      <span>Syllabus</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CAMPUS FACILITIES & RESEARCH INFRASTRUCTURE */}
          <section
            className="w-full py-space-xl bg-surface scroll-mt-32"
            id="campus-life"
          >
            <div className="max-w-7xl mx-auto px-margin space-y-space-xl">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                <div className="space-y-space-xs max-w-2xl">
                  <span className="font-label-mono text-label-mono uppercase tracking-widest text-secondary font-bold">
                    Physical &amp; Experimental Grounds
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                    World-Class Infrastructure for Global Scholars
                  </h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">
                    Spread across 280 tree-lined acres, our facilities combine
                    architectural legacy with state-of-the-art computational and
                    experimental equipment.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-surface-container hover:bg-surface-variant text-primary rounded-lg font-label-lg text-label-lg transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">
                      map
                    </span>
                    <span>Interactive Campus Map</span>
                  </button>
                </div>
              </div>
              {/* Facility Cards Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
                {/* Facility 1: Library */}
                <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                  <div className="h-48 w-full bg-surface-container relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      data-alt="Modern university grand research library interior with multistory glass walls, rows of curated classic book shelves, ergonomic study pods, warm wood accents, natural daylight cascading from upper clerestory windows, students reading in deep contemplation."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgJxrtM3TRmGzeQtIG8jV4xfoY84sXXkrfRC4uluQUx7kBUiPPwT8LCm_4nnPYMmPh5CCkGNV8illy44NBoXCpq17UMxv2pxjPX78eEFB-EqeD5yplZ-h-rkBDXxyklqA9x2IUOukXOnTWDom83iNMju14IWayQvcQumufuAzxBdmEiWmwjbmT6eHihpmdNwdgtnSm_8YgOCalPasbb0jsCCZRkvZwyGs_KjANFhqKYdGcTyuQds2maw"
                    />
                    <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-white font-label-mono text-label-mono rounded shadow">
                      Academic Core
                    </span>
                  </div>
                  <div className="p-space-md flex-1 flex flex-col justify-between space-y-space-sm">
                    <div>
                      <div className="flex items-center gap-1.5 text-secondary">
                        <span className="material-symbols-outlined text-base">
                          local_library
                        </span>
                        <span className="font-label-mono text-label-mono uppercase font-semibold">
                          24/7 Scholar Commons
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-primary mt-1">
                        Sterling Memorial Research Library
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                        2.4 million cataloged volumes, climate-controlled rare
                        archives, private doctoral carrels, and high-speed
                        digital research terminals.
                      </p>
                    </div>
                    <div className="pt-space-xs font-label-md text-label-md text-primary font-semibold flex items-center justify-between">
                      <span>View Capacity &amp; Hours</span>
                      <span className="material-symbols-outlined text-sm">
                        chevron_right
                      </span>
                    </div>
                  </div>
                </div>
                {/* Facility 2: Bio & Nano Labs */}
                <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                  <div className="h-48 w-full bg-surface-container relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      data-alt="High-tech advanced biotechnology cleanroom research lab with stainless steel surfaces, illuminated biosafety hoods, researchers in protective white suits observing fluorescent electron microscopes, clean sterile cyan-blue scientific illumination."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuADmwBadCXWlvW4WQVl1H9pd4jr_bH1SF6itaCKdkUJxWZlrlRXtPk6AAMqoFmy46z9JUccNp3PW_953GoaDwYCrVXvigzWr6qA536ZMio4CbBAGb0T58IDWujK8MQbr_w8O4cbIkDbBEWBFdAdD7Qr-iZmgF98iEhFQnphLdOQLYrXG_jwStgvVqsl8t63eWRUBZakBQS9ezRjAL1z_KYnXFPvSW-ynX4FFITRjChjk33HtWcBuO3OcQ"
                    />
                    <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-white font-label-mono text-label-mono rounded shadow">
                      BSL-3 Certified
                    </span>
                  </div>
                  <div className="p-space-md flex-1 flex flex-col justify-between space-y-space-sm">
                    <div>
                      <div className="flex items-center gap-1.5 text-secondary">
                        <span className="material-symbols-outlined text-base">
                          biotech
                        </span>
                        <span className="font-label-mono text-label-mono uppercase font-semibold">
                          Cleanroom Facilities
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-primary mt-1">
                        Advanced Biotechnology &amp; Nano Labs
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                        Equipped with high-throughput gene sequencers, electron
                        cryo-microscopy, and direct connection to university GPU
                        clusters.
                      </p>
                    </div>
                    <div className="pt-space-xs font-label-md text-label-md text-primary font-semibold flex items-center justify-between">
                      <span>Instrument Booking</span>
                      <span className="material-symbols-outlined text-sm">
                        chevron_right
                      </span>
                    </div>
                  </div>
                </div>
                {/* Facility 3: Athletics & Sports */}
                <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                  <div className="h-48 w-full bg-surface-container relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      data-alt="Elite university Olympic sports aquatic center with a sparkling 50-meter lap pool, soaring architectural glass roof, reflection on the water surface, indoor athletics track visible in adjacent mezzanine, dynamic athletic lighting, pristine condition."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgQ13DKMGxKzAqBiCodojVn0Y0Q0gBGQLePutD19MJjjngOpazLi_0TQiJbUjkKEbTSMutwCNQDW1ZZPpEz37h0W5L4BIOJmAJWHJh20WSLHUksPXGcsQUghItlwKb282PVTglxUzQy-nec6kmtmMQSb2XMmVpkC08Qk1ZqRasegVe9-27Ze_5bpz5s9M0ft3BSeWqmGKkPdHhjlje8OdIVv-lyqU6NrUVbfvrCiVVZNL_RxqWqtCq6Q"
                    />
                    <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-white font-label-mono text-label-mono rounded shadow">
                      NCAA Division I
                    </span>
                  </div>
                  <div className="p-space-md flex-1 flex flex-col justify-between space-y-space-sm">
                    <div>
                      <div className="flex items-center gap-1.5 text-secondary">
                        <span className="material-symbols-outlined text-base">
                          pool
                        </span>
                        <span className="font-label-mono text-label-mono uppercase font-semibold">
                          NCAA Grade Facility
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-primary mt-1">
                        Vanguard Athletics &amp; Sports Complex
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                        50m competitive aquatic arena, 200m indoor banked track,
                        strength performance center, and kinesiology
                        biomechanics lab.
                      </p>
                    </div>
                    <div className="pt-space-xs font-label-md text-label-md text-primary font-semibold flex items-center justify-between">
                      <span>Varsity &amp; Recreation</span>
                      <span className="material-symbols-outlined text-sm">
                        chevron_right
                      </span>
                    </div>
                  </div>
                </div>
                {/* Facility 4: Archimedes Halls */}
                <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                  <div className="h-48 w-full bg-surface-container relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      data-alt="Modern collegiate tiered lecture theater auditorium with rich mahogany wood acoustics panels, ergonomic navy seating, large multi-screen presentation displays at the stage, architectural lighting highlighting the curving rows."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuADfnWxikxTgcRMEjXcHSUkqeCizwWFRvv_R2Xx_5_G16Ni1CDQJB1tf9P5VRb65fX8tbck5WtrBWRmED4jkL2ZxdrFH46ZYiuOUiD0dc7ZcZYbz3gC7CstJLrImHoxbLfq6MNblCPds_aaXTbXJu0pZZzTR7Tocj-C6Ax389k9GAps3cKXk-dyWFQQXYB3ATxCAegIRCYahJGcqYQq_fKz0UkkdC-cFe1vynHR2U0VvYHXU_rk1WNKqQ"
                    />
                    <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-white font-label-mono text-label-mono rounded shadow">
                      Global Broadcast
                    </span>
                  </div>
                  <div className="p-space-md flex-1 flex flex-col justify-between space-y-space-sm">
                    <div>
                      <div className="flex items-center gap-1.5 text-secondary">
                        <span className="material-symbols-outlined text-base">
                          co_present
                        </span>
                        <span className="font-label-mono text-label-mono uppercase font-semibold">
                          Acoustics Engineered
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-primary mt-1">
                        Archimedes Tiered Lecture Halls
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                        350-seat acoustic auditoriums with synchronized
                        multi-angle live video distribution, global symposium
                        feeds, and real-time polling.
                      </p>
                    </div>
                    <div className="pt-space-xs font-label-md text-label-md text-primary font-semibold flex items-center justify-between">
                      <span>Symposium Calendar</span>
                      <span className="material-symbols-outlined text-sm">
                        chevron_right
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ACCREDITATIONS & REGULATORY REPUTATION */}
          <section className="w-full py-12 bg-surface-container-lowest shadow-sm">
            <div className="max-w-7xl mx-auto px-margin space-y-space-md">
              <div className="flex flex-col items-center text-center space-y-1">
                <span className="font-label-mono text-label-mono uppercase tracking-widest text-secondary font-bold">
                  Institutional Validation
                </span>
                <h4 className="font-headline-sm text-headline-sm text-primary">
                  Recognized by the World&apos;s Foremost Collegiate Boards
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-items-center opacity-75 grayscale hover:grayscale-0 transition-all">
                <div className="flex flex-col items-center text-center p-3">
                  <span className="material-symbols-outlined text-3xl text-primary mb-1">
                    verified_user
                  </span>
                  <span className="font-label-mono text-label-mono uppercase font-bold text-on-surface">
                    HLC Accredited
                  </span>
                  <span className="font-body-sm text-body-sm text-outline">
                    Higher Learning Comm.
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-3">
                  <span className="material-symbols-outlined text-3xl text-primary mb-1">
                    domain_verification
                  </span>
                  <span className="font-label-mono text-label-mono uppercase font-bold text-on-surface">
                    AACSB Premier
                  </span>
                  <span className="font-body-sm text-body-sm text-outline">
                    Collegiate Business
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-3">
                  <span className="material-symbols-outlined text-3xl text-primary mb-1">
                    engineering
                  </span>
                  <span className="font-label-mono text-label-mono uppercase font-bold text-on-surface">
                    ABET Certified
                  </span>
                  <span className="font-body-sm text-body-sm text-outline">
                    Engineering &amp; Tech
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-3">
                  <span className="material-symbols-outlined text-3xl text-primary mb-1">
                    security
                  </span>
                  <span className="font-label-mono text-label-mono uppercase font-bold text-on-surface">
                    NSA CAE-CD
                  </span>
                  <span className="font-body-sm text-body-sm text-outline">
                    Cyber Academic Excel.
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-3">
                  <span className="material-symbols-outlined text-3xl text-primary mb-1">
                    policy
                  </span>
                  <span className="font-label-mono text-label-mono uppercase font-bold text-on-surface">
                    ISO 9001:2015
                  </span>
                  <span className="font-body-sm text-body-sm text-outline">
                    Standard Assurance
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-3">
                  <span className="material-symbols-outlined text-3xl text-primary mb-1">
                    public
                  </span>
                  <span className="font-label-mono text-label-mono uppercase font-bold text-on-surface">
                    IAU Member
                  </span>
                  <span className="font-body-sm text-body-sm text-outline">
                    Intl Assoc of Univs
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="w-full bg-surface-container-low py-space-xl mt-space-xl">
        <div className="w-full px-margin max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="relative flex items-center justify-center mb-space-sm">
              <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center shadow-md relative overflow-hidden">
                {/* Shield Background & Emblem */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary to-primary-container opacity-95"></div>
                <div className="relative z-10 flex flex-col items-center justify-center text-secondary-fixed">
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    auto_stories
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary-fixed mt-0.5"></div>
                </div>
              </div>
            </div>
            <span className="font-headline-sm text-headline-sm text-primary">
              Veritas University
            </span>
          </div>
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            © 2024 Veritas University Office of the Registrar. All institutional
            rights reserved.
          </div>
          <div className="flex items-center gap-space-lg font-label-md text-label-md text-on-surface-variant">
            <a className="hover:text-on-surface transition-colors" href="#">
              Academic Integrity
            </a>
            <a className="hover:text-on-surface transition-colors" href="#">
              FERPA &amp; Privacy
            </a>
            <a className="hover:text-on-surface transition-colors" href="#">
              Dispute Resolution
            </a>
            <a className="hover:text-on-surface transition-colors" href="#">
              Institutional Directory
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
