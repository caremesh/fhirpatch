# FHIR R4 Compliance Tests

The files in this directory are used as functional tests to confirm
the compliance of the full package with the FHIR R4 compliance tests.  
You should place unit tests in `src/*.test.js`, not here.

The files are:

* fhirpatch.test.js - generated test file based on the XML & XSL.  
  Regenerate with `yarn regenerate-tests`.
* fhir-patch-tests.xml - the FhirPatch compliance tests in XML format
  downloaded from HL7.
* fhirpatch.test.xsl - an XSL stylesheet that transforms the XML into a 
  mocha + chai test file.

Unless you make modifications to the XSL, you probably won't need to change
these.
