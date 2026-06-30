"use client";

import "./flivan.css";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const InfiniteMarquee = dynamic(() => import("@/components/marquee"), { ssr: false });

export default function Home() {
  return (
    <div>

      {/* ══════════════════════════════════════
          SECTION 1 — HEADER
          Flivan: <header class="section__container header__container">
                    <h1 class="section__header">Find And Book…</h1>
                    <img src="assets/header.jpg" />
      ══════════════════════════════════════ */}
      <header className="section__container header__container">
        <h1 className="section__header">
          Design And Build<br />A Smarter Tomorrow
        </h1>
        <img
          src="/images/home/header.jpg"
          alt="Team Maverick India Plane"
        />
      </header>

      {/* ══════════════════════════════════════
          SECTION 2 — BOOKING FORM
          Flivan: <section class="section__container booking__container">
                    .booking__nav  +  form × 4 form__group  +  .btn
      ══════════════════════════════════════ */}
      <section className="section__container booking__container">
        <div className="booking__nav">
          <span>Fixed Wing</span>
          <span>Multirotor</span>
          <span>VTOL</span>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form__group">
            <span><i className="ri-map-pin-line" /></span>
            <div className="input__content">
              <div className="input__group">
                <input type="text" id="b-platform" />
                <label htmlFor="b-platform">Platform</label>
              </div>
              <p>Which UAV are you looking for?</p>
            </div>
          </div>

          <div className="form__group">
            <span><i className="ri-user-3-line" /></span>
            <div className="input__content">
              <div className="input__group">
                <input type="number" id="b-payload" />
                <label htmlFor="b-payload">Payload (kg)</label>
              </div>
              <p>Required payload capacity</p>
            </div>
          </div>

          <div className="form__group">
            <span><i className="ri-timer-line" /></span>
            <div className="input__content">
              <div className="input__group">
                <input type="text" id="b-endurance" />
                <label htmlFor="b-endurance">Endurance</label>
              </div>
              <p>Max flight duration needed</p>
            </div>
          </div>

          <div className="form__group">
            <span><i className="ri-route-line" /></span>
            <div className="input__content">
              <div className="input__group">
                <input type="text" id="b-range" />
                <label htmlFor="b-range">Range (km)</label>
              </div>
              <p>Operational radius</p>
            </div>
          </div>

          <button type="submit" className="btn">
            <i className="ri-search-line" />
          </button>
        </form>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — PLAN (3 numbered steps + 3 stacked photos)
          Flivan: <section class="section__container plan__container">
                    .plan__grid  >  .plan__content  +  .plan__image
      ══════════════════════════════════════ */}
      <section className="section__container plan__container">
        <p className="subheader">MAVERICK JOURNEY</p>
        <h2 className="section__header">Build your UAV with confidence</h2>
        <p className="description">
          From concept to flight — how Team Maverick India brings every aerial
          platform to life, mission-ready.
        </p>

        <div className="plan__grid">
          <div className="plan__content">
            <span className="number">01</span>
            <h4>Conceptual Design</h4>
            <p>
              Every aircraft begins with rigorous research and design. Our
              engineering team defines mission parameters, selects configurations,
              and runs simulations before a single component is cut.
            </p>

            <span className="number">02</span>
            <h4>Fabrication & Integration</h4>
            <p>
              Airframes are built in-house using composite materials and precision
              machining. Avionics, propulsion, and payloads are integrated with
              meticulous attention to weight and balance.
            </p>

            <span className="number">03</span>
            <h4>Test & Fly</h4>
            <p>
              Each platform undergoes a structured test campaign — ground checks,
              hover trials, and incremental envelope expansion — before competing
              on the national and international stage.
            </p>
          </div>

          <div className="plan__image">
            <Image
              src="/images/planes/daredevil.webp"
              alt="Maverick Alpha"
              width={250}
              height={200}
              style={{ objectFit: "cover" }}
            />
            <Image
              src="/images/planes/shourya.webp"
              alt="Maverick Falcon"
              width={260}
              height={200}
              style={{ objectFit: "cover" }}
            />
            <Image
              src="/images/planes/hexacopter.webp"
              alt="Maverick X"
              width={230}
              height={200}
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 4 — MEMORIES (light-grey bg, 3 icon cards)
          Flivan: <section class="memories">
                    .memories__header  +  .memories__grid (3 cards)
      ══════════════════════════════════════ */}
      <section className="memories">
        <div className="section__container memories__container">
          <div className="memories__header">
            <h2 className="section__header">
              Fly to make history all around the world
            </h2>
            <Link href="/team" className="view__all">View Team</Link>
          </div>

          <div className="memories__grid">
            <div className="memories__card">
              <span><i className="ri-rocket-line" /></span>
              <h4>Design &amp; Innovate</h4>
              <p>
                From CAD to CFD, our engineering team designs every airframe
                from scratch — purpose-built for the mission at hand.
              </p>
            </div>

            <div className="memories__card">
              <span><i className="ri-tools-line" /></span>
              <h4>Build &amp; Integrate</h4>
              <p>
                Composite fabrication, avionics integration, and custom
                firmware — every platform is built entirely in-house.
              </p>
            </div>

            <div className="memories__card">
              <span><i className="ri-plane-line" /></span>
              <h4>Compete &amp; Win</h4>
              <p>
                National champions. Global top 10. Team Maverick India
                takes its UAVs to the world's most demanding competitions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 5 — LOUNGE (2 overlapping photos + 4 detail boxes)
          Flivan: <section class="section__container lounge__container">
                    .lounge__image  +  .lounge__content > .lounge__grid
      ══════════════════════════════════════ */}
      <section className="section__container lounge__container">
        <div className="lounge__image">
          <Image
            src="/images/home/aboutus.png"
            alt="Team Maverick"
            width={420}
            height={240}
            style={{ objectFit: "cover" }}
          />
          <Image
            src="/images/home/newabout.png"
            alt="Maverick Build"
            width={300}
            height={180}
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className="lounge__content">
          <h2 className="section__header">Our Engineering Hub</h2>
          <div className="lounge__grid">
            <div className="lounge__details">
              <h4>Design Studio</h4>
              <p>
                A dedicated space for CAD modelling, aerodynamic analysis,
                and structural simulation — where concepts become blueprints.
              </p>
            </div>
            <div className="lounge__details">
              <h4>Fabrication Bay</h4>
              <p>
                Equipped with composite layup tools, CNC machines, and 3D
                printers for building every component in-house.
              </p>
            </div>
            <div className="lounge__details">
              <h4>Avionics Lab</h4>
              <p>
                Flight controllers, telemetry systems, and custom ground
                stations — all developed and tested by our electronics team.
              </p>
            </div>
            <div className="lounge__details">
              <h4>Flight Test Field</h4>
              <p>
                Open-field testing with GPS tracking, telemetry logging,
                and structured test campaigns for every new platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 7 — SUBSCRIBE → SPONSORS
          Flivan: <section class="subscribe">
                    .subscribe__container > h2 + form (input + .btn)
      ══════════════════════════════════════ */}
      <section className="subscribe">
        <div className="section__container subscribe__container">
          <h2 className="section__header">
            Our sponsors &amp; partner network
          </h2>
          <div style={{ marginTop: "2rem" }}>
            <InfiniteMarquee />
          </div>
        </div>
      </section>

    </div>
  );
}
