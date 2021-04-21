const FhirPatch = require('./fhirpatch');


describe('fhirpatch @fhirpatch', function() {
  const patch = {
    'resourceType': 'Parameters',
    'parameter': [
      {
        'name': 'operation',
        'parameter': [
          {
            'name': 'type',
            'valueCode': 'replace',
          },
          {
            'name': 'path',
            'valueString': 'Patient.birthDate',
          },
          {
            'name': 'value',
            'valueDate': '-2020-01-01',
          },
        ],
      },
    ],
  };

  it('Should reject invalid patches @fhirpatch.01', function() {
    expect(() => FhirPatch.apply({}, {
      resourceType: 'Parameters',
      parameter: 'bar',
    })).to.throw();
  });

  it('Should reject non-patches @fhirpatch.02', function() {
    expect(() => FhirPatch.apply({}, {
      resourceType: 'Patient',
    })).to.throw();
  });

  it('Should reject invalid resources @fhirpatch.03', function() {
    const rsc = {
      resourceType: 'MadeUp',
    };

    expect(() => FhirPatch.apply(rsc, patch)).to.throw();
  });

  it('should be able to apply a patch @fhirpatch.04', function() {
    try {
      const rsc = FhirPatch.apply({resourceType: 'Patient'}, patch);
      expect(rsc).to.include(
          {resourceType: 'Patient', birthDate: '-2020-01-01'});
    } catch (error) {
      console.error(error);
    }
  });

  it('Should reject when the patch has an invalid value @fhirpatch.05',
      function() {
        const rsc = {
          resourceType: 'Patient',
        };

        // This should fail since a Patient's birthDate is not a list
        const patch = {
          'resourceType': 'Parameters',
          'parameter': [
            {
              'name': 'operation',
              'parameter': [
                {
                  'name': 'type',
                  'valueCode': 'replace',
                },
                {
                  'name': 'path',
                  'valueString': 'Patient.birthDate',
                },
                {
                  'name': 'value',
                  'valueString': [],
                },
              ],
            },
          ],
        };

        expect(() => FhirPatch.apply(rsc, patch)).to.throw();
      });

  it('should reject when the resulting path is empty', function() {
    const rsc = {
      resourceType: 'Patient',
    };

    // This should fail since a Patient's birthDate is not a list
    const patch = {
      'resourceType': 'Parameters',
      'parameter': [
        {
          'name': 'operation',
          'parameter': [
            {
              'name': 'type',
              'valueCode': 'replace',
            },
            {
              'name': 'path',
              'valueString': 'Patient.birthDate',
            },
            {
              'name': 'value',
              'valueString': 12345,
            },
          ],
        },
      ],
    };

    expect(() => FhirPatch.apply(rsc, patch)).to.throw();
  });
});
