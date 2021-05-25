const Operation = require('./operation');

describe('Operation', function() {
  it('should be possible to apply a boolean replace', function() {
    let op = new Operation({
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
    })
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
});
