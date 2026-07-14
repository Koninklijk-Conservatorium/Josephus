type StringMEI = string & { lib?: 'MEI' }

type SelectionMEI = string & { lib?: "MusicNotationAdressabilityAPI" }


interface MEINoteElement extends Element {
  tagName: 'note';
}

// TO DO: port from MEI itself!
// TO DO: add more.
