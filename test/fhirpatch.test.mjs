import FhirPatch from '../src/fhirpatch.mjs';
import {Fhir} from 'fhir';

describe('apply', function() {
  let fhir;
  before(function() {
    fhir = new Fhir();
  });

  it(
      'should handle "No Difference" @apply.1',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><birthDate value="1920-01-01"/></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><birthDate value="1920-01-01"/></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"/>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Replace Primitive" @apply.2',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><birthDate value="1920-01-01"/></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><birthDate value="1930-01-01"/></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="replace"/></part><part><name value="path"/><valueString value="Patient.birthDate"/></part><part><name value="value"/><valueDate value="1930-01-01"/></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Delete Primitive" @apply.3',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><birthDate value="1920-01-01"/></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"/>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="delete"/></part><part><name value="path"/><valueString value="Patient.birthDate"/></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Add Primitive" @apply.4',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"/>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><birthDate value="1930-01-01"/></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="add"/></part><part><name value="path"/><valueString value="Patient"/></part><part><name value="name"/><valueString value="birthDate"/></part><part><name value="value"/><valueDate value="1930-01-01"/></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Delete Primitive #2" @apply.5',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><birthDate value="1920-01-01"/></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"/>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="delete"/></part><part><name value="path"/><valueString value="Patient.birthDate"/></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Replace Nested Primitive #1" @apply.6',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><contact><name><text value="a name"/></name><gender value="male"/></contact></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><contact><name><text value="a name"/></name><gender value="female"/></contact></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="replace"/></part><part><name value="path"/><valueString value="Patient.contact[0].gender"/></part><part><name value="value"/><valueCode value="female"/></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Replace Nested Primitive #2" @apply.7',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><contact><name><text value="a name"/></name><gender value="male"/></contact></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><contact><name><text value="the name"/></name><gender value="male"/></contact></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="replace"/></part><part><name value="path"/><valueString value="Patient.contact[0].name.text"/></part><part><name value="value"/><valueString value="the name"/></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Delete Nested Primitive #1" @apply.8',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><contact><name><text value="a name"/></name><gender value="male"/></contact></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><contact><name><text value="a name"/></name></contact></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="delete"/></part><part><name value="path"/><valueString value="Patient.contact[0].gender"/></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Delete Nested Primitive #2" @apply.9',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><contact><name><text value="a name"/></name><gender value="male"/></contact></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><contact><gender value="male"/></contact></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="delete"/></part><part><name value="path"/><valueString value="Patient.contact[0].name.text"/></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Add Nested Primitive" @apply.10',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><contact><name><text value="a name"/></name></contact></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><contact><name><text value="a name"/></name><gender value="male"/></contact></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="add"/></part><part><name value="path"/><valueString value="Patient.contact[0]"/></part><part><name value="name"/><valueString value="gender"/></part><part><name value="value"/><valueCode value="male"/></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Add Complex" @apply.11',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"/>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><maritalStatus><text value="married"/></maritalStatus></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="add"/></part><part><name value="path"/><valueString value="Patient"/></part><part><name value="name"/><valueString value="maritalStatus"/></part><part><name value="value"/><valueCodeableConcept><text value="married"/></valueCodeableConcept></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Replace Complex" @apply.12',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><maritalStatus id="1"><text value="married"/></maritalStatus></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><maritalStatus id="2"><text value="not married"/></maritalStatus></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="replace"/></part><part><name value="path"/><valueString value="Patient.maritalStatus"/></part><part><name value="value"/><valueCodeableConcept id="2"><text value="not married"/></valueCodeableConcept></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Delete Complex" @apply.13',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><maritalStatus><text value="married"/></maritalStatus></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"/>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="delete"/></part><part><name value="path"/><valueString value="Patient.maritalStatus"/></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Add Anonymous Type" @apply.14',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"/>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><contact><name><text value="a name"/></name></contact></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="add"/></part><part><name value="path"/><valueString value="Patient"/></part><part><name value="name"/><valueString value="contact"/></part><part><name value="value"/><part><name value="name"/><valueHumanName><text value="a name"/></valueHumanName></part></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Delete Anonymous Type" @apply.15',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><contact><name><text value="a name"/></name></contact></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"/>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="delete"/></part><part><name value="path"/><valueString value="Patient.contact[0]"/></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "List unchanged" @apply.16',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 2"/></identifier></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 2"/></identifier></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"/>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "List unchanged, contents changed" @apply.17',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier id="a"><system value="http://example.org"/><value value="value 1"/></identifier><identifier id="b"><system value="http://example.org"/><value value="value 2"/></identifier></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier id="a"><system value="http://example.org"/><value value="value 2"/></identifier><identifier id="b"><system value="http://example.org"/><value value="value 1"/></identifier></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="replace"/></part><part><name value="path"/><valueString value="Patient.identifier[0].value"/></part><part><name value="value"/><valueString value="value 2"/></part></parameter><parameter><name value="operation"/><part><name value="type"/><valueCode value="replace"/></part><part><name value="path"/><valueString value="Patient.identifier[1].value"/></part><part><name value="value"/><valueString value="value 1"/></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Add to list" @apply.18',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 2"/></identifier></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 2"/></identifier><identifier><system value="http://example.org"/><value value="value 3"/></identifier></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="insert"/></part><part><name value="path"/><valueString value="Patient.identifier"/></part><part><name value="index"/><valueInteger value="2"/></part><part><name value="value"/><valueIdentifier><system value="http://example.org"/><value value="value 3"/></valueIdentifier></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Insert in list #1" @apply.19',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 2"/></identifier></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 3"/></identifier><identifier><system value="http://example.org"/><value value="value 2"/></identifier></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="insert"/></part><part><name value="path"/><valueString value="Patient.identifier"/></part><part><name value="index"/><valueInteger value="1"/></part><part><name value="value"/><valueIdentifier><system value="http://example.org"/><value value="value 3"/></valueIdentifier></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Insert in list #2" @apply.20',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 2"/></identifier></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 3"/></identifier><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 2"/></identifier></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="insert"/></part><part><name value="path"/><valueString value="Patient.identifier"/></part><part><name value="index"/><valueInteger value="0"/></part><part><name value="value"/><valueIdentifier><system value="http://example.org"/><value value="value 3"/></valueIdentifier></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Delete from List #1" @apply.21',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 2"/></identifier><identifier><system value="http://example.org"/><value value="value 3"/></identifier></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 2"/></identifier><identifier><system value="http://example.org"/><value value="value 3"/></identifier></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="delete"/></part><part><name value="path"/><valueString value="Patient.identifier[0]"/></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Delete from List #2" @apply.22',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 2"/></identifier><identifier><system value="http://example.org"/><value value="value 3"/></identifier></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 3"/></identifier></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="delete"/></part><part><name value="path"/><valueString value="Patient.identifier[1]"/></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Delete from List #3" @apply.23',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 2"/></identifier><identifier><system value="http://example.org"/><value value="value 3"/></identifier></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 2"/></identifier></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="delete"/></part><part><name value="path"/><valueString value="Patient.identifier[2]"/></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Reorder List #1" @apply.24',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 2"/></identifier><identifier><system value="http://example.org"/><value value="value 3"/></identifier><identifier><system value="http://example.org"/><value value="value 4"/></identifier></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 4"/></identifier><identifier><system value="http://example.org"/><value value="value 2"/></identifier><identifier><system value="http://example.org"/><value value="value 3"/></identifier></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="move"/></part><part><name value="path"/><valueString value="Patient.identifier"/></part><part><name value="source"/><valueInteger value="3"/></part><part><name value="destination"/><valueInteger value="1"/></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Reorder List #2" @apply.25',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 2"/></identifier><identifier><system value="http://example.org"/><value value="value 3"/></identifier><identifier><system value="http://example.org"/><value value="value 4"/></identifier></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 4"/></identifier><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 2"/></identifier><identifier><system value="http://example.org"/><value value="value 3"/></identifier></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="move"/></part><part><name value="path"/><valueString value="Patient.identifier"/></part><part><name value="source"/><valueInteger value="3"/></part><part><name value="destination"/><valueInteger value="0"/></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Reorder List #3" @apply.26',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 2"/></identifier><identifier><system value="http://example.org"/><value value="value 3"/></identifier><identifier><system value="http://example.org"/><value value="value 4"/></identifier></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 2"/></identifier><identifier><system value="http://example.org"/><value value="value 4"/></identifier><identifier><system value="http://example.org"/><value value="value 3"/></identifier></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="move"/></part><part><name value="path"/><valueString value="Patient.identifier"/></part><part><name value="source"/><valueInteger value="3"/></part><part><name value="destination"/><valueInteger value="2"/></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it.skip(
      'should handle "Reorder List #4" @apply.27',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 2"/></identifier><identifier><system value="http://example.org"/><value value="value 3"/></identifier><identifier><system value="http://example.org"/><value value="value 4"/></identifier></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 2"/></identifier><identifier><system value="http://example.org"/><value value="value 3"/></identifier><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 4"/></identifier></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="move"/></part><part><name value="path"/><valueString value="Patient.identifier"/></part><part><name value="source"/><valueInteger value="0"/></part><part><name value="destination"/><valueInteger value="3"/></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Reorder List #5" @apply.28',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 2"/></identifier><identifier><system value="http://example.org"/><value value="value 3"/></identifier><identifier><system value="http://example.org"/><value value="value 4"/></identifier></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 2"/></identifier><identifier><system value="http://example.org"/><value value="value 3"/></identifier><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 4"/></identifier></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="move"/></part><part><name value="path"/><valueString value="Patient.identifier"/></part><part><name value="source"/><valueInteger value="1"/></part><part><name value="destination"/><valueInteger value="0"/></part></parameter><parameter><name value="operation"/><part><name value="type"/><valueCode value="move"/></part><part><name value="path"/><valueString value="Patient.identifier"/></part><part><name value="source"/><valueInteger value="2"/></part><part><name value="destination"/><valueInteger value="1"/></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it(
      'should handle "Reorder List #6" @apply.29',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 1"/></identifier><identifier><system value="http://example.org"/><value value="value 2"/></identifier><identifier><system value="http://example.org"/><value value="value 3"/></identifier><identifier><system value="http://example.org"/><value value="value 4"/></identifier></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><identifier><system value="http://example.org"/><value value="value 4"/></identifier><identifier><system value="http://example.org"/><value value="value 3"/></identifier><identifier><system value="http://example.org"/><value value="value 2"/></identifier><identifier><system value="http://example.org"/><value value="value 1"/></identifier></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="move"/></part><part><name value="path"/><valueString value="Patient.identifier"/></part><part><name value="source"/><valueInteger value="3"/></part><part><name value="destination"/><valueInteger value="0"/></part></parameter><parameter><name value="operation"/><part><name value="type"/><valueCode value="move"/></part><part><name value="path"/><valueString value="Patient.identifier"/></part><part><name value="source"/><valueInteger value="3"/></part><part><name value="destination"/><valueInteger value="1"/></part></parameter><parameter><name value="operation"/><part><name value="type"/><valueCode value="move"/></part><part><name value="path"/><valueString value="Patient.identifier"/></part><part><name value="source"/><valueInteger value="3"/></part><part><name value="destination"/><valueInteger value="2"/></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );

  it.skip(
      'should handle "Full Resource" @apply.30',
      async function() {
        const input=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><id value="example"/><text><status value="generated"/><div xmlns="http://www.w3.org/1999/xhtml"><table><tbody><tr><td>Name</td><td>Peter James 
                    <b>Chalmers</b> ("Jim")
                  </td></tr><tr><td>Address</td><td>534 Erewhon, Pleasantville, Vic, 3999</td></tr><tr><td>Contacts</td><td>Home: unknown. Work: (03) 5555 6473</td></tr><tr><td>Id</td><td>MRN: 12345 (Acme Healthcare)</td></tr></tbody></table></div></text><!--   MRN assigned by ACME healthcare on 6-May 2001   --><identifier><use value="usual"/><type><coding><system value="http://hl7.org/fhir/v2/0203"/><code value="MR"/></coding></type><system value="urn:oid:1.2.36.146.595.217.0.1"/><value value="12345"/><period><start value="2001-05-06"/></period><assigner><display value="Acme Healthcare"/></assigner></identifier><active value="true"/><!--   Peter James Chalmers, but called "Jim"   --><name><use value="official"/><family value="Chalmers"/><given value="Peter"/><given value="James"/></name><name><use value="usual"/><given value="Jim"/></name><telecom><use value="home"/><!--   home communication details aren't known   --></telecom><telecom><system value="phone"/><value value="(03) 5555 6473"/><use value="work"/></telecom><!--   use FHIR code system for male / female   --><gender value="male"/><birthDate value="1974-12-25"><extension url="http://hl7.org/fhir/StructureDefinition/patient-birthTime"><valueDateTime value="1974-12-25T14:35:45-05:00"/></extension></birthDate><deceasedBoolean value="false"/><address><use value="home"/><type value="both"/><line value="534 Erewhon St"/><city value="PleasantVille"/><district value="Rainbow"/><state value="Vic"/><postalCode value="3999"/><period><start value="1974-12-25"/></period></address><contact><relationship><coding><system value="http://hl7.org/fhir/patient-contact-relationship"/><code value="partner"/></coding></relationship><name><family value="du Marché"><!--   the "du" part is a family name prefix (VV in iso 21090)   --><extension url="http://hl7.org/fhir/StructureDefinition/humanname-own-prefix"><valueString value="VV"/></extension></family><given value="Bénédicte"/></name><telecom><system value="phone"/><value value="+33 (237) 998327"/></telecom><address><use value="home"/><type value="both"/><line value="534 Erewhon St"/><city value="PleasantVille"/><district value="Rainbow"/><state value="Vic"/><postalCode value="3999"/><period><start value="1974-12-25"/></period></address><gender value="female"/><period><!--   The contact relationship started in 2012   --><start value="2012"/></period></contact><managingOrganization><reference value="Organization/1"/></managingOrganization></Patient>`);
        const output=fhir.xmlToObj(`<Patient xmlns="http://hl7.org/fhir"><id value="example"/><text><status value="generated"/><div xmlns="http://www.w3.org/1999/xhtml"><table><tbody><tr><td>Name</td><td>Peter James <b>Chalmers1</b> ("Jim")</td></tr><tr><td>Address</td><td>534 Erewhon, Pleasantville, Vic, 3999</td></tr><tr><td>Contacts</td><td>Home: unknown. Work: (03) 5555 6473</td></tr><tr><td>Id</td><td>MRN: 12345 (Acme Healthcare)</td></tr></tbody></table></div></text><!--   MRN assigned by ACME healthcare on 6-May 2001   --><identifier><use value="usual"/><type><coding><system value="http://hl7.org/fhir/v2/0203"/><code value="MR"/></coding></type><system value="urn:oid:1.2.36.146.595.217.0.1"/><value value="12345"/><period><start value="2001-05-06"/></period><assigner><display value="Acme Healthcare"/></assigner></identifier><active value="true"/><!--   Peter James Chalmers, but called "Jim"   --><name><use value="official"/><family value="Chalmers1"/><given value="Peter"/><given value="James"/></name><name><use value="usual"/><given value="Jim"/></name><telecom><use value="home"/><!--   home communication details aren't known   --></telecom><telecom><system value="phone"/><value value="(03) 5555 6473"/><use value="work"/></telecom><!--   use FHIR code system for male / female   --><gender value="male"/><birthDate value="1974-12-25"><extension url="http://hl7.org/fhir/StructureDefinition/patient-birthTime"><valueDateTime value="1974-12-25T14:35:45-05:00"/></extension></birthDate><deceasedBoolean value="false"/><address><use value="home"/><type value="both"/><line value="534 Erewhon St"/><city value="PleasantVille"/><district value="Rainbow"/><state value="Vic"/><postalCode value="3999"/><period><start value="1974-12-25"/></period></address><contact><relationship><coding><system value="http://hl7.org/fhir/patient-contact-relationship"/><code value="partner"/></coding></relationship><name><family value="du Marché"><!--   the "du" part is a family name prefix (VV in iso 21090)   --><extension url="http://hl7.org/fhir/StructureDefinition/humanname-own-prefix"><valueString value="VV"/></extension></family><given value="Bénédicte"/></name><telecom><system value="phone"/><value value="+33 (237) 998327"/></telecom><address><use value="home"/><type value="both"/><line value="534 Erewhon St"/><city value="PleasantVille"/><district value="Rainbow"/><state value="Vic"/><postalCode value="3999"/><period><start value="1974-12-25"/></period></address><gender value="female"/><period><!--   The contact relationship started in 2012   --><start value="2012"/></period></contact><managingOrganization><reference value="Organization/1"/></managingOrganization></Patient>`);
        const diff=fhir.xmlToObj(`<Parameters xmlns="http://hl7.org/fhir"><parameter><name value="operation"/><part><name value="type"/><valueCode value="replace"/></part><part><name value="path"/><valueString value="Patient.text.div"/></part><part><name value="value"/><valueString value="&lt;div xmlns=&#34;http://www.w3.org/1999/xhtml&#34;&gt;                          &lt;table&gt;                              &lt;tbody&gt;                                  &lt;tr&gt;                                      &lt;td&gt;Name&lt;/td&gt;                                      &lt;td&gt;Peter James                      &lt;b&gt;Chalmers1&lt;/b&gt; (&#34;Jim&#34;)                   &lt;/td&gt;                                  &lt;/tr&gt;                                  &lt;tr&gt;                                      &lt;td&gt;Address&lt;/td&gt;                                      &lt;td&gt;534 Erewhon, Pleasantville, Vic, 3999&lt;/td&gt;                                  &lt;/tr&gt;                                  &lt;tr&gt;                                      &lt;td&gt;Contacts&lt;/td&gt;                                      &lt;td&gt;Home: unknown. Work: (03) 5555 6473&lt;/td&gt;                                  &lt;/tr&gt;                                  &lt;tr&gt;                                      &lt;td&gt;Id&lt;/td&gt;                                      &lt;td&gt;MRN: 12345 (Acme Healthcare)&lt;/td&gt;                                  &lt;/tr&gt;                              &lt;/tbody&gt;                          &lt;/table&gt;                          &lt;/div&gt;"/></part></parameter><parameter><name value="operation"/><part><name value="type"/><valueCode value="replace"/></part><part><name value="path"/><valueString value="Patient.name[0].family"/></part><part><name value="value"/><valueString value="Chalmers1"/></part></parameter></Parameters>`);

        const result = new FhirPatch(diff).apply(input);
        expect(result).to.eql(output);
      },
  );
});
