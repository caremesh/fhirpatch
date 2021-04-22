# fhirpatch

## What's this?
This is a Javascript implementation of the FHIRPatch specification as 
described at https://www.hl7.org/fhir/fhirpatch.html.  For FHIR Path 
parsing, it uses the excellent fhirpath.js library.

## Usage

Please refer to `test/fhirpatch.test.js` for more examples.

```
const {FhirPatch} = require('fhirpatch');

# Create a new patch, to fix Fred Flintstone's birthdate from CE to BCE
const patch = {
  resourceType: 'Parameters',
  parameter: [{
    name: 'operation',
    part: [
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

Apply operations will always return the resource in the format in which they received it.  The following
formats are supported:

* Javascript objects
* JSON
* XML

The patcher will throw an exception whenever any of the following conditions obtains:

1. The provided patch is not a valid FHIR parameters object.
2. The provided patch isn't a valid FHIR patch.
3. The path to be patched doesn't exist (except for delete operations).
4. The required arguments for a given operation type are not present.
5. The resource is invalid **before** patching.
6. The resource is invalid **after** patching.

## Known Limitations

1. It could definitely be faster and probably more robust by doing our own 
   fhirpath implementation.
2. Two of HL7's test cases don't pass.  In one case (@apply.27) I'm pretty 
   sure the test case is at fault.  In the other, it's an issue of the 
   code that autogenerates the test case and it'ss just not worth the time to 
   fix right now.
3. This library has not been tested on a browser, since we need it for use in node.
4. There may be a limitation inherent to using an external FHIRPath implementation,
   but it's not covered by the test cases and is not worth the time right now.  See 
   comment on Operation#tail for discussion.
5. FHIR object validation is not what it should be, and may well miss some cases
   that the official FHIR validator would catch.

## Examples

### Patch with a complex value

```json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "operation",
      "parameter": [
        {
          "name": "type",
          "valueCode": "add"
        },
        {
          "name": "path",
          "valueString": "Patient"
        },
        {
          "name": "name",
          "valueString": "contact"
        },
        {
          "name": "value",
          "parameter": [
            {
              "name": "name",
              "valueHumanName": {
                "text": "a name"
              }
            }
          ]
        }
      ]
    }
  ]
}
```
