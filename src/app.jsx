import { useState, useRef } from "react";

const STEPS = [
  { id: "authority", label: "Authority" },
  { id: "purpose", label: "Purpose" },
  { id: "consideration", label: "Consideration" },
  { id: "competition", label: "Competition" },
  { id: "voluntary", label: "ADA §1342" },
  { id: "augmentation", label: "Augmentation" },
  { id: "additional", label: "Additional" },
  { id: "result", label: "Determination" },
];

const CITATIONS = {
  far1104: { text: "FAR 1.104", full: "The FAR applies to all acquisitions as defined in part 2 of the FAR, except where expressly excluded." },
  far2101acq: { text: "FAR 2.101", full: "\"Acquisition\" means the acquiring by contract with appropriated funds of supplies or services." },
  far2101contract: { text: "FAR 2.101", full: "\"Contract\" means a mutually binding legal relationship obligating the seller to furnish supplies or services and the buyer to pay for them." },
  gaoNoCost: { text: "GAO No-Cost FAQ (2008)", full: "FAR requirements apply only to acquisitions by the government of supplies or services with appropriated funds. Consequently, the FAR does not apply to no-cost procurements. Fidelity & Casualty Co., B-281281 (1999)." },
  cicaMilitary: { text: "10 U.S.C. §2303; Century 21–AAIM Realty, B-246760 (1992)", full: "CICA does not apply to no-cost contracts of military agencies." },
  elation: { text: "LCPtracker/Elation Systems, B-410752.3 (GAO 2015)", full: "Adequate consideration exists where a contractor promises to perform certain services, the government promises to grant the contractor the right to perform the procured services, and both parties obtain benefits from the arrangement." },
  ricksMushroomConsideration: { text: "Rick's Mushroom Serv. v. United States, 76 Fed. Cl. 250 (2007)", full: "To be enforceable, a contract with the United States government requires an offer, acceptance of the offer, and consideration." },
  voluntaryServices: { text: "31 U.S.C. §1342", full: "An officer or employee of the United States Government may not accept voluntary services or employ personal services exceeding that authorized by law except for emergencies involving the safety of human life or the protection of property." },
  gaoVoluntary: { text: "GAO B-324214 (Treasury ADA Violation)", full: "An agency may accept unpaid services only when someone offering such services executes an advance written agreement that (1) states that the services are offered without expectation of payment, and (2) expressly waives any future pay claims against the government." },
  gaoVoluntaryContract: { text: "24 Comp. Gen. 272, 274 (1943)", full: "Services received by an agency free of cost pursuant to a formal contract or agreement do not constitute 'voluntary services' under the ADA." },
  augmentation: { text: "72 Comp. Gen. 164, 165 (1993)", full: "An agency may not circumvent limitations on its appropriations by augmenting its appropriations from sources outside the government, unless Congress has so authorized." },
  usc4021: { text: "10 U.S.C. §4021", full: "The Secretary of Defense and the Secretary of each military department may enter into transactions (other than contracts, cooperative agreements, and grants) in carrying out basic, applied, and advanced research projects." },
  usc4022: { text: "10 U.S.C. §4022", full: "Authority to carry out prototype projects. Requires at least one nontraditional defense contractor or nonprofit research institution participating to a significant extent, or all significant participants are small businesses/NDCs, or at least one-third cost share, or SPE exceptional circumstances determination." },
  usc4023: { text: "10 U.S.C. §4023", full: "The Secretary of Defense and the Secretaries of the military departments may each buy ordnance, signal, chemical activity, transportation, energy, medical, space-flight, telecommunications, and aeronautical supplies necessary for experimental or test purposes. Purchases may be made by contract or otherwise. Chapter 137 (CICA/FAR) applies only when purchases exceed experimental quantities." },
  otUnfunded: { text: "Strategic Institute OT Guide (2021)", full: "OT agreements may be fully funded, partially funded (shared funding), unfunded, and funds may be paid to the agency." },
  otElements: { text: "32 CFR Part 3 (Proposed Rule, 89 FR 71865, Sept. 2024)", full: "OT agreements for prototype projects are legally binding instruments that include the elements of: offer; acceptance; consideration; authority; a legal purpose; a meeting of the minds; and are approved by an Agreements Officer." },
  dd254Requirement: { text: "DFARS 204.404; DoDM 5220.22 (NISPOM)", full: "The DD Form 254 conveys security classification requirements to contractors performing classified work. DCSA validates bona fide need to access classified information." },
  buyingIn: { text: "FAR 3.501; GAO B-193001", full: "Although buying-in is discouraged, the practice is not illegal and does not preclude acceptance of a below-cost bid." },
  dcsaRejection: { text: "DCSA FCL Sponsorship Data", full: "52% of FCL sponsorships are rejected, with common reasons including lack of justification and no demonstrated need for access to classified information." },
  kiewit: { text: "Kiewit Infrastructure West, B-419687 (GAO 2021)", full: "In the context of fixed-price contracts, there is nothing objectionable in an offeror's proposal of low or even below-cost prices." },
  satoTravel: { text: "SatoTravel, B-287655 (GAO 2001)", full: "GAO found it acceptable for an offeror to propose a negative value for each option period, providing services at no cost to the government." },
};

function Cite({ id }) {
  const c = CITATIONS[id];
  if (!c) return null;
  return (
    <span
      className="cite-tag"
      title={c.full}
    >
      {c.text}
    </span>
  );
}

