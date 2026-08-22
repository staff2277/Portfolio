// Contact form -> email pipeline, via Web3Forms.
//
// Why Web3Forms: this project's root `.env` already had a placeholder
// `VITE_WEB3FORMS_KEY` var, a strong signal it was meant to use this
// service. Web3Forms needs no SMTP setup and no npm package -- just a
// free access key (from https://web3forms.com) tied to the destination
// inbox, POSTed to their `/submit` endpoint.
//
// The access key is kept server-side (read from `process.env` in this
// route handler, never sent to the browser) rather than exposed via a
// NEXT_PUBLIC_ var and posted directly from the client -- this route is
// the proxy, so the key never ships in the client JS bundle.

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = (body?.name || "").trim();
  const email = (body?.email || "").trim();
  const message = (body?.message || "").trim();

  if (!name || !email || !message) {
    return Response.json(
      { error: "Name, email, and message are all required." },
      { status: 400 }
    );
  }

  if (!EMAIL_RE.test(email)) {
    return Response.json(
      { error: "That email address doesn't look valid." },
      { status: 400 }
    );
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    console.error(
      "[api/contact] WEB3FORMS_ACCESS_KEY is not set -- add it to .env.local (see handoff.md)."
    );
    return Response.json(
      {
        error:
          "The contact form isn't fully configured yet. Please email directly instead.",
      },
      { status: 500 }
    );
  }

  try {
    const web3formsRes = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `New portfolio message from ${name}`,
        from_name: name,
        email,
        message,
      }),
    });

    const data = await web3formsRes.json();

    if (!data.success) {
      throw new Error(data.message || "Web3Forms rejected the submission.");
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[api/contact] send failed:", err);
    return Response.json(
      {
        error:
          "Something went wrong sending your message. Please try again or email directly.",
      },
      { status: 502 }
    );
  }
}
