"use client";

import { useActionState } from "react";
import { submitQuoteRequest, type QuoteFormState } from "@/app/contact/actions";
import { budgetRanges, projectTypes, timelineOptions } from "@/content/site-content";

const initialState: QuoteFormState = {};

export function QuoteForm() {
  const [state, formAction, pending] = useActionState(submitQuoteRequest, initialState);

  return (
    <form className="quote-form" action={formAction}>
      <div className="form-grid">
        <label>
          Name
          <input type="text" name="name" autoComplete="name" placeholder="Your name" />
        </label>

        <label>
          Email *
          <input type="email" name="email" autoComplete="email" required placeholder="you@example.com" />
        </label>

        <label>
          Phone
          <input type="tel" name="phone" autoComplete="tel" placeholder="Optional" />
        </label>

        <label>
          Location
          <input type="text" name="location" autoComplete="address-level2" placeholder="City, State" />
        </label>

        <label>
          Project Type
          <select name="projectType" defaultValue="">
            <option value="" disabled>
              Select a project type
            </option>
            {projectTypes.map((projectType) => (
              <option key={projectType} value={projectType}>
                {projectType}
              </option>
            ))}
          </select>
        </label>

        <label>
          Budget Range
          <select name="budgetRange" defaultValue="">
            <option value="">Prefer not to say</option>
            {budgetRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </label>

        <label>
          Timeline
          <select name="timeline" defaultValue="">
            <option value="">Select a timeline</option>
            {timelineOptions.map((timeline) => (
              <option key={timeline} value={timeline}>
                {timeline}
              </option>
            ))}
          </select>
        </label>

        <label>
          Measurements
          <input type="text" name="measurements" placeholder="Optional dimensions or notes" />
        </label>
      </div>

      <label>
        Project Description *
        <textarea
          name="description"
          required
          rows={6}
          placeholder="Tell us what you have in mind, where it will live, and how you want it to function."
        />
      </label>

      <label>
        Inspiration Images
        <input type="file" name="files" accept="image/*" multiple />
      </label>

      <div className="quote-form__actions">
        {state.error ? <p className="form-error">{state.error}</p> : null}
        {state.success ? <p className="form-success">{state.success}</p> : null}
        <button type="submit" className="button button--primary" disabled={pending}>
          {pending ? "Submitting..." : "Submit Request"}
        </button>
        <p>Production wiring will store submissions and uploads in Supabase with owner email notifications.</p>
      </div>
    </form>
  );
}
