import Link from "next/link";
export default function AccessDenied(){return <main className="admin-auth"><div><p className="eyebrow">Protected administration</p><h1>Access not authorised.</h1><p>This signed-in email is not an active Yone International Owner or Editor.</p><Link className="button button-dark" href="/">Return to website</Link></div></main>;}
