type StringMEI = string & { lib?: 'MEI' }

type SelectionMEI = string & { lib?: "MusicNotationAdressabilityAPI" }

type MEIDocument = XMLDocument


interface MEINoteElement extends Element {
  tagName: 'note';
}

// TO DO: port from MEI itself!
// TO DO: add more.
