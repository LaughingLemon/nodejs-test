'use strict';

const LambdaTester = require('lambda-tester');
const chai = require( 'chai' );
const sinon = require( 'sinon' );
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;
const proxyquire = require('proxyquire').noCallThru();

var myLambda;

describe('myLambda', function() {
    
    var request;
    var AWS;
    var scanFunc;
    var queryFunc;
    
    before(function() {
        request = {
            get: sinon.stub()
        };
        queryFunc = sinon.stub(),
        scanFunc = sinon.stub()

        AWS = {
            DynamoDB: {
                DocumentClient: sinon.stub().returns({
                    query: queryFunc,
                    scan: scanFunc
                })
            }
        };
        
        myLambda = proxyquire( '../index', {
            'request': request,
            'aws-sdk': AWS
        });
    });
    
    it( 'successful invocation', function() {
        
        request.get.withArgs(sinon.match.any).yields(null, {statusCode: 200}, {name: 'Joe'});
        queryFunc.withArgs(sinon.match.any).yields(null, {name: 'Alan'});
        scanFunc.withArgs(sinon.match.any).yields(null, {name: 'Roger'});
        
        return LambdaTester( myLambda.handler )
            .event( { name: 'Fred' } )
            .expectResult(function(result){
                expect(result).to.exist;
                expect(result.name).to.exist;
                expect(result.name).to.equal('Roger');
            
                expect(request.get).to.have.been.calledOnce;
                expect(scanFunc).to.have.been.calledOnce;
                expect(queryFunc).to.have.been.notCalled;
        });
        
    });    
}); 