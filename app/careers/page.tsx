import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, PageHero } from "../../components/page-hero";
import { SiteShell } from "../../components/site-shell";
import { jobsList } from "../../lib/content";

export const metadata: Metadata = { title: "Careers", alternates: { canonical: "/careers" } };
export const dynamic="force-dynamic";

export default async function CareersPage() {
  const jobs=await jobsList();
  return <SiteShell><PageHero eyebrow="Careers" title="Build precision with us." description="Genuine, active opportunities at Yone International are published here with accurate roles, locations, dates and application instructions." breadcrumbs={[{ label: "Home", href: "/" }, { label: "Careers" }]} /><section className="section"><div className="site-container">{jobs.length?<div className="content-card-grid">{jobs.map((job)=><article className="content-card" key={job.id}><p className="eyebrow">{job.department||"Yone International"}</p><h2><Link href={`/careers/${job.slug}`}>{job.title}</Link></h2><p>{[job.location,job.employmentType].filter(Boolean).join(" · ")}</p><Link className="inline-link" href={`/careers/${job.slug}`}>View opportunity →</Link></article>)}</div>:<EmptyState title="There are no active vacancies." description="Expired roles are removed from promotion automatically. Yone International does not publish sample jobs." />}</div></section></SiteShell>;
}
