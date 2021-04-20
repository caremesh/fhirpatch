import {normalizeResource, processOperation, processValue} from './helpers.mjs';

describe('Helpers @helpers', function() {
  describe('helpers.normalizeResource', function() {
    it(
        'should clone the resource',
        function() {
          const rsc = {
            'resourceType': 'Parameters',
            'parameter': [
              {
                'name': 'operation',
                'parameter': [
                  {
                    'name': 'type',
                    'valueCode': 'add',
                  },
                  {
                    'name': 'path',
                    'valueString': 'Patient',
                  },
                  {
                    'name': 'name',
                    'valueString': 'contact',
                  },
                  {
                    'name': 'value',
                    'parameter': [
                      {
                        'name': 'name',
                        'valueHumanName': {
                          'text': 'a name',
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          };

          const result = normalizeResource(rsc);
          rsc.foo='bar';
          expect(result.foo).to.be.undefined;
        },
    );

    it(
        'should be able to keep an object as an object',
        function() {
          const rsc = {
            'resourceType': 'Parameters',
            'parameter': [
              {
                'name': 'operation',
                'parameter': [
                  {
                    'name': 'type',
                    'valueCode': 'add',
                  },
                  {
                    'name': 'path',
                    'valueString': 'Patient',
                  },
                  {
                    'name': 'name',
                    'valueString': 'contact',
                  },
                  {
                    'name': 'value',
                    'parameter': [
                      {
                        'name': 'name',
                        'valueHumanName': {
                          'text': 'a name',
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          };
          const r=normalizeResource(rsc);
          expect(r).to.be.an('object');
          expect(r.resourceType).to.eql('Parameters');
        },
    );

    it(
        'should be able to convert XML to object',
        function() {
          const rsc=`<Parameters xmlns="http://hl7.org/fhir">
        <parameter>
          <name value="operation"/>
          <part>
            <name value="type"/>
            <valueCode value="replace"/>
          </part>
          <part>
            <name value="path"/>
            <valueString value="Patient.maritalStatus"/>
          </part>
          <part>
            <name value="value"/>
            <valueCodeableConcept id="2">
              <text value="not married"/>
            </valueCodeableConcept>
          </part>
        </parameter>
      </Parameters>`;
          const r=normalizeResource(rsc);
          expect(r).to.be.an('object');
          expect(r.resourceType).to.eql('Parameters');
        },
    );

    it(
        'should be able to convert JSON to object',
        function() {
          const rsc=`{
            "resourceType": "Coverage",
            "id": "7547E",
            "text": {
              "status": "generated",
              "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">A human-readable rendering of the European Health Insurance Card</div>"
            },
            "identifier": [
              {
                "system": "http://ehic.com/insurer/123456789/member",
                "value": "A123456780"
              }
            ],
            "status": "active",
            "type": {
              "coding": [
                {
                  "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                  "code": "EHCPOL",
                  "display": "extended healthcare"
                }
              ]
            },
            "subscriber": {
              "reference": "Patient/5"
            },
            "beneficiary": {
              "reference": "Patient/5"
            },
            "relationship": {
              "coding": [
                {
                  "code": "self"
                }
              ]
            },
            "period": {
              "end": "2012-03-17"
            },
            "payor": [
              {
                "identifier": {
                  "system": "http://ehic.com/insurer",
                  "value": "123456789"
                }
              }
            ]
          }`;
          const r=normalizeResource(rsc);
          expect(r).to.be.an('object');
          expect(r.resourceType).to.eql('Coverage');
        },
    );

    it(
        'should not update an object in place',
        function() {
          const obj = {
            resourceType: 'Practitioner',
          };
          const result = normalizeResource(obj);
          obj.resourceType='Organization';
          expect(result.resourceType).to.eql('Practitioner');
        },
    );
  });

  describe('helpers.processOperation', function() {
    it(
        'should be able to handle an operation with a date value',
        function() {
          const op = {
            name: 'operation',
            parameter: [
              {name: 'type', valueCode: 'replace'},
              {name: 'path', valueString: 'Patient.birthDate'},
              {name: 'value', valueDate: '1930-01-01'},
            ],
          };

          const result = processOperation(op);

          expect(result).to.include({
            operator: 'replace',
            value: '1930-01-01',
            path: 'Patient.birthDate',
          });
        },
    );

    it(
        'should be able to handle a delete operation',
        function() {
          const op = {
            name: 'operation',
            parameter: [
              {name: 'type', valueCode: 'delete'},
              {name: 'path', valueString: 'Patient.birthDate'},
            ],
          };

          const result = processOperation(op);

          expect(result).to.include({
            operator: 'delete',
            path: 'Patient.birthDate',
          });
        },
    );

    it(
        'should be able to handle a replace of code operation',
        function() {
          const op = {
            name: 'operation',
            parameter: [
              {name: 'type', valueCode: 'replace'},
              {name: 'path', valueString: 'Patient.contact[0].gender'},
              {name: 'value', valueCode: 'female'},
            ],
          };

          const result = processOperation(op);

          expect(result).to.include({
            operator: 'replace',
            value: 'female',
            path: 'Patient.contact[0].gender',
          });
        },
    );
  });
});

describe('helpers.processValue', function() {
  it('should be able to process a paramterized object @processValue.1', function() {
    const res = processValue({
      name: 'value',
      parameter: [
        {
          name: 'name',
          valueHumanName: {
            text: 'a name',
          },
        },
      ],
    });

    expect(res).to.eql([{
      'name': {
        'text': 'a name',
      },
    }]);
  });
});
