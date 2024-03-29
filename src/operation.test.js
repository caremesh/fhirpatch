const Operation = require('./operation');
const fhirpath = require('fhirpath');

describe('Operation', function() {
  it('should be possible to apply a boolean replace', function() {
    const op = new Operation({
      type: 'replace',
      path: `Organization.active`,
      value: true,
      valueType: 'valueBoolean',
    });

    result = op.apply({
      active: false,
      resourceType: 'Organization',
      name: 'Test',
    });

    expect(result).to.eql({
      active: true,
      resourceType: 'Organization',
      name: 'Test',
    });
  });

  it('Should be possible to create a delete operation with the API and render it to JSON', function() {
    operation = new Operation({
      type: 'delete',
      path: 'Practitioner.telecom.where(value="6564664444")',
    });

    expect(operation.toJSON()).to.eql({
      name: 'operation',
      parameter: [
        {name: 'type', valueCode: 'delete'},
        {
          name: 'path',
          valueString: 'Practitioner.telecom.where(value="6564664444")',
        },
      ],
    });
  });

  it('Should be possible to create an insert operation with the API and render it to JSON', function() {
    operation = new Operation({
      type: 'insert',
      value: {
        system: 'phone',
        value: '7577467896',
      },
      valueType: 'valueContactPoint',
      path: 'Practitioner.telecom',
      index: 0,
    });

    expect(operation.toJSON()).to.eql({
      name: 'operation',
      parameter: [
        {name: 'type', valueCode: 'insert'},
        {name: 'path', valueString: 'Practitioner.telecom'},
        {
          name: 'value',
          valueContactPoint: {
            system: 'phone',
            value: '7577467896',

          },
        },
        {name: 'index', valueInteger: 0},
      ],
    });
  });

  it('should be possible to delete using a where clause @operation.04', async function() {
    const op = new Operation({
      path: `Organization.alias.where($this = 'foo')`,
      type: 'delete',
    });

    result = op.apply({
      resourceType: 'Organization',
      alias: ['bar', 'foo'],
      name: 'bar',
    });

    expect(result).to.eql({
      resourceType: 'Organization',
      name: 'bar',
      alias: ['bar'],
    });
  });

  it('should correctly parse the tail on a path with a where clause @operation.05', async function() {
    const op = new Operation({
      path: `Organization.alias.where($this = 'foo')`,
      type: 'delete',
    });
    expect(op.tail.path).not.to.be.undefined;
  });

  it('should be able to add a prefix @operation.06', async function() {
    const op = new Operation({
      type: 'insert',
      index: 0,
      path: 'Practitioner.name[0].prefix',
      value: 'DR',
      valueType: 'valueString',
    });

    expect(op.apply({
      resourceType: 'Practitioner',
      name: [
        {
          family: 'smith',
          given: [
            'John',
          ],
        },
      ],
    })).to.eql({
      resourceType: 'Practitioner',
      name: [
        {
          family: 'smith',
          given: [
            'John',
          ],
          prefix: ['DR'],
        },
      ],
    });
  });

  it('should be able to delete a path that doesn\'t exist @operation.07', async function() {
    const op = new Operation({
      type: 'delete',
      path: 'Practitioner.telecom.where(value=\'directto:kristen.radcliff@rot.eclinicaldirectplus.com\')',
    });

    const resource = {
      resourceType: 'Practitioner',
    };
    const result = op.apply(resource);
    expect(result).to.eql(resource);
  });

  describe('containingPath', function() {
    it('should properly parse paths of form "Organization.alias" @containingPath.1', async function() {
      const op = new Operation({
        type: 'delete',
        path: 'Organization.0alias',
      });
      expect(op.containingPath).to.eql('Organization');
    });

    it('should properly parse paths with operations @containingPath.2', async function() {
      const op = new Operation({
        type: 'delete',
        path: 'Practitioner.telecom.where(value=\'directto:kristen.radcliff@rot.eclinicaldirectplus.com\')',
      });

      expect(op.containingPath).to.eql('Practitioner.telecom');
    });
  });

  it('should be able to delete a path that does exist @operation.08', async function() {
    const op = new Operation({
      type: 'delete',
      path: 'Practitioner.telecom.where(value=\'foo.bar.com\')',
    });

    const resource = {
      resourceType: 'Practitioner',
      telecom: [{
        'use': 'work',
        'rank': 1,
        'value': 'foo.bar.com',
        'system': 'url',
      }],
    };
    const result = op.apply(resource);
    expect(result).to.eql({resourceType: 'Practitioner', telecom: []});
  });

  it('should be able to delete a deeply nested value @operation.09', async function() {
    const resource = {
      id: '5507d2e7-0236-58bc-a283-271ee390d23d',
      resourceType: 'Practitioner',
      qualification: [
        {
          id: 'family',
          code: {
            id: 'family',
            text: 'Family Medicine Physician',
            coding: [
              {
                code: 'family',
                system: 'http://fhir.caremesh.app/CodeSystem/CaremeshSpecialtyCode',
                display: 'Family Medicine Physician',
              },
              {
                code: '207Q00000X',
                system: 'http://fhir.caremesh.app/r4/valueset-provider-taxonomy',
                display: 'Family Medicine Physician',
              },
              {
                code: '207Q00000X',
                system: 'http://nucc.org/provider-taxonomy',
                display: 'Family Medicine Physician',
              },
            ],
          },
        },
        {
          code: {
            coding: [
              {
                code: 'MD',
                system: 'http://fhir.caremesh.app/r4/caremesh-practitioner-credential',
                display: 'Doctor of Medicine',
              },
            ],
          },
        },
        {
          code: {
            text: 'HOWARD UNIVERSITY COLLEGE OF MEDICINE - 1991',
            coding: [
              {
                code: 'M',
                system: 'http://terminology.hl7.org/CodeSystem/v2-0402',
              },
            ],
          },
          period: {
            start: '1991',
          },
          identifier: [
            {
              use: 'official',
              value: 'medSchool',
            },
          ],
        },
      ],
    };

    expect(fhirpath.evaluate(resource, `Practitioner.qualification.code.coding.where(code='family')`).length).to.equal(1);

    const result = new Operation({
      type: 'delete', path: 'Practitioner.qualification.code.coding.where(code = \'family\')',
    }).apply(resource);

    expect(result.qualification[0].code.coding.length).to.eql(resource.qualification[0].code.coding.length - 1);
    expect(fhirpath.evaluate(result, `Practitioner.qualification.code.coding.where(code='family')`).length).to.equal(0);
  });


  it('should be able to delete a deeply nested value @operation.10', async function() {
    const resource = {
      id: '5507d2e7-0236-58bc-a283-271ee390d23d',
      resourceType: 'Practitioner',
      qualification: [
        {
          id: 'family',
          code: {
            id: 'family',
            text: 'Family Medicine Physician',
            coding: [
              {
                code: 'family',
                system: 'http://fhir.caremesh.app/CodeSystem/CaremeshSpecialtyCode',
                display: 'Family Medicine Physician',
              },
              {
                code: '207Q00000X',
                system: 'http://fhir.caremesh.app/r4/valueset-provider-taxonomy',
                display: 'Family Medicine Physician',
              },
              {
                code: '207Q00000X',
                system: 'http://nucc.org/provider-taxonomy',
                display: 'Family Medicine Physician',
              },
            ],
          },
        },
        {
          code: {
            coding: [
              {
                code: 'MD',
                system: 'http://fhir.caremesh.app/r4/caremesh-practitioner-credential',
                display: 'Doctor of Medicine',
              },
            ],
          },
        },
        {
          code: {
            text: 'HOWARD UNIVERSITY COLLEGE OF MEDICINE - 1991',
            coding: [
              {
                code: 'M',
                system: 'http://terminology.hl7.org/CodeSystem/v2-0402',
              },
            ],
          },
          period: {
            start: '1991',
          },
          identifier: [
            {
              use: 'official',
              value: 'medSchool',
            },
          ],
        },
      ],
    };

    const result = new Operation({
      type: 'delete', path: 'Practitioner.qualification.code.where(id = \'family\')',
    }).apply(resource);

    expect(fhirpath.evaluate(result, `Practitioner.code.id.where($this='family')`).length).to.equal(0);
  });

  it('should properly handle delete operations when there\'s more than one match @operation.11', async function() {
    const op=new Operation({
      type: 'delete',
      path: 'Practitioner.qualification.code.coding.where(code = \'207P00000X\')',
    });

    const rsc={
      'id': '53e1e39e-09f2-517f-b7c1-ec22f741c2f7',
      'resourceType': 'Practitioner',
      'qualification': [
        {
          'id': 'emergency',
          'code': {
            'id': 'emergency',
            'text': 'Allopathic & Osteopathic Physicians - Emergency Medicine',
            'coding': [
              {
                'code': 'emergency',
                'system': 'http://fhir.caremesh.app/CodeSystem/CaremeshSpecialtyCode',
                'display': 'Emergency Medicine',
              },
              {
                'code': '207P00000X',
                'system': 'http://fhir.caremesh.app/r4/valueset-provider-taxonomy',
                'display': 'Allopathic & Osteopathic Physicians - Emergency Medicine',
              },
              {
                'code': '207P00000X',
                'system': 'http://nucc.org/provider-taxonomy',
                'display': 'Allopathic & Osteopathic Physicians - Emergency Medicine',
              },
            ],
          },
        },
        {
          'code': {
            'coding': [
              {
                'code': 'MD',
                'system': 'http://fhir.caremesh.app/r4/caremesh-practitioner-credential',
                'display': 'Doctor of Medicine',
              },
            ],
          },
        },
      ],
    };

    const result=op.apply(rsc);
    expect(fhirpath.evaluate(result, `Practitioner.qualification.code.coding.where(code='207P00000X')`).length).to.equal(0);
  });
});
