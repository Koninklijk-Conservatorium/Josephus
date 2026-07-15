type MEI = { lib?: 'MEI' }
type AdressabilityAPI = { lib?: "MusicNotationAdressabilityAPI" }


type StringMEI = string & MEI
type MEIDocument = XMLDocument & MEI

type SelectionMEI = string & AdressabilityAPI



interface MEINoteElement extends Element {
  tagName: 'note';
}

// TO DO: port from MEI itself!
// TO DO: add more.