function RadioGroup({ name, options, value, onChange }) {
  return (
    <div className="radio-group">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`radio-option ${value === opt.value ? "selected" : ""}`}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          <span className="radio-dot" />
          <span className="radio-label">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, multiline }) {
  if (multiline) {
    return (
      <textarea
        className="text-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
    );
  }
  return (
    <input
      className="text-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function CheckGroup({ options, values, onChange }) {
  const toggle = (val) => {
    if (values.includes(val)) onChange(values.filter((v) => v !== val));
    else onChange([...values, val]);
  };
  return (
    <div className="radio-group">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`radio-option ${values.includes(opt.value) ? "selected" : ""}`}
        >
          <input
            type="checkbox"
            checked={values.includes(opt.value)}
            onChange={() => toggle(opt.value)}
          />
          <span className="check-dot">{values.includes(opt.value) ? "✓" : ""}</span>
          <span className="radio-label">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

function Question({ label, citation, children, note }) {
  return (
    <div className="question-block">
      <div className="question-label">
        {label}
        {citation && (
          <span className="question-cite">
            <Cite id={citation} />
          </span>
        )}
      </div>
      {note && <div className="question-note">{note}</div>}
      {children}
    </div>
  );
}

function StepAuthority({ data, update }) {
  return (
    <div className="step-content">
      <div className="step-header">
        <h2>Instrument Type & Warrant Authority</h2>
        <p className="step-desc">
          Identify the proposed instrument and the awarding official's authority. The instrument type determines which legal framework governs the award and whether the FAR's definitional requirements apply.
        </p>
      </div>
      <Question
        label="What type of instrument is contemplated?"
        citation="far2101contract"
        note="A FAR-based contract requires appropriated funds per FAR 2.101. Non-FAR instruments (OTs, §4023 agreements) operate under independent statutory authority."
      >
        <RadioGroup
          name="instrumentType"
          value={data.instrumentType}
          onChange={(v) => update({ instrumentType: v })}
          options={[
            { value: "far_contract", label: "FAR-based contract" },
            { value: "ot_4021", label: "Research OT (10 U.S.C. §4021)" },
            { value: "ot_4022", label: "Prototype OT (10 U.S.C. §4022)" },
            { value: "ot_4023", label: "Procurement for Experimental Purposes (10 U.S.C. §4023)" },
            { value: "other", label: "Other non-FAR agreement" },
          ]}
        />
      </Question>
      <Question
        label="What warrant authority does the awarding official hold?"
        note="An AO warrant provides independent statutory authority for non-FAR instruments. A CO warrant derives from FAR-based delegation and may not extend to $0 instruments outside the FAR's definition of 'acquisition.'"
      >
        <RadioGroup
          name="warrantType"
          value={data.warrantType}
          onChange={(v) => update({ warrantType: v })}
          options={[
            { value: "co_only", label: "Contracting Officer (CO) warrant only" },
            { value: "ao_only", label: "Agreements Officer (AO) warrant only" },
            { value: "both", label: "Both CO and AO warrants" },
          ]}
        />
      </Question>
      {(data.warrantType === "ao_only" || data.warrantType === "both") && (
        <Question
          label="Does the AO warrant expressly cover the selected instrument type?"
          citation={data.instrumentType === "ot_4023" ? "usc4023" : data.instrumentType === "ot_4022" ? "usc4022" : "usc4021"}
          note="Verify the warrant instrument's scope. Some AO warrants are limited to §4021/§4022; others cover the full range of non-FAR authorities including §4023."
        >
          <RadioGroup
            name="warrantCovers"
            value={data.warrantCovers}
            onChange={(v) => update({ warrantCovers: v })}
            options={[
              { value: "yes", label: "Yes — warrant expressly covers this authority" },
              { value: "no", label: "No — warrant does not cover this authority" },
              { value: "unclear", label: "Unclear — warrant language is ambiguous" },
            ]}
          />
        </Question>
      )}
      <Question label="Name and title of the awarding official">
        <TextInput value={data.officialName} onChange={(v) => update({ officialName: v })} placeholder="e.g., Maj Jane Doe, Agreements Officer" />
      </Question>
    </div>
  );
}

function StepPurpose({ data, update }) {
  return (
    <div className="step-content">
      <div className="step-header">
        <h2>Purpose & Bona Fide Need</h2>
        <p className="step-desc">
          The instrument must serve a legitimate acquisition purpose independent of the DD254 requirement. Using a contract solely as a vehicle to generate a DD254 inverts the instrument's purpose.
        </p>
      </div>
      <Question
        label="What is the primary purpose of the proposed instrument?"
        citation="dd254Requirement"
        note="Describe the substantive work the contractor will perform. The DD254 should be incident to classified performance requirements, not the instrument's raison d'être."
      >
        <TextInput multiline value={data.primaryPurpose} onChange={(v) => update({ primaryPurpose: v })} placeholder="Describe the substantive performance requirement..." />
      </Question>
      <Question
        label="Does the instrument require substantive contractor performance beyond mere DD254 processing?"
        note="DCSA validates bona fide need for classified access. An instrument without genuine performance requirements will likely be rejected at the FCL sponsorship stage."
        citation="dcsaRejection"
      >
        <RadioGroup
          name="substantivePerformance"
          value={data.substantivePerformance}
          onChange={(v) => update({ substantivePerformance: v })}
          options={[
            { value: "yes", label: "Yes — contractor will perform substantive classified work" },
            { value: "partial", label: "Partial — some substantive work, but DD254 is a significant motivator" },
            { value: "no", label: "No — the primary purpose is to generate a DD254" },
          ]}
        />
      </Question>
      {data.instrumentType === "ot_4023" && (
        <Question
          label="Does the work qualify as experimental or test purposes?"
          citation="usc4023"
          note="§4023 requires that procurements be 'necessary for experimental or test purposes in the development of the best supplies needed for national defense.' The work must involve genuine experimentation, testing, or technical evaluation."
        >
          <RadioGroup
            name="experimentalPurpose"
            value={data.experimentalPurpose}
            onChange={(v) => update({ experimentalPurpose: v })}
            options={[
              { value: "yes", label: "Yes — work involves experimentation, testing, or technical evaluation" },
              { value: "no", label: "No — work is not experimental in nature" },
            ]}
          />
        </Question>
      )}
      {data.instrumentType === "ot_4022" && (
        <Question
          label="Does the work qualify as a prototype project?"
          citation="usc4022"
          note="Prototype projects can address proof of concept, model, process (including business process), creation, design, development, or demonstration of operational utility."
        >
          <RadioGroup
            name="prototypeQualifies"
            value={data.prototypeQualifies}
            onChange={(v) => update({ prototypeQualifies: v })}
            options={[
              { value: "yes", label: "Yes — work constitutes a prototype project" },
              { value: "no", label: "No — work does not qualify as prototyping" },
            ]}
          />
        </Question>
      )}
    </div>
  );
}

function StepConsideration({ data, update }) {
  return (
    <div className="step-content">
      <div className="step-header">
        <h2>Consideration Analysis</h2>
        <p className="step-desc">
          Consideration is a two-way valve — both parties must give and receive something of value. A $0 instrument requires you to clearly identify what the government gets from the contractor (the government's consideration) and what the contractor gets from the arrangement (the contractor's consideration). Neither side can be empty.
        </p>
      </div>

      <div className="section-divider">What the Government Receives</div>

      <div className="info-callout" style={{marginBottom: 20}}>
        <div className="info-callout-header">Why This Matters</div>
        <div className="info-callout-body">
          The government's consideration is the benefit it derives from the contractor's performance. In a funded contract, this is straightforward — the government pays money and receives supplies or services. In a $0 instrument, the government still receives something of value; it simply doesn't pay cash for it. The government's consideration must be real, substantive, and connected to a legitimate mission need.
        </div>
      </div>

      <Question
        label="What tangible benefit does the government receive from this arrangement?"
        citation="dd254Requirement"
        note="Identify the specific deliverables, capabilities, or outcomes the government will obtain. The government must receive genuine value — not just a vehicle for DD254 processing."
      >
        <CheckGroup
          options={[
            { value: "research_data", label: "Research data, findings, or technical reports" },
            { value: "prototype", label: "A prototype, proof of concept, or demonstration" },
            { value: "test_results", label: "Test or evaluation results on government-relevant technology" },
            { value: "classified_services", label: "Classified services directly supporting a program of record" },
            { value: "technical_expertise", label: "Technical expertise or advisory services" },
            { value: "sw_tool", label: "Software, tools, or analytical capabilities" },
            { value: "other_gov_benefit", label: "Other tangible benefit" },
          ]}
          values={data.govBenefit}
          onChange={(v) => update({ govBenefit: v })}
        />
      </Question>
      {data.govBenefit.includes("other_gov_benefit") && (
        <Question label="Describe the other benefit to the government:">
          <TextInput value={data.otherGovBenefit} onChange={(v) => update({ otherGovBenefit: v })} placeholder="Describe..." />
        </Question>
      )}

      <Question
        label="How does this benefit advance SSC's mission?"
        note="Connect the contractor's performance to a specific program, capability gap, or mission requirement. This strengthens both the bona fide need determination and the government's consideration argument."
      >
        <TextInput multiline value={data.missionConnection} onChange={(v) => update({ missionConnection: v })} placeholder="e.g., Supports technology maturation for [program], addresses capability gap in [area], provides classified technical evaluation needed for [milestone]..." />
      </Question>

      <Question
        label="Would the government obtain equivalent value from a funded contract for the same work?"
        note="If the answer is yes, that confirms the government is receiving real consideration — the only difference is that the contractor has elected not to charge for it. This is the functional test: if the government would pay for this work in other circumstances, the work itself is the government's consideration."
      >
        <RadioGroup
          name="equivalentValue"
          value={data.equivalentValue}
          onChange={(v) => update({ equivalentValue: v })}
          options={[
            { value: "yes", label: "Yes — this work has clear market value the government would otherwise pay for" },
            { value: "partial", label: "Partial — some elements have market value, others are nominal" },
            { value: "no", label: "No — the work product has little independent value to the government" },
          ]}
        />
      </Question>

      <div className="section-divider">What the Contractor Receives</div>

      <div className="info-callout" style={{marginBottom: 20}}>
        <div className="info-callout-header">Why This Matters</div>
        <div className="info-callout-body">
          <div className="info-cite-row"><Cite id="elation" /> GAO held that "adequate consideration exists where a contractor promises to perform certain services, the government promises to grant the contractor the right to perform the procured services, and both parties obtain benefits from the arrangement."</div>
          <div style={{marginTop: 8}}>The contractor's consideration need not be monetary. GAO has recognized market visibility, customer access, franchise rights, past performance credit, workforce continuity, and strategic market positioning as sufficient non-monetary consideration.</div>
        </div>
      </div>

      <Question
        label="What non-monetary benefit does the contractor derive from this arrangement?"
        citation="elation"
        note="Select all forms of consideration the contractor will receive. At least one must be identifiable."
      >
        <CheckGroup
          options={[
            { value: "market_visibility", label: "Market visibility / exposure to expanded user or customer base" },
            { value: "exclusive_access", label: "Exclusive access, franchise right, or preferred positioning" },
            { value: "past_performance", label: "Past performance credit on a classified or high-profile program" },
            { value: "follow_on", label: "Positioning for future competitive opportunities" },
            { value: "third_party_revenue", label: "Access to third-party revenue stream (concession model)" },
            { value: "workforce_continuity", label: "Workforce continuity or retention of cleared personnel" },
            { value: "market_entry", label: "Market entry — establishing presence in a new domain" },
            { value: "other_nonmonetary", label: "Other non-monetary benefit" },
          ]}
          values={data.govConsideration}
          onChange={(v) => update({ govConsideration: v })}
        />
      </Question>
      {data.govConsideration.includes("other_nonmonetary") && (
        <Question label="Describe the other non-monetary consideration:">
          <TextInput value={data.otherGovConsideration} onChange={(v) => update({ otherGovConsideration: v })} placeholder="Describe..." />
        </Question>
      )}

      <Question
        label="Describe specifically what the contractor will deliver or perform:"
        citation="ricksMushroomConsideration"
        note="This is the contractor's affirmative obligation — the performance that constitutes the contractor's side of the bargain."
      >
        <TextInput multiline value={data.contractorConsideration} onChange={(v) => update({ contractorConsideration: v })} placeholder="Describe the supplies, services, research, prototyping, or other deliverables the contractor will provide..." />
      </Question>

      <Question
        label="Has the contractor articulated an independent business rationale for performing at $0?"
        citation="kiewit"
        note="GAO has recognized legitimate business reasons including: market entry (Elation Systems, B-410752.3), workforce continuity, loss-leader strategy (Kiewit, B-419687), marketing cost savings, and strategic positioning (SatoTravel, B-287655). The contractor's willingness to articulate this rationale strengthens the consideration analysis."
      >
        <RadioGroup
          name="businessRationale"
          value={data.businessRationale}
          onChange={(v) => update({ businessRationale: v })}
          options={[
            { value: "yes", label: "Yes — contractor has articulated a business rationale" },
            { value: "no", label: "No — no independent business rationale identified" },
            { value: "unknown", label: "Unknown — not yet discussed with contractor" },
          ]}
        />
      </Question>
      {data.businessRationale === "yes" && (
        <Question label="Summarize the contractor's stated business rationale:">
          <TextInput multiline value={data.businessRationaleDesc} onChange={(v) => update({ businessRationaleDesc: v })} placeholder="e.g., Contractor seeks to establish past performance in classified space domain, offset by projected follow-on competitive positioning..." />
        </Question>
      )}
    </div>
  );
}

function StepCompetition({ data, update }) {
  return (
    <div className="step-content">
      <div className="step-header">
        <h2>Competition</h2>
        <p className="step-desc">
          A $0 action fundamentally changes the competition landscape. CICA does not apply to no-cost contracts of military agencies, and the FAR — including its competition requirements — does not apply to no-cost procurements at all. Competition conducted on a $0 action strengthens the record but is generally not legally required.
        </p>
      </div>

      <div className="info-callout">
        <div className="info-callout-header">Key Legal Framework</div>
        <div className="info-callout-body">
          <div className="info-cite-row"><Cite id="cicaMilitary" /> CICA does not apply to no-cost contracts of military agencies.</div>
          <div className="info-cite-row"><Cite id="gaoNoCost" /> The FAR does not apply to no-cost procurements conducted by either defense or civilian agencies.</div>
          <div className="info-cite-row"><Cite id="usc4023" /> §4023 exempts experimental-quantity purchases from Chapter 137 (CICA/FAR) entirely.</div>
          <div className="info-cite-row" style={{marginTop: 8, fontStyle: "italic", color: "var(--text-dim)"}}>While §4022 contains its own statutory language requiring "competitive procedures to the maximum extent practicable," this requirement operates independently of CICA and is subject to the practicability qualification. For an unfunded/no-cost OT, this imposes a documentation expectation rather than a hard competition gate.</div>
        </div>
      </div>

      <Question
        label="Was any form of competition conducted?"
        note="Competition is not legally required for a $0 military agency action. However, GAO retains jurisdiction to review no-cost procurement actions for overall reasonableness. Documenting that the selected contractor is the most capable or appropriate source strengthens the record."
      >
        <RadioGroup
          name="competed"
          value={data.competed}
          onChange={(v) => update({ competed: v })}
          options={[
            { value: "full", label: "Full and open competition was conducted" },
            { value: "limited", label: "Limited competition (multiple sources considered)" },
            { value: "sole_source", label: "Directed to a specific contractor without competition" },
          ]}
        />
      </Question>
      {data.competed === "sole_source" && (
        <Question
          label="Rationale for directing to this contractor:"
          note="While a formal J&A is not required, documenting the basis for contractor selection is a best practice. GAO reviews no-cost military procurements for reasonableness even absent CICA applicability. (Century 21–AAIM Realty, B-246760 (1992))."
        >
          <TextInput multiline value={data.soleSourceBasis} onChange={(v) => update({ soleSourceBasis: v })} placeholder="e.g., Only contractor with requisite FCL and technical capability, existing relationship with the program, unique expertise in the classified domain..." />
        </Question>
      )}
      {data.instrumentType === "ot_4022" && (
        <Question
          label="Which §4022(d)(1) participation condition is met?"
          citation="usc4022"
          note="This is a statutory prerequisite for §4022 prototype OT authority — separate from competition requirements. At least one condition must be met regardless of whether the action is funded or unfunded."
        >
          <RadioGroup
            name="participationCondition"
            value={data.participationCondition}
            onChange={(v) => update({ participationCondition: v })}
            options={[
              { value: "ndc", label: "(A) Nontraditional defense contractor or nonprofit research institution participating significantly" },
              { value: "small_biz", label: "(B) All significant participants are small businesses or NDCs" },
              { value: "cost_share", label: "(C) At least one-third cost share from non-federal sources" },
              { value: "exceptional", label: "(D) SPE exceptional circumstances determination" },
              { value: "none", label: "None — no condition is met" },
            ]}
          />
        </Question>
      )}
    </div>
  );
}

function StepVoluntary({ data, update }) {
  return (
    <div className="step-content">
      <div className="step-header">
        <h2>Antideficiency Act — Voluntary Services (31 U.S.C. §1342)</h2>
        <p className="step-desc">
          The ADA prohibits acceptance of voluntary services. A properly formed no-cost agreement avoids this prohibition, but specific safeguards must be in place.
        </p>
      </div>
      <Question
        label="Will the contractor execute an advance written agreement waiving future pay claims?"
        citation="gaoVoluntary"
        note="GAO requires an advance written agreement that (1) states the services are offered without expectation of payment and (2) expressly waives any future pay claims against the government. Oral waivers are insufficient — see B-324214 (Treasury ADA violation finding)."
      >
        <RadioGroup
          name="writtenWaiver"
          value={data.writtenWaiver}
          onChange={(v) => update({ writtenWaiver: v })}
          options={[
            { value: "yes", label: "Yes — advance written waiver will be executed before performance" },
            { value: "planned", label: "Planned — will be incorporated into the agreement" },
            { value: "no", label: "No — no written waiver planned" },
          ]}
        />
      </Question>
      <Question
        label="Will the agreement instrument itself contain explicit language establishing the no-cost nature?"
        citation="gaoVoluntaryContract"
        note="Services received pursuant to a formal contract or agreement do not constitute 'voluntary services' under the ADA. The instrument itself provides the critical legal distinction."
      >
        <RadioGroup
          name="instrumentLanguage"
          value={data.instrumentLanguage}
          onChange={(v) => update({ instrumentLanguage: v })}
          options={[
            { value: "yes", label: "Yes — agreement will explicitly state $0 value and no expectation of payment" },
            { value: "no", label: "No" },
          ]}
        />
      </Question>
    </div>
  );
}

function StepAugmentation({ data, update }) {
  return (
    <div className="step-content">
      <div className="step-header">
        <h2>Augmentation of Appropriations</h2>
        <p className="step-desc">
          Agencies may not circumvent appropriations limitations by accepting free services that effectively expand operating capacity beyond what Congress funded.
        </p>
      </div>
      <Question
        label="Would the government otherwise need to pay for these services from appropriated funds?"
        citation="augmentation"
        note="If the no-cost arrangement allows the agency to obtain services it would otherwise have to fund, this may constitute impermissible augmentation of appropriations."
      >
        <RadioGroup
          name="wouldOtherwisePay"
          value={data.wouldOtherwisePay}
          onChange={(v) => update({ wouldOtherwisePay: v })}
          options={[
            { value: "yes", label: "Yes — this work would normally require appropriated funds" },
            { value: "no", label: "No — this is a new capability not otherwise budgeted" },
            { value: "partial", label: "Partially — some elements overlap with funded requirements" },
          ]}
        />
      </Question>
      <Question
        label="Is the no-cost arrangement being used to stretch the agency's budget capacity?"
        note="The critical question is whether the arrangement supplements operating capacity beyond what Congress authorized. A legitimate no-cost agreement serves the contractor's independent business interest, not the agency's budget shortfall."
      >
        <RadioGroup
          name="budgetStretch"
          value={data.budgetStretch}
          onChange={(v) => update({ budgetStretch: v })}
          options={[
            { value: "no", label: "No — the contractor has independent business reasons for the $0 price" },
            { value: "yes", label: "Yes — this is primarily a budget-driven arrangement" },
          ]}
        />
      </Question>
    </div>
  );
}

function StepAdditional({ data, update }) {
  return (
    <div className="step-content">
      <div className="step-header">
        <h2>Additional Considerations</h2>
        <p className="step-desc">
          These secondary factors should be evaluated and documented even if they are not independently dispositive.
        </p>
      </div>
      <Question
        label="Has a potential Organizational Conflict of Interest (OCI) been evaluated?"
        note="A contractor performing at $0 to gain positioning within a classified program may have access advantages over competitors on future procurements. FAR Subpart 9.5 or equivalent OT-level analysis applies."
      >
        <RadioGroup
          name="ociEvaluated"
          value={data.ociEvaluated}
          onChange={(v) => update({ ociEvaluated: v })}
          options={[
            { value: "yes_clear", label: "Yes — evaluated, no OCI identified" },
            { value: "yes_mitigated", label: "Yes — OCI identified and mitigated" },
            { value: "no", label: "No — not yet evaluated" },
          ]}
        />
      </Question>
      <Question
        label="Has buying-in been considered?"
        citation="buyingIn"
        note="While not illegal, buying-in (offering below-cost pricing to win an initial contract with the intent of increasing price on follow-on work) should be evaluated and documented."
      >
        <RadioGroup
          name="buyingIn"
          value={data.buyingIn}
          onChange={(v) => update({ buyingIn: v })}
          options={[
            { value: "not_applicable", label: "Not applicable — no follow-on pricing concern" },
            { value: "evaluated", label: "Evaluated — buying-in risk acknowledged and documented" },
            { value: "concern", label: "Concern — potential buying-in not adequately addressed" },
          ]}
        />
      </Question>
      <Question
        label="Has the SSC ethics advisor reviewed the proposed arrangement?"
        note="5 C.F.R. Part 2635 (Standards of Ethical Conduct) — a contractor's free services could implicate gift rules if not structured as a formal arms-length agreement."
      >
        <RadioGroup
          name="ethicsReview"
          value={data.ethicsReview}
          onChange={(v) => update({ ethicsReview: v })}
          options={[
            { value: "yes", label: "Yes — ethics review completed" },
            { value: "pending", label: "Pending — review in progress" },
            { value: "no", label: "No — not yet reviewed" },
          ]}
        />
      </Question>
      <Question
        label="Has SSC security office reviewed the DD254 requirements?"
        citation="dd254Requirement"
        note="The security office should validate that the classified access requirement is genuine and that the instrument supports a bona fide DD254."
      >
        <RadioGroup
          name="securityReview"
          value={data.securityReview}
          onChange={(v) => update({ securityReview: v })}
          options={[
            { value: "yes", label: "Yes — security office concurs" },
            { value: "pending", label: "Pending" },
            { value: "no", label: "No — not yet reviewed" },
          ]}
        />
      </Question>
      <Question label="Name of the program or effort:">
        <TextInput value={data.programName} onChange={(v) => update({ programName: v })} placeholder="e.g., GPS III Follow-On, OPIR Next Gen..." />
      </Question>
      <Question label="Contractor name:">
        <TextInput value={data.contractorName} onChange={(v) => update({ contractorName: v })} placeholder="e.g., Northrop Grumman, SpaceX..." />
      </Question>
    </div>
  );
}

function generateAnalysis(data) {
  const issues = [];
  const findings = [];
  let permissible = true;
  let cautionary = false;

  // Authority analysis
  if (data.instrumentType === "far_contract") {
    findings.push({
      area: "Authority & FAR Applicability",
      finding: `The proposed instrument is a FAR-based contract. Under FAR 2.101, "acquisition" is defined as "the acquiring by contract with appropriated funds of supplies or services." A $0 contract involves no appropriated funds. GAO holds that "the FAR does not apply to no-cost procurements conducted by either a defense or civilian agency." (Fidelity & Casualty Co., B-281281 (1999); FAR §§1.104, 2.101). This creates a definitional tension: the FAR's own terms suggest the instrument falls outside the FAR's regulatory reach, yet the awarding official is exercising FAR-derived authority.`,
      status: data.warrantType === "co_only" ? "risk" : "caution",
      citations: ["far1104", "far2101acq", "gaoNoCost"],
    });
    if (data.warrantType === "co_only") {
      issues.push("The CO warrant may not provide sufficient authority for a $0 instrument that falls outside the FAR's definition of 'acquisition.' Consider whether AO warrant authority is available.");
      cautionary = true;
    }
  } else if (data.instrumentType === "ot_4023") {
    findings.push({
      area: "Authority — 10 U.S.C. §4023",
      finding: `The proposed instrument is a Procurement for Experimental Purposes under §4023. This authority permits purchases "by contract or otherwise" for experimental or test purposes, and Chapter 137 (CICA/FAR) applies only when purchases exceed experimental quantities. The authority explicitly covers "space-flight" and "telecommunications" supplies within SSC's mission. OT agreements under this authority may be unfunded.${data.warrantCovers === "yes" ? " The AO warrant expressly covers this authority." : data.warrantCovers === "no" ? " However, the AO warrant does not appear to cover this authority, which presents a threshold authority issue." : " The warrant language should be verified to confirm coverage."}`,
      status: data.warrantCovers === "no" ? "risk" : data.warrantCovers === "unclear" ? "caution" : "pass",
      citations: ["usc4023", "otUnfunded"],
    });
    if (data.experimentalPurpose === "no") {
      issues.push("The work does not qualify as experimental or test purposes. §4023 authority is not available for non-experimental procurements.");
      permissible = false;
    }
    if (data.warrantCovers === "no") {
      issues.push("The AO warrant does not cover §4023 authority. The awarding official lacks authority to execute this instrument.");
      permissible = false;
    }
  } else if (data.instrumentType === "ot_4022") {
    findings.push({
      area: "Authority — 10 U.S.C. §4022",
      finding: `The proposed instrument is a Prototype OT under §4022. This authority is exempt from FAR and supports unfunded or partially funded agreements. ${data.prototypeQualifies === "yes" ? "The work qualifies as a prototype project." : "The work may not qualify as a prototype project, which would preclude use of this authority."}${data.participationCondition === "none" ? " No §4022(d)(1) participation condition is met, which is a statutory prerequisite." : ""}`,
      status: data.prototypeQualifies === "no" || data.participationCondition === "none" ? "risk" : "pass",
      citations: ["usc4022", "otElements"],
    });
    if (data.prototypeQualifies === "no") {
      issues.push("Work does not qualify as a prototype project. §4022 authority is not available.");
      permissible = false;
    }
    if (data.participationCondition === "none") {
      issues.push("No §4022(d)(1) participation condition is met. Cannot proceed under §4022.");
      permissible = false;
    }
  } else if (data.instrumentType === "ot_4021") {
    findings.push({
      area: "Authority — 10 U.S.C. §4021",
      finding: `The proposed instrument is a Research OT under §4021. This authority covers basic, applied, and advanced research projects and is independent of the FAR. Research OTs may be unfunded or partially funded.`,
      status: "pass",
      citations: ["usc4021", "otUnfunded"],
    });
  }

  // Purpose analysis
  if (data.substantivePerformance === "no") {
    findings.push({
      area: "Bona Fide Purpose",
      finding: `The instrument's primary purpose is to generate a DD254 rather than to acquire substantive contractor performance. This inverts the relationship between the contract and the security specification — the DD254 is designed to be incident to a classified contract, not the contract's raison d'être. DCSA validates bona fide need for classified access, and 52% of FCL sponsorships are rejected, often for lack of justification or no demonstrated need for classified access.`,
      status: "risk",
      citations: ["dd254Requirement", "dcsaRejection"],
    });
    issues.push("Instrument lacks a bona fide purpose independent of DD254 processing. DCSA will likely reject the FCL sponsorship.");
    permissible = false;
  } else if (data.substantivePerformance === "partial") {
    findings.push({
      area: "Bona Fide Purpose",
      finding: `The instrument includes some substantive performance requirements, but the DD254 appears to be a significant motivator. While not independently fatal, this increases scrutiny risk at both the internal review and DCSA validation stages. The instrument should be structured to emphasize the substantive classified work rather than the DD254 as an output.`,
      status: "caution",
      citations: ["dd254Requirement"],
    });
    cautionary = true;
  } else {
    findings.push({
      area: "Bona Fide Purpose",
      finding: `The instrument requires substantive contractor performance involving classified work. The DD254 is properly incident to legitimate classified performance requirements.`,
      status: "pass",
      citations: ["dd254Requirement"],
    });
  }

  // Consideration analysis — Government's side
  const govBenefitTypes = (data.govBenefit || []).map(v => ({
    research_data: "research data, findings, or technical reports",
    prototype: "a prototype, proof of concept, or demonstration",
    test_results: "test or evaluation results on government-relevant technology",
    classified_services: "classified services directly supporting a program of record",
    technical_expertise: "technical expertise or advisory services",
    sw_tool: "software, tools, or analytical capabilities",
    other_gov_benefit: data.otherGovBenefit || "other tangible benefit",
  }[v])).filter(Boolean).join("; ");

  if ((data.govBenefit || []).length === 0) {
    findings.push({
      area: "Consideration — Government Benefit",
      finding: `No tangible benefit to the government has been identified. For a $0 instrument to be valid, the government must receive real value from the contractor's performance. If the government derives no benefit, the instrument lacks a legitimate acquisition purpose and may also undermine the bona fide need for classified access required to support a DD254.`,
      status: "risk",
      citations: ["dd254Requirement", "ricksMushroomConsideration"],
    });
    issues.push("No government benefit identified. The government must receive tangible value from the contractor's performance.");
    permissible = false;
  } else {
    findings.push({
      area: "Consideration — Government Benefit",
      finding: `The government will receive the following tangible benefits: ${govBenefitTypes}.${data.missionConnection ? ` Mission connection: ${data.missionConnection}.` : ""}${data.equivalentValue === "yes" ? " This work has clear market value that the government would otherwise pay for in a funded arrangement, confirming the government receives real consideration." : data.equivalentValue === "partial" ? " Some elements of the work have market value, though portions may be nominal. The record should document the substantive value components." : data.equivalentValue === "no" ? " The work product has limited independent value to the government, which weakens the consideration analysis on the government's side." : ""}`,
      status: data.equivalentValue === "no" ? "caution" : "pass",
      citations: ["dd254Requirement"],
    });
    if (data.equivalentValue === "no") cautionary = true;
  }

  // Consideration analysis — Contractor's side
  if (data.govConsideration.length === 0) {
    findings.push({
      area: "Consideration — Contractor Benefit",
      finding: `No form of non-monetary consideration to the contractor has been identified. A contract or agreement with the United States requires consideration. (Rick's Mushroom Serv. v. United States, 76 Fed. Cl. 250 (2007)). GAO has held that "adequate consideration exists where a contractor promises to perform certain services, the government promises to grant the contractor the right to perform the procured services, and both parties obtain benefits from the arrangement." (B-410752.3 (2015)). Without identifiable consideration flowing to the contractor, the instrument may be void.`,
      status: "risk",
      citations: ["ricksMushroomConsideration", "elation"],
    });
    issues.push("No consideration to the contractor has been identified. The instrument may be void for lack of consideration.");
    permissible = false;
  } else {
    const considTypes = data.govConsideration.map(v => ({
      market_visibility: "market visibility and exposure to expanded customer base",
      exclusive_access: "exclusive access or franchise right",
      past_performance: "past performance credit on a classified or high-profile program",
      follow_on: "positioning for future competitive opportunities",
      third_party_revenue: "access to a third-party revenue stream",
      workforce_continuity: "workforce continuity and retention of cleared personnel",
      market_entry: "market entry into a new domain",
      other_nonmonetary: data.otherGovConsideration || "other non-monetary benefit",
    }[v])).join("; ");
    findings.push({
      area: "Consideration — Contractor Benefit",
      finding: `The contractor derives the following non-monetary consideration: ${considTypes}. GAO has consistently held that consideration need not be monetary. In LCPtracker/Elation Systems (B-410752.3, 2015), GAO found that market visibility, access to an expanded customer base, and marketing cost savings constituted sufficient consideration for a $0 contract. In Century 21–AAIM Realty (B-246760, 1992), exclusive access to military families as real estate clients provided sufficient consideration.${data.businessRationale === "yes" ? ` The contractor has articulated an independent business rationale: ${data.businessRationaleDesc || "[not described]"}. This further supports the adequacy of consideration.` : ""}`,
      status: data.businessRationale === "no" ? "caution" : "pass",
      citations: ["elation", "kiewit", "satoTravel"],
    });
    if (data.businessRationale === "no") cautionary = true;
  }

  // Competition — $0 actions are generally exempt
  findings.push({
    area: "Competition",
    finding: `This is a $0 action by a military agency. CICA does not apply to no-cost contracts of military agencies (10 U.S.C. §2303; Century 21–AAIM Realty, B-246760 (1992)). The FAR — including its Part 6 competition requirements — does not apply to no-cost procurements (Fidelity & Casualty Co., B-281281 (1999); FAR §§1.104, 2.101).${data.instrumentType === "ot_4023" ? " Additionally, §4023 independently exempts experimental-quantity purchases from Chapter 137 (CICA/FAR)." : data.instrumentType === "ot_4022" ? " While §4022 contains statutory language requiring 'competitive procedures to the maximum extent practicable,' this operates independently of CICA and is subject to the practicability qualification for an unfunded action." : ""} ${data.competed === "full" ? "Full competition was conducted, which strengthens the record though it was not legally required." : data.competed === "limited" ? "Limited competition was conducted, which strengthens the record though it was not legally required." : `The award was directed to ${data.contractorName || "a specific contractor"} without competition.${data.soleSourceBasis ? ` Rationale: ${data.soleSourceBasis}.` : ""} While competition is not legally required for this $0 action, GAO retains jurisdiction to review the overall reasonableness of the procurement.`}`,
    status: "pass",
    citations: ["cicaMilitary", "gaoNoCost"],
  });

  // Voluntary services
  if (data.writtenWaiver === "no") {
    findings.push({
      area: "Antideficiency Act — Voluntary Services (31 U.S.C. §1342)",
      finding: `No advance written waiver of future pay claims is planned. This presents a significant ADA risk. GAO held in B-324214 that Treasury violated the ADA by accepting unpaid services without advance written agreements. Oral waivers were explicitly rejected. The purpose of §1342 is to prevent future pay claims that might exceed available funds. Without a written waiver, the contractor's services may constitute impermissible voluntary services, exposing the awarding official to personal civil or criminal liability under 31 U.S.C. §§1349–1350.`,
      status: "risk",
      citations: ["voluntaryServices", "gaoVoluntary"],
    });
    issues.push("No written waiver of voluntary services planned. This is a potential ADA violation with personal liability risk.");
    permissible = false;
  } else {
    findings.push({
      area: "Antideficiency Act — Voluntary Services (31 U.S.C. §1342)",
      finding: `${data.writtenWaiver === "yes" ? "An advance written waiver will be executed" : "A written waiver is planned for incorporation into the agreement"}. GAO has held that services received pursuant to a formal contract or agreement do not constitute "voluntary services" under the ADA (24 Comp. Gen. 272, 274 (1943)). ${data.instrumentLanguage === "yes" ? "The agreement instrument will contain explicit language establishing the no-cost nature and the contractor's waiver of future pay claims, satisfying GAO's requirements." : "The instrument should contain explicit no-cost language and waiver provisions."}`,
      status: data.instrumentLanguage === "yes" ? "pass" : "caution",
      citations: ["gaoVoluntaryContract", "gaoVoluntary"],
    });
    if (data.instrumentLanguage !== "yes") cautionary = true;
  }

  // Augmentation
  if (data.budgetStretch === "yes") {
    findings.push({
      area: "Augmentation of Appropriations",
      finding: `The no-cost arrangement appears to be primarily budget-driven, which raises impermissible augmentation concerns. An agency may not circumvent limitations on its appropriations by augmenting from outside sources unless Congress has so authorized. (72 Comp. Gen. 164, 165 (1993)). If the arrangement allows the agency to obtain services it would otherwise need to fund, it effectively expands operating capacity beyond what Congress appropriated.`,
      status: "risk",
      citations: ["augmentation"],
    });
    issues.push("Arrangement appears to augment appropriations impermissibly.");
    permissible = false;
  } else {
    findings.push({
      area: "Augmentation of Appropriations",
      finding: `The no-cost arrangement is driven by the contractor's independent business interest rather than the agency's budget constraints. ${data.wouldOtherwisePay === "no" ? "This is a new capability not otherwise budgeted, further reducing augmentation risk." : data.wouldOtherwisePay === "partial" ? "Some elements overlap with funded requirements, which should be documented to demonstrate the arrangement is not driven by budget shortfalls." : "While this work would normally require appropriated funds, the contractor's independent business rationale for the $0 pricing distinguishes this from impermissible augmentation."}`,
      status: data.wouldOtherwisePay === "yes" ? "caution" : "pass",
      citations: ["augmentation"],
    });
    if (data.wouldOtherwisePay === "yes") cautionary = true;
  }

  // Additional
  const additionalNotes = [];
  if (data.ociEvaluated === "no") { additionalNotes.push("OCI evaluation has not been completed."); cautionary = true; }
  if (data.buyingIn === "concern") { additionalNotes.push("Potential buying-in concern has not been adequately addressed."); cautionary = true; }
  if (data.ethicsReview === "no") { additionalNotes.push("Ethics review has not been completed."); cautionary = true; }
  if (data.securityReview === "no") { additionalNotes.push("SSC security office has not reviewed the DD254 requirements."); cautionary = true; }
  if (additionalNotes.length > 0) {
    findings.push({
      area: "Additional Considerations",
      finding: `The following items remain open and should be resolved before award: ${additionalNotes.join(" ")}`,
      status: "caution",
      citations: [],
    });
  }

  // Overall determination
  let determination;
  if (!permissible) {
    determination = "NOT PERMISSIBLE";
  } else if (cautionary) {
    determination = "PERMISSIBLE WITH CONDITIONS";
  } else {
    determination = "PERMISSIBLE";
  }

  return { findings, issues, determination, permissible, cautionary };
}

function StepResult({ data }) {
  const analysis = generateAnalysis(data);
  const resultRef = useRef(null);
  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const statusIcon = (s) => s === "pass" ? "✓" : s === "caution" ? "⚠" : "✗";
  const statusColor = (s) => s === "pass" ? "var(--green)" : s === "caution" ? "var(--amber)" : "var(--red)";

  return (
    <div className="step-content result-step" ref={resultRef}>
      <div className="step-header">
        <h2>Determination</h2>
        <p className="step-desc">
          Analysis generated {dateStr}. This determination is a decision-support tool and does not constitute legal advice. Coordinate with SSC Office of General Counsel before award.
        </p>
      </div>

      <div className={`determination-banner determination-${analysis.determination === "PERMISSIBLE" ? "pass" : analysis.determination === "NOT PERMISSIBLE" ? "fail" : "caution"}`}>
        <div className="determination-label">Determination</div>
        <div className="determination-value">{analysis.determination}</div>
        {data.programName && <div className="determination-program">{data.programName}{data.contractorName ? ` — ${data.contractorName}` : ""}</div>}
      </div>

      {analysis.issues.length > 0 && (
        <div className="issues-block">
          <h3>Threshold Issues</h3>
          {analysis.issues.map((issue, i) => (
            <div key={i} className="issue-item">
              <span className="issue-icon">✗</span>
              <span>{issue}</span>
            </div>
          ))}
        </div>
      )}

      <div className="findings-block">
        <h3>Analysis</h3>
        {analysis.findings.map((f, i) => (
          <div key={i} className="finding-item">
            <div className="finding-header">
              <span className="finding-status" style={{ color: statusColor(f.status) }}>{statusIcon(f.status)}</span>
              <span className="finding-area">{f.area}</span>
            </div>
            <div className="finding-text">{f.finding}</div>
            {f.citations.length > 0 && (
              <div className="finding-cites">
                {f.citations.map((c) => <Cite key={c} id={c} />)}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="meta-block">
        <div className="meta-row"><span className="meta-label">Instrument Type:</span> <span>{({far_contract:"FAR-based Contract",ot_4021:"Research OT (§4021)",ot_4022:"Prototype OT (§4022)",ot_4023:"Procurement for Experimental Purposes (§4023)",other:"Other Non-FAR Agreement"})[data.instrumentType] || "—"}</span></div>
        <div className="meta-row"><span className="meta-label">Awarding Official:</span> <span>{data.officialName || "—"}</span></div>
        <div className="meta-row"><span className="meta-label">Program:</span> <span>{data.programName || "—"}</span></div>
        <div className="meta-row"><span className="meta-label">Contractor:</span> <span>{data.contractorName || "—"}</span></div>
        <div className="meta-row"><span className="meta-label">Date:</span> <span>{dateStr}</span></div>
      </div>

      <div className="disclaimer-block">
        <strong>DISCLAIMER:</strong> This tool provides analytical support for contracting officer decision-making. It does not constitute a legal opinion. All $0 contract/agreement determinations should be coordinated with the SSC Office of General Counsel, the cognizant security office, and the ethics advisor prior to award. The analysis is based on unclassified facts provided by the user and applies prevailing law, regulation, and GAO precedent as of March 2026.
      </div>
    </div>
  );
}

const INITIAL_DATA = {
  instrumentType: "",
  warrantType: "",
  warrantCovers: "",
  officialName: "",
  primaryPurpose: "",
  substantivePerformance: "",
  experimentalPurpose: "",
  prototypeQualifies: "",
  govBenefit: [],
  otherGovBenefit: "",
  missionConnection: "",
  equivalentValue: "",
  govConsideration: [],
  otherGovConsideration: "",
  contractorConsideration: "",
  businessRationale: "",
  businessRationaleDesc: "",
  competed: "",
  soleSourceBasis: "",
  participationCondition: "",
  writtenWaiver: "",
  instrumentLanguage: "",
  wouldOtherwisePay: "",
  budgetStretch: "",
  ociEvaluated: "",
  buyingIn: "",
  ethicsReview: "",
  securityReview: "",
  programName: "",
  contractorName: "",
};

export default function App() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(INITIAL_DATA);

  const update = (partial) => setData((prev) => ({ ...prev, ...partial }));
  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  const renderStep = () => {
    switch (currentStep.id) {
      case "authority": return <StepAuthority data={data} update={update} />;
      case "purpose": return <StepPurpose data={data} update={update} />;
      case "consideration": return <StepConsideration data={data} update={update} />;
      case "competition": return <StepCompetition data={data} update={update} />;
      case "voluntary": return <StepVoluntary data={data} update={update} />;
      case "augmentation": return <StepAugmentation data={data} update={update} />;
      case "additional": return <StepAdditional data={data} update={update} />;
      case "result": return <StepResult data={data} />;
      default: return null;
    }
  };

  return (
    <div className="app-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --bg: #0b0e14;
          --surface: #12161f;
          --surface2: #1a1f2b;
          --border: #252b3a;
          --border-light: #2f3749;
          --text: #d4d8e3;
          --text-dim: #7a8299;
          --text-bright: #eef0f6;
          --accent: #4a9eff;
          --accent-dim: #1a3a5c;
          --green: #34d399;
          --green-dim: #0d3a2a;
          --amber: #fbbf24;
          --amber-dim: #3a2e0d;
          --red: #f87171;
          --red-dim: #3a1515;
          --font: 'DM Sans', sans-serif;
          --mono: 'JetBrains Mono', monospace;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--font);
          -webkit-font-smoothing: antialiased;
        }

        .app-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .top-bar {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .top-bar-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--accent-dim), var(--surface2));
          border: 1px solid var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: var(--accent);
          flex-shrink: 0;
        }

        .top-bar-text h1 {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-bright);
          letter-spacing: 0.02em;
        }

        .top-bar-text p {
          font-size: 11px;
          color: var(--text-dim);
          margin-top: 1px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .progress-bar {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 0 24px;
          display: flex;
          gap: 0;
          overflow-x: auto;
        }

        .progress-step {
          padding: 10px 16px;
          font-size: 11px;
          font-weight: 500;
          color: var(--text-dim);
          letter-spacing: 0.03em;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
          text-transform: uppercase;
        }

        .progress-step:hover { color: var(--text); }
        .progress-step.active { color: var(--accent); border-bottom-color: var(--accent); }
        .progress-step.completed { color: var(--green); }

        .main-content {
          flex: 1;
          max-width: 760px;
          width: 100%;
          margin: 0 auto;
          padding: 32px 24px 120px;
        }

        .step-content { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        .step-header { margin-bottom: 32px; }
        .step-header h2 { font-size: 22px; font-weight: 600; color: var(--text-bright); margin-bottom: 8px; }
        .step-desc { font-size: 13.5px; color: var(--text-dim); line-height: 1.6; }

        .question-block { margin-bottom: 28px; }
        .question-label { font-size: 14px; font-weight: 500; color: var(--text-bright); line-height: 1.5; margin-bottom: 4px; display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; }
        .question-cite { display: inline; }
        .question-note { font-size: 12.5px; color: var(--text-dim); line-height: 1.55; margin-bottom: 10px; padding-left: 12px; border-left: 2px solid var(--border); }

        .cite-tag {
          display: inline-block;
          font-size: 10.5px;
          font-family: var(--mono);
          font-weight: 400;
          color: var(--accent);
          background: var(--accent-dim);
          padding: 2px 7px;
          border-radius: 3px;
          cursor: help;
          letter-spacing: 0.01em;
          vertical-align: middle;
        }

        .radio-group { display: flex; flex-direction: column; gap: 6px; }

        .radio-option {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 14px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .radio-option:hover { border-color: var(--border-light); background: var(--surface2); }
        .radio-option.selected { border-color: var(--accent); background: var(--accent-dim); }
        .radio-option input { display: none; }

        .radio-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid var(--border-light);
          flex-shrink: 0;
          margin-top: 1px;
          transition: all 0.15s;
          position: relative;
        }

        .radio-option.selected .radio-dot {
          border-color: var(--accent);
          background: var(--accent);
          box-shadow: inset 0 0 0 3px var(--accent-dim);
        }

        .check-dot {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 2px solid var(--border-light);
          flex-shrink: 0;
          margin-top: 1px;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: var(--accent-dim);
        }

        .radio-option.selected .check-dot {
          border-color: var(--accent);
          background: var(--accent);
          color: var(--bg);
          font-weight: 700;
        }

        .radio-label { font-size: 13px; color: var(--text); line-height: 1.4; }

        .text-input {
          width: 100%;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px 14px;
          color: var(--text-bright);
          font-family: var(--font);
          font-size: 13px;
          outline: none;
          transition: border-color 0.15s;
          resize: vertical;
        }

        .text-input:focus { border-color: var(--accent); }
        .text-input::placeholder { color: var(--text-dim); }

        .nav-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--surface);
          border-top: 1px solid var(--border);
          padding: 14px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 100;
        }

        .nav-btn {
          font-family: var(--font);
          font-size: 13px;
          font-weight: 500;
          padding: 9px 22px;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: var(--surface2);
          color: var(--text);
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: 0.02em;
        }

        .nav-btn:hover { border-color: var(--border-light); color: var(--text-bright); }
        .nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .nav-btn.primary {
          background: var(--accent);
          border-color: var(--accent);
          color: var(--bg);
          font-weight: 600;
        }

        .nav-btn.primary:hover { opacity: 0.9; }

        .nav-step-label {
          font-size: 11px;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* Result step styles */
        .determination-banner {
          padding: 24px;
          border-radius: 10px;
          margin-bottom: 28px;
          text-align: center;
          border: 1px solid;
        }

        .determination-pass { background: var(--green-dim); border-color: var(--green); }
        .determination-caution { background: var(--amber-dim); border-color: var(--amber); }
        .determination-fail { background: var(--red-dim); border-color: var(--red); }

        .determination-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-dim); margin-bottom: 6px; }
        .determination-value { font-size: 24px; font-weight: 700; color: var(--text-bright); letter-spacing: 0.04em; }
        .determination-program { font-size: 13px; color: var(--text-dim); margin-top: 6px; }

        .issues-block {
          background: var(--red-dim);
          border: 1px solid rgba(248,113,113,0.3);
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .issues-block h3 { font-size: 13px; font-weight: 600; color: var(--red); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px; }

        .issue-item {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          font-size: 13px;
          line-height: 1.5;
          color: var(--text);
          margin-bottom: 8px;
        }

        .issue-item:last-child { margin-bottom: 0; }
        .issue-icon { color: var(--red); font-weight: 700; flex-shrink: 0; margin-top: 1px; }

        .findings-block { margin-bottom: 24px; }
        .findings-block h3 { font-size: 13px; font-weight: 600; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 16px; }

        .finding-item {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 18px;
          margin-bottom: 12px;
        }

        .finding-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .finding-status { font-size: 16px; font-weight: 700; flex-shrink: 0; }
        .finding-area { font-size: 14px; font-weight: 600; color: var(--text-bright); }
        .finding-text { font-size: 13px; line-height: 1.65; color: var(--text); }
        .finding-cites { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }

        .meta-block {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 18px;
          margin-bottom: 20px;
        }

        .meta-row { display: flex; gap: 8px; font-size: 12.5px; margin-bottom: 6px; }
        .meta-row:last-child { margin-bottom: 0; }
        .meta-label { color: var(--text-dim); font-weight: 500; min-width: 130px; }

        .disclaimer-block {
          font-size: 11px;
          line-height: 1.6;
          color: var(--text-dim);
          padding: 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
        }

        .disclaimer-block strong { color: var(--amber); }

        .reset-btn {
          font-family: var(--font);
          font-size: 11px;
          padding: 6px 14px;
          border-radius: 5px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-dim);
          cursor: pointer;
          transition: all 0.15s;
        }

        .reset-btn:hover { border-color: var(--red); color: var(--red); }

        .section-divider {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--accent);
          margin: 28px 0 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border);
        }

        .info-callout {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .info-callout-header {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-dim);
          padding: 12px 16px 8px;
        }

        .info-callout-body {
          padding: 0 16px 14px;
          font-size: 12.5px;
          line-height: 1.6;
          color: var(--text);
        }

        .info-cite-row {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 6px;
        }
      `}</style>

      <div className="top-bar">
        <div className="top-bar-icon">§</div>
        <div className="top-bar-text">
          <h1>$0 Contract / Agreement Permissibility Determination</h1>
          <p>Space Systems Command — Directorate of Contracting</p>
        </div>
        <div style={{ flex: 1 }} />
        <button className="reset-btn" onClick={() => { setData(INITIAL_DATA); setStep(0); }}>Reset</button>
      </div>

      <div className="progress-bar">
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            className={`progress-step ${i === step ? "active" : ""} ${i < step ? "completed" : ""}`}
            onClick={() => setStep(i)}
          >
            {s.label}
          </div>
        ))}
      </div>

      <div className="main-content">
        {renderStep()}
      </div>

      <div className="nav-bar">
        <button className="nav-btn" disabled={isFirst} onClick={() => setStep(step - 1)}>
          ← Back
        </button>
        <span className="nav-step-label">
          Step {step + 1} of {STEPS.length}
        </span>
        <button
          className={`nav-btn ${isLast ? "" : "primary"}`}
          disabled={isLast}
          onClick={() => setStep(step + 1)}
        >
          {step === STEPS.length - 2 ? "Generate Determination →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}
