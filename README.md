# fhirpatch

## What's this?
This is a Javascript implementation of the FHIRPatch specification as 
described at https://www.hl7.org/fhir/fhirpatch.html.  For FHIR Path 
parsing, it uses the excellent fhirpath.js library.

## Usage

Please refer to `test/fhirpatch.test.js` for more examples.

```
const {FhirPatch} = require('fhirpatch');

# Create a new patch, to fix Feed Flintstone's birthdate from CE to BCE
const patch = {
  resourceType: 'Parameters',
  parameter: [{
    name: 'operation',
    parameter: [
      { name: 'path', valueString: 'Patient.birthDate' },
      { name: 'value', valueString: '-2020-01-01'},
      { name: 'type', valueString: 'replace' },
    ],
  }],       
};

const resource = {
  resourceType: 'Patient',
  name: [{
    given: ['Fred'],
    family: 'Flintstone'
  }],
  birthDate: '2020-01-01',
}

# Apply the patch in one step
let result = FhirPatch.apply(resource, patch); // returns a *copy* of resource with the patch applied.

# Prepare a patch which can be applied to many resources
let patcher = new FhirPatch(patch);
let result = patcher.apply(resource);
```

Note that the apply operations will always return the resource in the format in which they received it.

## Known Limitations

1. It could definitely be faster and probably more robust by doing our own 
   fhirpath implementation.
2. Two of HL7's test cases don't pass.  In one case (@apply.27) I'm pretty 
   sure the test case is at fault.  In the other, it's an issue of the 
   code that autogenerates the test case and it'ss just not worth the time to 
   fix right now.
3. This library has not been tested on a browser, since we need it for use in node.
4. There may be a limitation inherent to using an external FHIRPath implementation,
   but it's not covered by the test case.  See comment on Operation#tail for discussion.


