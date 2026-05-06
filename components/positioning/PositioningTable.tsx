// What makes us different — calm, factual, no sneering. Three columns:
// SP Automotive · Insurance network shop · Dealer body shop.
// Columns held identical width on desktop. On mobile the table scrolls
// horizontally inside its container so we don't compress the comparisons
// into illegibility.

type Row = {
  label: string;
  sp: boolean;
  network: boolean;
  dealer: boolean;
};

const ROWS: Row[] = [
  { label: "One owner on every car", sp: true, network: false, dealer: false },
  { label: "OEM parts only", sp: true, network: false, dealer: true },
  { label: "Factory paint depth", sp: true, network: false, dealer: true },
  { label: "ADAS recalibration in-house", sp: true, network: false, dealer: true },
  { label: "Photo updates during repair", sp: true, network: false, dealer: false },
  { label: "Gap tolerances measured to factory data", sp: true, network: false, dealer: true },
  { label: "No subcontractors", sp: true, network: false, dealer: false },
  { label: "Signature on the work", sp: true, network: false, dealer: false },
];

function Cell({ value }: { value: boolean }) {
  return (
    <td className="spec text-center text-lg py-5 border-b border-divider">
      {value ? (
        <span className="text-accent" aria-label="Yes">✓</span>
      ) : (
        <span className="text-muted" aria-label="—">—</span>
      )}
    </td>
  );
}

export default function PositioningTable() {
  return (
    <section className="bg-bg px-6 md:px-10 py-24 md:py-32 border-t border-divider">
      <div className="max-w-5xl mx-auto">
        <p className="eyebrow">What makes us different</p>
        <h2 className="mt-4 display-md">A factual comparison.</h2>
        <p className="editorial mt-6 max-w-2xl">
          There are three places to take an exotic after a collision in Florida. Here is
          what each one actually does.
        </p>

        <div className="mt-12 overflow-x-auto -mx-6 md:mx-0 px-6 md:px-0">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr>
                <th className="text-left py-5 border-b border-accent w-[40%]">
                  <span className="eyebrow">Capability</span>
                </th>
                <th className="text-center py-5 border-b border-accent w-[20%]">
                  <span className="eyebrow text-accent">SP Automotive</span>
                </th>
                <th className="text-center py-5 border-b border-divider w-[20%]">
                  <span className="eyebrow">Network shop</span>
                </th>
                <th className="text-center py-5 border-b border-divider w-[20%]">
                  <span className="eyebrow">Dealer body shop</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label}>
                  <td className="editorial py-5 pr-4 border-b border-divider align-middle">
                    {row.label}
                  </td>
                  <Cell value={row.sp} />
                  <Cell value={row.network} />
                  <Cell value={row.dealer} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-10 text-sm text-muted max-w-2xl">
          &ldquo;Network shop&rdquo; means an insurance-direct-repair facility. &ldquo;Dealer body shop&rdquo; means
          a manufacturer-affiliated collision center. Both can do good work. We take a different approach.
        </p>
      </div>
    </section>
  );
}
