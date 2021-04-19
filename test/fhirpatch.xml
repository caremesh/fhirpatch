<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:strip-space elements="*"/><!-- <xsl:output method="text"/> -->
  <xsl:template match="/">
    const FhirPatch = require(&apos;../src/fhirpatch&apos;);
    const Fhir = require(&apos;fhir&apos;).Fhir;
    
    describe(&apos;apply&apos;, function() {
    let fhir;
    before(function() {
    fhir = new Fhir();
    });
    <xsl:for-each select="tests/case">
      it(
      &apos;should handle &quot;<xsl:value-of select="@name"/>&quot;&apos;,
      async function() {
      const input=fhir.xmlToObj(`<xsl:copy-of select="input/*"/>`);
      const output=fhir.xmlToObj(`<xsl:copy-of select="output/*"/>`);
      const diff=fhir.xmlToObj(`<xsl:copy-of select="diff/*"/>`);
      
      const result = new FhirPatch(diff).apply(input);
      expect(result).to.eql(output);
      }
      );
    </xsl:for-each>
    });
  </xsl:template>
</xsl:stylesheet>