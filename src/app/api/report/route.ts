import { NextResponse } from "next/server"
import { google } from "googleapis"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const user = formData.get("user") as string
    const localisation = formData.get("localisation") as string
    const roomNumber = formData.get("roomNumber") as string
    const domaine = formData.get("domaine") as string
    const problem = formData.get("problem") as string
    const priorite = formData.get("priorite") as string
    const photo = formData.get("photo") as File | null

    // Connexion Google Sheets
    const auth = new google.auth.GoogleAuth({
      keyFile: "./credentials/vbproject-469819-04a999422018.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })
    const sheets = google.sheets({ version: "v4", auth })

    const spreadsheetId = "16ar-ieh5ghpEKlJrx0ZW1Ghc2icAdJjC94WiZCFUFNc"

    // Insérer une nouvelle ligne
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Feuille1!A:G",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            new Date().toLocaleString("fr-FR"),
            user,
            localisation,
            roomNumber,
            domaine,
            problem,
            priorite,
            photo ? photo.name : "",
          ],
        ],
      },
    })

    return NextResponse.json({
      success: true,
      message: "✅ Incident enregistré dans Google Sheets",
    })
  } catch (err: any) {
    console.error("Erreur API:", err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}
