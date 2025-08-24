import { google } from "googleapis"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const user = formData.get("user") as string
    const localisation = formData.get("localisation") as string
    const roomNumber = formData.get("roomNumber") as string
    const domaine = formData.get("domaine") as string
    const problem = formData.get("problem") as string
    const priorite = formData.get("priorite") as string

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      projectId: process.env.GOOGLE_PROJECT_ID,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })
    const spreadsheetId = process.env.GOOGLE_SHEET_ID!

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Feuille1!A:G",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[user, localisation, roomNumber, domaine, problem, priorite]],
      },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Erreur API:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
