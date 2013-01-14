suite('should', function() {
  var should = chai.Should();

  test('#test', function() {
    'test'.should.be.a('string');
    should.equal('foo', 'foo');
    should.not.equal('foo', 'bar');
  });
});