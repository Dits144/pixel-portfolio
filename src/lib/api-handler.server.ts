/**
 * Server API Handler untuk Raditya Portfolio
 * Menangani endpoint /api/* langsung di server Nitro sebelum diteruskan ke handler SSR
 */

import {
  profileDb,
  skillsDb,
  projectsDb,
  experiencesDb,
  testimonialsDb,
  messagesDb,
  certificatesDb,
  coverLettersDb,
  exportAllDb,
  resetAllDb,
} from "./sqlite.server";

export async function handleApiRequest(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (!pathname.startsWith("/api/")) {
    return null; // Bukan API request, lanjutkan ke SSR
  }

  const method = request.method;
  const jsonResponse = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });

  try {
    // ── /api/status ──────────────────────────────────────────────────────────
    if (pathname === "/api/status" && method === "GET") {
      const skills = skillsDb.list();
      const certificates = certificatesDb.list();
      const projects = projectsDb.list();
      const coverLetters = coverLettersDb.list();
      const messages = messagesDb.list();
      return jsonResponse({
        engine: "SQLite (Server-side persistent WAL)",
        databaseName: "portfolio.db (VPS persistent)",
        status: "connected",
        collectionsCount: {
          skills: skills.length,
          certificates: certificates.length,
          projects: projects.length,
          coverLetters: coverLetters.length,
          profile: 1,
          messages: messages.length,
        },
      });
    }

    // ── /api/profile ─────────────────────────────────────────────────────────
    if (pathname === "/api/profile") {
      if (method === "GET") {
        return jsonResponse(profileDb.get());
      }
      if (method === "PUT" || method === "POST") {
        const body = await request.json();
        profileDb.update(body);
        return jsonResponse(profileDb.get());
      }
    }

    // ── /api/skills ──────────────────────────────────────────────────────────
    if (pathname === "/api/skills") {
      if (method === "GET") {
        return jsonResponse(skillsDb.list());
      }
      if (method === "POST") {
        const body = await request.json();
        const created = skillsDb.create(body);
        return jsonResponse(created, 201);
      }
    }
    if (pathname.startsWith("/api/skills/")) {
      const id = pathname.replace("/api/skills/", "");
      if (method === "PUT") {
        const body = await request.json();
        skillsDb.update(id, body);
        return jsonResponse({ success: true, id });
      }
      if (method === "DELETE") {
        skillsDb.remove(id);
        return jsonResponse({ success: true, id });
      }
    }

    // ── /api/certificates ────────────────────────────────────────────────────
    if (pathname === "/api/certificates") {
      if (method === "GET") {
        return jsonResponse(certificatesDb.list());
      }
      if (method === "POST") {
        const body = await request.json();
        const created = certificatesDb.create(body, "cert");
        return jsonResponse(created, 201);
      }
    }
    if (pathname.startsWith("/api/certificates/")) {
      const id = pathname.replace("/api/certificates/", "");
      if (method === "PUT") {
        const body = await request.json();
        const updated = certificatesDb.update(id, body);
        return jsonResponse(updated);
      }
      if (method === "DELETE") {
        certificatesDb.remove(id);
        return jsonResponse({ success: true, id });
      }
    }

    // ── /api/projects ────────────────────────────────────────────────────────
    if (pathname === "/api/projects") {
      if (method === "GET") {
        return jsonResponse(projectsDb.list());
      }
      if (method === "POST") {
        const body = await request.json();
        const created = projectsDb.create(body, "proj");
        return jsonResponse(created, 201);
      }
    }
    if (pathname.startsWith("/api/projects/")) {
      const id = pathname.replace("/api/projects/", "");
      if (method === "PUT") {
        const body = await request.json();
        const updated = projectsDb.update(id, body);
        return jsonResponse(updated);
      }
      if (method === "DELETE") {
        projectsDb.remove(id);
        return jsonResponse({ success: true, id });
      }
    }

    // ── /api/experiences ─────────────────────────────────────────────────────
    if (pathname === "/api/experiences") {
      if (method === "GET") {
        return jsonResponse(experiencesDb.list());
      }
      if (method === "POST") {
        const body = await request.json();
        const created = experiencesDb.create(body, "exp");
        return jsonResponse(created, 201);
      }
    }
    if (pathname.startsWith("/api/experiences/")) {
      const id = pathname.replace("/api/experiences/", "");
      if (method === "PUT") {
        const body = await request.json();
        const updated = experiencesDb.update(id, body);
        return jsonResponse(updated);
      }
      if (method === "DELETE") {
        experiencesDb.remove(id);
        return jsonResponse({ success: true, id });
      }
    }

    // ── /api/testimonials ────────────────────────────────────────────────────
    if (pathname === "/api/testimonials") {
      if (method === "GET") {
        return jsonResponse(testimonialsDb.list());
      }
      if (method === "POST") {
        const body = await request.json();
        const created = testimonialsDb.create(body, "testi");
        return jsonResponse(created, 201);
      }
    }
    if (pathname.startsWith("/api/testimonials/")) {
      const id = pathname.replace("/api/testimonials/", "");
      if (method === "PUT") {
        const body = await request.json();
        const updated = testimonialsDb.update(id, body);
        return jsonResponse(updated);
      }
      if (method === "DELETE") {
        testimonialsDb.remove(id);
        return jsonResponse({ success: true, id });
      }
    }

    // ── /api/messages ────────────────────────────────────────────────────────
    if (pathname === "/api/messages") {
      if (method === "GET") {
        return jsonResponse(messagesDb.list());
      }
      if (method === "POST") {
        const body = await request.json();
        const created = messagesDb.create(body);
        return jsonResponse(created, 201);
      }
    }
    if (pathname.startsWith("/api/messages/")) {
      const id = pathname.replace("/api/messages/", "");
      if (method === "PUT") {
        const body = await request.json();
        const updated = messagesDb.update(id, body);
        return jsonResponse(updated);
      }
      if (method === "DELETE") {
        messagesDb.remove(id);
        return jsonResponse({ success: true, id });
      }
    }

    // ── /api/cover-letters ───────────────────────────────────────────────────
    if (pathname === "/api/cover-letters") {
      if (method === "GET") {
        return jsonResponse(coverLettersDb.list());
      }
      if (method === "POST") {
        const body = await request.json();
        const created = coverLettersDb.create(body);
        return jsonResponse(created, 201);
      }
    }
    if (pathname.startsWith("/api/cover-letters/")) {
      const id = pathname.replace("/api/cover-letters/", "");
      if (method === "DELETE") {
        coverLettersDb.remove(id);
        return jsonResponse({ success: true, id });
      }
    }

    // ── /api/database (Backup & Reset) ───────────────────────────────────────
    if (pathname === "/api/database/export" && method === "GET") {
      const data = exportAllDb();
      return jsonResponse(data);
    }
    if (pathname === "/api/database/reset" && method === "POST") {
      resetAllDb();
      return jsonResponse({ success: true, message: "Database reset to initial state" });
    }

    return jsonResponse({ error: "Endpoint not found" }, 404);
  } catch (error) {
    console.error(`[API Error] ${method} ${pathname}:`, error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      500
    );
  }
}
