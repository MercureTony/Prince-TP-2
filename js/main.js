/**
 * une fonction qui va supprimer touts les fils
 * des <div> utilisés par l'application
 */
const viderElements = () => {
  tableContainer.innerHTML = ''
  patientSelector.innerHTML = ''
  etablissementSelector.innerHTML = ''
  specialiteSelector.innerHTML = ''
}

/**
 * Création d'une table pour un tableau donné "elements"
 *
 * @param {Object[]} elements
 * @returns {HTMLTableElement}
 */
const creerElementTable = (elements) => {
  let table = document.createElement('table'),
    tr = document.createElement('tr'),
    th,
    td

  Object.keys(elements[0]).map((key) => {
    th = document.createElement('th')
    th.innerHTML = key
    tr.appendChild(th)
  })
  table.appendChild(tr)

  elements.map((element) => {
    tr = document.createElement('tr')

    Object.keys(element).map((key) => {
      td = document.createElement('td')
      td.innerHTML = element[key]
      tr.appendChild(td)
    })
    table.appendChild(tr)
  })

  statusMessage.innerHTML = 'On a trouvé ' + elements.length + ' record(s)'

  return table
}

/**
 * Creation d'une table de patients
 */

const recupererPatients = () => {
  viderElements()
  tableContainer.appendChild(creerElementTable(patients))
}

/**
 * Création d'une table d'établissements
 */
const recupererEtablissements = () => {
  viderElements()
  tableContainer.appendChild(creerElementTable(etablissements))
}

/**
 * Création d'une table d'hospitalisations
 */
const recupererHospitalisations = () => {
  viderElements()
  tableContainer.appendChild(creerElementTable(hospitalisations))
}

/**
 * Création d'une table pour les hospitalions pour
 * un patient spécific
 *
 * @param {number} patient
 */
const recupererPatientHospitalisations = (numero) => {
  const resultat = hospitalisations.filter(
    (hospitalisation) => hospitalisation.patient == numero
  )

  tableContainer.innerHTML = ''
  if (resultat.length !== 0) {
    tableContainer.appendChild(creerElementTable(resultat))
  }
}

/**
 * Création d'un select de patients
 */
const creerSelectPatient = () => {
  viderElements()
  let select = document.createElement('select'),
    option

  select.addEventListener('change', (event) => {
    const dossier = +event.currentTarget.value

    dossier
      ? recupererPatientHospitalisations(dossier)
      : (tableContainer.innerHTML = '')
  })

  option = document.createElement('option')
  option.value = null
  option.innerHTML = 'Choisir...'
  select.appendChild(option)

  patients.map((patient) => {
    option = document.createElement('option')
    option.value = patient.dossier
    option.innerHTML = patient.prenom + ' ' + patient.nom
    select.appendChild(option)
  })

  patientSelector.appendChild(select)
}

/**
 * Création d'une table d'hospitalisation avec deux filtres
 *
 * @param {number} etablissement
 * @param {string} specialite
 */
const recupererHospitalisation = (etablissement, specialite) => {
  const resultat = hospitalisations.filter(
    (hospitalisation) =>
      hospitalisation.etablissement == etablissement &&
      hospitalisation.specialite == specialite
  )

  tableContainer.innerHTML = ''
  if (resultat.length !== 0) {
    tableContainer.appendChild(creerElementTable(resultat))
  }
}

/**
 * Création d'un tableau de spécialité basé sur
 * le numero de l'établissement selectionné,
 * on cherche dans la table hospitalisations pour trouvé
 * tous les spécialités offertes et puis on utilise un Set
 * Pour avoir des spécialités uniques pour les afficher dans
 * le select
 *
 * @param {number} etablissement
 */
const creerSelectSpecialite = (etablissement) => {
  let select = document.createElement('select'),
    option

  option = document.createElement('option')
  option.value = null
  option.innerHTML = 'Choisir specialite'

  select.appendChild(option)

  select.addEventListener('change', (event) => {
    const specialite = event.target.value,
      etablissement = +document.querySelector('#select--etablissement')
        .firstChild.value

    recupererHospitalisation(etablissement, specialite)
  })

  const resultat = new Set(
    hospitalisations
      .filter(
        (hospitalisation) => hospitalisation.etablissement === etablissement
      )
      .map((hospitalisation) => hospitalisation.specialite)
  )

  specialiteSelector.innerHTML = ''

  Array.from(resultat).map((donne) => {
    option = document.createElement('option')
    option.value = donne
    option.innerHTML = donne

    select.appendChild(option)
  })

  specialiteSelector.appendChild(select)
}

/**
 * Creation d'un élement select avec tous les établissements
 * disponibles
 */
const creerSelectHospitalisation = () => {
  viderElements()
  let select = document.createElement('select'),
    option

  select.addEventListener('change', (event) => {
    tableContainer.innerHTML = ''
    const etablissement = +event.currentTarget.value

    etablissement
      ? creerSelectSpecialite(etablissement)
      : (tableContainer.innerHTML = '')
  })

  option = document.createElement('option')
  option.value = null
  option.innerHTML = 'Choisir...'
  select.appendChild(option)

  etablissements.map((etablissement) => {
    option = document.createElement('option')
    option.value = etablissement.numero
    option.innerHTML = etablissement.nom
    select.appendChild(option)
  })

  etablissementSelector.appendChild(select)
}

/**
 * Pour affiche le message status
 */
const toggleStatus = () => {
  if (statusMessage.style.display === 'none')
    statusMessage.style.display = 'block'
  else statusMessage.style.display = 'none'
}
