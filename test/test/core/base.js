suite('JavaScript SDK', function() {
  var should = chai.Should();

  test('#initialize', function() {
  	window.should.have.property('Baas');
  	Baas.should.have.property('io');
  	Baas.io.should.have.property('VERSION');
  });
});