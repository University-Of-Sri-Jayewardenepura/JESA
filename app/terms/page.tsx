export default function Terms() {
  return (
    <div className="relative flex min-h-screen flex-col justify-center items-center overflow-hidden">
      <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
        Terms & Conditions
      </h3>
      <div>
        <p className="text-md leading-7 [&:not(:first-child)]:mt-6 py-4">
          Eligibility:
        </p>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-sm max-w-2xl text-white/75">
          <li>
            To be eligible to apply for the JESA 2024 Awards, you must be a
            currently enrolled undergraduate student at our university. Recent
            graduates are not eligible.
          </li>
          <li>
            Students enrolled in the Batch of 2018/19 of the B.Sc. (General)
            Degree (3 years) program can only apply for the Best Innovator
            Award.
          </li>
          <li>
            Applicants must be in good academic standing and not have been
            suspended or expelled from the university.
          </li>
          <li>
            Candidates can apply for a maximum of two (2) award categories.
            Please note that you cannot choose the same award for both
            selections.
          </li>
          <li>
            If you were a member of the JESA Organizing Committee in 2023 or
            2024, you are eligible to apply for up to three (3) award
            categories.
          </li>
        </ul>
      </div>
    </div>
  );
}
