"use client"

import { useState } from "react"

export default function HomePage() {
  const [step, setStep] = useState(1)

  const [selectedUser, setSelectedUser] = useState("")
  const [customUser, setCustomUser] = useState("")

  const [localisation, setLocalisation] = useState("")
  const [roomNumber, setRoomNumber] = useState("")

  const [domaine, setDomaine] = useState("")
  const [probleme, setProbleme] = useState("")
  const [customProblem, setCustomProblem] = useState("")

  const [priorite, setPriorite] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)

  // utilisateurs prédéfinis
  const users = [
    "Dir - Benjamin H",
    "Dir - Solene B.",
    "Heb - Barbara T.",
    "Autre",
  ]

  // localisations prédéfinies
  const localisations = [
    "Chambre",
    "Salle de bain",
    "R-1 - Sous-sol",
    "R0-Reception",
    "R1",
    "R2",
    "R3",
    "R4",
    "R5",
    "Restaurant",
    "Cuisine",
    "Toilettes R-1",
    "Toilettes Homme R0",
    "Toilettes Femme R0",
    "Ascenseur",
    "Autres",
  ]

  // domaines techniques
  const domaines: Record<string, string[]> = {
    "Climatisation": [
      "Bruit hors norme",
      "Fonctionnement anormal",
      "Changement du filtre",
      "Changement de la pompe",
      "Moquette mouillée",
      "Autre...",
    ],
    "Électricité": [
      "Sèche-cheveux HS",
      "Spot à changer",
      "Ampoule à changer",
      "Radiateur Salle de bain",
      "Pas d’électricité",
      "Prise disjonctée",
      "Autre...",
    ],
    "Serrurerie": [
      "Serrure HS",
      "Réinitialisation serrure",
      "Porte grince",
      "Poignée cassée",
      "Fenêtre ne ferme pas",
      "Autre...",
    ],
    "Téléphonie": [
      "Télécommande HS",
      "Téléphone ne marche pas",
      "Coffre-fort bloqué",
      "Autre...",
    ],
    "Peinture": [
      "Plafond à repeindre",
      "Mur à repeindre",
      "Papier peint à changer",
      "Autre...",
    ],
    "Rideau": [
      "Rideau décroché",
      "Cintres à mettre",
      "Triangle rideau à refixer",
      "Autre...",
    ],
    "Alerte": [
      "Punaise de lit",
      "Cafards chambre",
      "Cafards salle de bain",
      "Insectes divers",
      "Pouf à nettoyer",
      "Moquette à nettoyer",
      "Autre...",
    ],
    "Autre": [],
  }

  // priorités
  const priorites = [
    "Urgence – intervention immédiate",
    "À faire dans la journée",
    "À faire cette semaine",
    "À faire dans le mois",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("user", selectedUser === "Autre" ? customUser : selectedUser)
    formData.append("localisation", localisation)
    formData.append("roomNumber", roomNumber)
    formData.append("domaine", domaine)
    formData.append(
      "problem",
      probleme === "Autre..." ? customProblem : probleme
    )
    formData.append("priorite", priorite)
    if (photo) formData.append("photo", photo)

    const res = await fetch("/api/report", {
      method: "POST",
      body: formData,
    })

    const result = await res.json()
    console.log(result)
    if (result.success) {
      alert("✅ Incident enregistré dans Google Sheets !")
      setStep(1)
    } else {
      alert("❌ Erreur : " + result.error)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-200 to-blue-500">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center text-sky-700 mb-6">
          📋 Déclaration d’incident
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1 - User */}
          {step === 1 && (
            <div>
              <label className="block mb-2 font-medium text-sky-800">
                Déclarant
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full p-3 rounded-xl border border-sky-300 focus:ring-2 focus:ring-sky-400 text-gray-800"
                required
              >
                <option value="">-- Sélectionner --</option>
                {users.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
              {selectedUser === "Autre" && (
                <input
                  type="text"
                  placeholder="Nom du déclarant"
                  value={customUser}
                  onChange={(e) => setCustomUser(e.target.value)}
                  className="mt-3 w-full p-3 rounded-xl border border-sky-300 focus:ring-2 focus:ring-sky-400 text-gray-800 placeholder:text-gray-500"
                />
              )}
              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-4 w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl"
              >
                Suivant
              </button>
            </div>
          )}

          {/* STEP 2 - Localisation */}
          {step === 2 && (
            <div>
              <label className="block mb-2 font-medium text-sky-800">
                Localisation
              </label>
              <select
                value={localisation}
                onChange={(e) => setLocalisation(e.target.value)}
                className="w-full p-3 rounded-xl border border-sky-300 focus:ring-2 focus:ring-sky-400 text-gray-800"
                required
              >
                <option value="">-- Sélectionner --</option>
                {localisations.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>

              {(localisation === "Chambre" || localisation === "Salle de bain") && (
                <div className="mt-3">
                  <label className="block mb-2 font-medium text-sky-800">
                    Numéro de chambre
                  </label>
                  <select
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full p-3 rounded-xl border border-sky-300 focus:ring-2 focus:ring-sky-400 text-gray-800 placeholder:text-gray-500"
                    required
                  >
                    <option value="">-- Sélectionner un numéro --</option>
                    {/* Étages 1 à 4 */}
                    {[1, 2, 3, 4].map((floor) =>
                      Array.from({ length: 27 }, (_, i) => `${floor}${(i + 1).toString().padStart(2, "0")}`).map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))
                    )}
                    {/* Étape 5 (501–517) */}
                    {Array.from({ length: 17 }, (_, i) => `5${(i + 1).toString().padStart(2, "0")}`).map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-gray-300 py-2 px-4 rounded-xl"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded-xl"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 - Domaine */}
          {step === 3 && (
            <div>
              <label className="block mb-2 font-medium text-sky-800">
                Domaine technique
              </label>
              <select
                value={domaine}
                onChange={(e) => {
                  setDomaine(e.target.value)
                  setProbleme("")
                }}
                className="w-full p-3 rounded-xl border border-sky-300 focus:ring-2 focus:ring-sky-400 text-gray-800"
                required
              >
                <option value="">-- Sélectionner --</option>
                {Object.keys(domaines).map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>

              {domaine && (
                <div className="mt-4">
                  <label className="block mb-2 font-medium text-sky-800">
                    Problème
                  </label>
                  <select
                    value={probleme}
                    onChange={(e) => setProbleme(e.target.value)}
                    className="w-full p-3 rounded-xl border border-sky-300 focus:ring-2 focus:ring-sky-400 text-gray-800"
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    {domaines[domaine].map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                  {probleme === "Autre..." && (
                    <input
                      type="text"
                      placeholder="Décrire le problème"
                      value={customProblem}
                      onChange={(e) => setCustomProblem(e.target.value)}
                      className="mt-3 w-full p-3 rounded-xl border border-sky-300 focus:ring-2 focus:ring-sky-400 text-gray-800 placeholder:text-gray-500"
                    />
                  )}
                </div>
              )}

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-gray-300 py-2 px-4 rounded-xl"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded-xl"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 - Priorité & Photo */}
          {step === 4 && (
            <div>
              <label className="block mb-2 font-medium text-sky-800">
                Priorité
              </label>
              <select
                value={priorite}
                onChange={(e) => setPriorite(e.target.value)}
                className="w-full p-3 rounded-xl border border-sky-300 focus:ring-2 focus:ring-sky-400 text-gray-800"
                required
              >
                <option value="">-- Sélectionner --</option>
                {priorites.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>

              <div className="mt-4">
                <label className="block mb-2 font-medium text-sky-800">
                  Ajouter une photo (optionnel)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setPhoto(e.target.files ? e.target.files[0] : null)
                  }
                  className="w-full text-sky-700"
                />
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-gray-300 py-2 px-4 rounded-xl"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl"
                >
                  ✅ Envoyer
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
  )
}
